import { attempt } from '../../../shared/check';
import { EventEmitter } from '../../../shared/event-emitter';
import {
    Point,
    Point2D
} from '../../../shared/submodules/calculations/src/linear-algebra/point';
import { Color } from '../../submodules/colors/color';
import { CanvasEvent } from '../canvas/canvas';
import { Drawable, DrawableEvent } from '../canvas/drawable';
import { Path } from '../canvas/path';
import { Polygon } from '../canvas/polygon';
import { Board } from './board';

export type Pens = {
    red: Path[];
    blue: Path[];
    black: Path[];
};

export type Positions = [
    Position | undefined,
    Position | undefined,
    Position | undefined,
    Position | undefined,
    Position | undefined,
    Position | undefined
];

export type JSONState = {
    pens: {
        red: Point2D[][];
        blue: Point2D[][];
        black: Point2D[][];
    };
    positions: (
        | {
              position: Point2D;
              color: 'red' | 'blue';
              number: number;
          }
        | undefined
    )[];
};

export class Position extends Drawable {
    public readonly shape: Polygon;

    constructor(
        public readonly position: Point,
        public readonly color: Color,
        public readonly number: number
    ) {
        super();

        this.shape = new Polygon([
            this.position.add(new Point(-5, -5)).array,
            this.position.add(new Point(5, -5)).array,
            this.position.add(new Point(5, 5)).array,
            this.position.add(new Point(-5, 5)).array
        ]);

        this.shape.fill = {
            color: this.color.toString('rgb')
        };
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.shape.draw(ctx);

        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        const textWidth = ctx.measureText(this.number.toString()).width;
        ctx.fillText(
            this.number.toString(),
            this.position.x - textWidth / 2,
            this.position.y + 5
        );
    }

    isIn(point: Point2D) {
        return this.shape.isIn(point);
    }
}

// handles each individual state of the board, and handles all the listeners

export class BoardState {
    public static fromJSON(data: JSONState, board: Board) {
        return attempt(() => {
            const pens: Pens = {
                red: data.pens.red.map(p => {
                    const path = new Path(p);
                    path.properties.line.color = 'red';
                    return path;
                }),
                blue: data.pens.blue.map(p => {
                    const path = new Path(p);
                    path.properties.line.color = 'blue';
                    return path;
                }),
                black: data.pens.black.map(p => {
                    const path = new Path(p);
                    path.properties.line.color = 'black';
                    return path;
                })
            };

            const positions = data.positions.map(p => {
                if (!p) return undefined;
                const color =
                    p.color === 'red'
                        ? Color.fromName('red')
                        : Color.fromName('blue');
                const [x, y] = p.position;
                return new Position(new Point(x, y), color, p.number);
            });

            if (positions.length !== 6) {
                throw new Error('Invalid number of positions');
            }

            return new BoardState(pens, positions as Positions, board);
        });
    }

    constructor(
        public readonly pens: Pens,
        public readonly positions: Positions,
        public readonly board: Board
    ) {
    }

    draw(ctx: CanvasRenderingContext2D) {
        const draw = (pen: Path[]) => {
            for (let i = 0; i < pen.length; i++) {
                pen[i].draw(ctx);
            }
        };
        for (const pen in this.pens) {
            draw(this.pens[pen as keyof Pens]);
        }

        for (let i = 0; i < this.positions.length; i++) {
            this.positions[i]?.draw(ctx);
        }
    }

    toJSON(): JSONState {
        return {
            pens: {
                red: this.pens.red.map(p => p.points.map(p => [p[0], p[1]])),
                blue: this.pens.blue.map(p => p.points.map(p => [p[0], p[1]])),
                black: this.pens.black.map(p => p.points.map(p => [p[0], p[1]]))
            },
            positions: this.positions.map(p => {
                if (!p) return undefined;
                return {
                    position: [p.position.x, p.position.y],
                    color: p.color.closestName.name === 'red' ? 'red' : 'blue',
                    number: p.number
                };
            })
        };
    }

