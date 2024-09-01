import { attempt, resolveAll, Result } from '../../../shared/check';
import { EventEmitter } from '../../../shared/event-emitter';
import { Loop } from '../../../shared/loop';
import { $Math } from '../../../shared/math';
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
import { compress, decompress } from '../../../shared/compression';

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
        // red: Point2D[][];
        // blue: Point2D[][];
        // black: Point2D[][];
        red: string[],
        blue: string[],
        black: string[]
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
                red: resolveAll(data.pens.red.map(BoardState.pathFromStr)).unwrap(),
                blue: resolveAll(data.pens.blue.map(BoardState.pathFromStr)).unwrap(),
                black: resolveAll(data.pens.black.map(BoardState.pathFromStr)).unwrap(),
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

    public static pathFromStr(str: string) {
        return attempt(() => {
            let temp = true;
            const arr = str
                .split(' ')
                .reduce((acc, val) => {
                    let arr: [number, number];
                    if (temp) {
                        arr = [decompress(val).unwrap(), 0];
                        acc.push(arr);
                        return acc;
                    }
                    arr = acc[acc.length - 1];
                    arr = [arr[0], decompress(val).unwrap()];
                    temp = !temp;
                    return acc;
                }, [] as [number, number][]);

            return new Path(arr);
        });
    }


    public static pathToStr(path: Path) {
        return attempt(() => {
            const grow = (num: number) => Math.round($Math.roundTo(4, num) * 10000);
            const arr = path.points.reduce((acc, val) => {
                return acc + compress(grow(val[0])).unwrap() + ' ' + compress(grow(val[1])).unwrap() + ' ';
            }, '');
            return arr;
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

    toJSON(): Result<JSONState> {
        return attempt(() => {
            return {
                pens: {
                    red: resolveAll(this.pens.red.map(BoardState.pathToStr)).unwrap(),
                    blue: resolveAll(this.pens.blue.map(BoardState.pathToStr)).unwrap(),
                    black: resolveAll(this.pens.black.map(BoardState.pathToStr)).unwrap(),
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
        });
    }

    clone() {
        return attempt(() => {
            return BoardState.fromJSON(this.toJSON().unwrap(), this.board).unwrap();
        });
    }

    setListeners() {
        return attempt(() => {
            const round = (num: number) => $Math.roundTo(4, num);
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
                        p.position.x = round(x);
                        p.position.y = round(y);
                    }
                };
                const end = () => {
                    dragging = undefined;
                    const newBoard = this.clone().unwrap();
                    this.board.push(newBoard);
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

            let point: Point2D | undefined;

            const push = () => {
                if (!currentPath) return;
                if (!point) return;
                const [x, y] = point;
                point = undefined;
                currentPath.points.push([round(x), round(y)]);
            }

            const loop = new Loop(() => {
                push();
            }, 30);

            const set = (x: number, y: number) => point = [x, y];

            const start: E_FN = e => {
                if (dragging) return;
                loop.start();
                const [[x, y]] = canvas.getXY(e.event);
                currentPath = new Path([[round(x), round(y)]]);

                const { color } = this.board.currentProperties;
                currentPath.properties.line.color = color;

                this.pens[color].push(currentPath);
            };
            const draw: E_FN = e => {
                if (dragging) return;
                const canvas = this.board.canvas;
                if (!canvas) return;
                const [[x, y]] = canvas.getXY(e.event);
                set(x, y);
            };
            const end: E_FN = () => {
                loop.stop();
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
