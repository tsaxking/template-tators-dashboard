import { Color } from '../../submodules/colors/color';
import { StateStack } from '../../../shared/statestack';
import { Point2D } from '../../submodules/calculations/src/linear-algebra/point';
import { Whiteboard, WhiteboardState } from './whiteboard';

const robotSize = 0.1; // % of canvas height
const colors: [Color, Color, Color, Color, Color, Color] = [
    new Color(255, 0, 0),
    new Color(250, 10, 10),
    new Color(245, 20, 20),
    new Color(0, 0, 255),
    new Color(10, 10, 250),
    new Color(20, 20, 245),
];

class FieldBoardState extends WhiteboardState {
    static fromJSON(json: string): FieldBoardState | undefined {
        try {
            const obj = JSON.parse(json) as any;
            if (!obj.initPositions || !obj.paths) {
                throw new Error('Invalid JSON: ' + json);
            }
            const state = new FieldBoardState();
            state.initPositions = obj.initPositions;
            state.paths = obj.paths;
            return state;
        } catch (error) {
            console.error(error);
        }
    }

    // red 123, blue 123
    initPositions: [
        Point2D | null,
        Point2D | null,
        Point2D | null,
        Point2D | null,
        Point2D | null,
        Point2D | null,
    ] = [null, null, null, null, null, null];

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);

        for (const pos in this.initPositions) {
            const init = this.initPositions[pos];
            if (!init) continue;
            let [x, y] = init;
            ctx.fillStyle = colors[pos].toString('rgba');
            ctx.beginPath();

            x = x * ctx.canvas.width;
            y = y * ctx.canvas.height;
            ctx.rect(
                x - (robotSize * ctx.canvas.height) / 2,
                y - (robotSize * ctx.canvas.height) / 2,
                robotSize * ctx.canvas.height,
                robotSize * ctx.canvas.height,
            );
            ctx.fill();
        }
    }

    toJSON() {
        return JSON.stringify({
            initPositions: this.initPositions,
            paths: this.paths,
        });
    }
}

export class FieldBoard extends Whiteboard {
    public readonly stack: StateStack<FieldBoardState | WhiteboardState> =
        new StateStack<FieldBoardState | WhiteboardState>(
            new FieldBoardState(),
        );
    public readonly btnGroup: HTMLDivElement;
    public currentRobot: 0 | 1 | 2 | 3 | 4 | 5 = 0; // index of robot in initPositions

    constructor(public readonly ctx: CanvasRenderingContext2D) {
        super(ctx);
        this.setListeners();
        this.btnGroup = document.createElement('div');
        this.btnGroup.classList.add('btn-group');
        ['red-1', 'red-2', 'red-3', 'blue-1', 'blue-2', 'blue-3'].forEach(
            (id, i) => {
                const b = document.createElement('button');
                b.classList.add('btn', 'btn-outline-secondary');
                b.innerText = id;
                const color = colors[i];
                b.style.backgroundColor = color.toString('hex');

                b.onclick = () => (this.currentColor = color);

                this.btnGroup.appendChild(b);

                this.currentRobot = i as 0 | 1 | 2 | 3 | 4 | 5;
            },
        );

        const black = document.createElement('button');
        black.classList.add('btn', 'btn-outline-secondary');
        black.innerText = 'black';
        black.style.backgroundColor = 'black';
        black.onclick = () => (this.currentColor = Color.fromName('black'));

        this.btnGroup.appendChild(black);
    }

    setListeners() {
        super.setListeners();

        const click = (e: MouseEvent) => {
            const [x, y] = this.getMousePos(e);
            const { currentRobot } = this;
            const state = this.stack.current;
            if (state?.data instanceof FieldBoardState) {
                const init = state.data.initPositions[currentRobot];
                if (!init) return;
                init[0] = x;
                init[1] = y;

                const current = this.stack.current?.data;
                if (!current) return;

                const copy = FieldBoardState.fromJSON(current.toJSON());

                this.stack.add(copy!);
            }
        };

        this.canvas.ctx.canvas.addEventListener('click', click);
    }
}