    clone() {
        return BoardState.fromJSON(this.toJSON(), this.board);
    }

    setListeners() {
        return attempt(() => {
            const canvas = this.board.canvas;
            if (!canvas) throw new Error('Canvas not found');
            type E = (
                data: DrawableEvent<unknown> | CanvasEvent<unknown>
            ) => void;
            type E_FN = (
                e:
                    | DrawableEvent<MouseEvent | TouchEvent>
                    | CanvasEvent<MouseEvent | TouchEvent>
            ) => void;
            let dragging: Position | undefined;

            for (let i = 0; i < this.positions.length; i++) {
                const p = this.positions[i];
                if (!p) continue;
                p.on('click', () => {
                    p.canvas?.remove(p);
                    this.positions[i] = undefined;
                });
                const start = () => {
                    dragging = p;
                };
                const drag = (e: DrawableEvent<MouseEvent | TouchEvent>) => {
                    if (dragging) {
                        const canvas = this.board.canvas;
                        if (!canvas) return;
                        const [[x, y]] = canvas.getXY(e.event);
                        p.position.x = x;
                        p.position.y = y;
                    }
                };
                const end = () => {
                    dragging = undefined;
                    const newBoard = this.clone();
                    if (newBoard.isOk()) {
                        this.board.push(newBoard.value);
                    }
                };

                p.on('mousedown', start as E);
                p.on('mousemove', drag as E);
                p.on('mouseup', end as E);
                p.on('mouseleave', end as E);
                p.on('touchstart', start as E);
                p.on('touchmove', drag as E);
                p.on('touchend', end as E);
                p.on('touchcancel', end as E);
            }

            let currentPath: Path | undefined;

            const start: E_FN = e => {
                if (dragging) return;
                const [[x, y]] = canvas.getXY(e.event);
                currentPath = new Path([[x, y]]);

                const { color } = this.board.currentProperties;
                currentPath.properties.line.color = color;

                this.pens[color].push(currentPath);
            };
            const draw: E_FN = e => {
                if (dragging) return;
                const canvas = this.board.canvas;
                if (!canvas) return;
                const [[x, y]] = canvas.getXY(e.event);
                if (currentPath) {
                    currentPath.points.push([x, y]);
                }
            };
            const end: E_FN = () => {
                this.board.push(this.clone().unwrap()); // the next view
                const { color } = this.board.currentProperties;
                this.pens[color].pop(); // remove the current path from the last state

                currentPath = undefined;
            };

            this.board.on('mousedown', start as E);
            this.board.on('mousemove', draw as E);
            this.board.on('mouseup', end as E);
            this.board.on('mouseleave', end as E);
            this.board.on('touchstart', start as E);
            this.board.on('touchmove', draw as E);
            this.board.on('touchend', end as E);
            this.board.on('touchcancel', end as E);
            canvas.on('touchcancel', end as E);
            canvas.on('touchend', end as E);
        });
    }

    removeListeners() {
        for (let i = 0; i < this.positions.length; i++) {
            this.positions[i]?.off('mousedown');
            this.positions[i]?.off('mousemove');
            this.positions[i]?.off('mouseup');
            this.positions[i]?.off('mouseleave');
            this.positions[i]?.off('touchstart');
            this.positions[i]?.off('touchmove');
            this.positions[i]?.off('touchend');
            this.positions[i]?.off('touchcancel');
        }

        this.board.off('mousedown');
        this.board.off('mousemove');
        this.board.off('mouseup');
        this.board.off('mouseleave');
        this.board.off('touchstart');
        this.board.off('touchmove');
        this.board.off('touchend');
        this.board.off('touchcancel');

        this.board.canvas?.emitter.off('touchcancel');
        this.board.canvas?.emitter.off('touchend');
    }
}
