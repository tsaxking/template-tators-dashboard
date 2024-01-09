import { Color } from "../../submodules/colors/color";
import { StateStack } from "../../../shared/statestack";
import { Point2D } from "../../submodules/calculations/src/linear-algebra/point";
import { Canvas } from "../canvas/canvas";
import { ServerRequest } from "../../utilities/requests";


export type Path = {
    color: Color;
    points: Point2D[];
}

export class WhiteboardState {
    static fromJSON(json: string): WhiteboardState | undefined {
        try {
            const obj = JSON.parse(json) as any;
            if (!obj.initPositions || !obj.states) throw new Error('Invalid JSON: ' + json);
            const state = new WhiteboardState();
            // state.initPositions = obj.initPositions;
            state.paths = obj.paths;
            return state;
        } catch (error) {
            console.error(error);
        }
    }

    paths: Path[] = [];

    draw(ctx: CanvasRenderingContext2D) {
        for (const path of this.paths) {
            ctx.strokeStyle = path.color.toString('rgba');
            ctx.beginPath();
            for (const point of path.points) {
                const [x, y] = point;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    }

    toJSON(): string {
        return JSON.stringify({
            // initPositions: this.initPositions,
            paths: this.paths
        });
    }
}

export class Whiteboard {
    static build(states: WhiteboardState[], ctx: CanvasRenderingContext2D): Whiteboard {
        const wb = new Whiteboard(ctx);
        for (const state of states) {
            wb.stack.add(state);
        }
        return wb;
    }

    public readonly stack: StateStack<WhiteboardState> = new StateStack<WhiteboardState>(new WhiteboardState());
    public readonly canvas: Canvas;
    public currentColor: Color = Color.fromName('black');

    constructor(public readonly ctx: CanvasRenderingContext2D) {
        this.stack.on('change', (state) => {
            this.canvas.clear();
            this.canvas.add(state.data);
        });
        this.canvas = new Canvas(ctx);
        this.setListeners();
    }


    get width() {
        return this.ctx.canvas.width;
    }

    get height() {
        return this.ctx.canvas.height;
    }

    set width(width: number) {
        this.ctx.canvas.width = width;
        this.ctx.canvas.height = width / 2;
    }

    set height(height: number) {
        this.ctx.canvas.height = height;
        this.ctx.canvas.width = height * 2;
    }

    setListeners() {
        let drawing: boolean = false;
        const start = (e: MouseEvent | TouchEvent) => {
            const [x, y] = this.getMousePos(e);
            drawing = true;

            this.stack.current?.data.paths.push({
                color: this.currentColor,
                points: [[x, y]]
            });
        }

        const move = (e: MouseEvent | TouchEvent) => {
            if (!drawing) return;
            const [x, y] = this.getMousePos(e);
            
            const state = this.stack.current;
            if (!state) return; // this shouldn't happen, but it's for typescript

            const { paths } = state.data;

            const currentPath = paths[paths.length - 1];
            if (!currentPath) return; // this shouldn't happen, but it's for typescript

            currentPath.points.push([x, y]);
        }

        const end = (e: MouseEvent | TouchEvent) => {
            drawing = false;

            const state = this.stack.current;
            if (!state) return; // this shouldn't happen, but it's for typescript

            const { paths } = state.data;
            const currentPath = paths[paths.length - 1];
            if (currentPath) {
                const [x, y] = this.getMousePos(e);
                currentPath.points.push([x, y]);
            }

            const s = WhiteboardState.fromJSON(state.data.toJSON());
            if (!s) return;
            this.stack.add(s);
        }

        this.ctx.canvas.addEventListener('mousedown', start);
        this.ctx.canvas.addEventListener('touchstart', start);

        this.ctx.canvas.addEventListener('mousemove', move);
        this.ctx.canvas.addEventListener('touchmove', move);

        this.ctx.canvas.addEventListener('mouseup', end);
        this.ctx.canvas.addEventListener('touchend', end);
        this.ctx.canvas.addEventListener('mouseleave', end);
        this.ctx.canvas.addEventListener('touchcancel', end);
    }

    getMousePos(e: MouseEvent | TouchEvent): Point2D {
        const { left, top } = this.ctx.canvas.getBoundingClientRect();
        const { clientX, clientY } = e instanceof MouseEvent ? e : e.touches[0];
        return [
            (clientX - left) / this.width,
            (clientY - top) / this.height
        ] as Point2D;
    }

    draw() {
        this.canvas.draw();
    }

    animate() {
        return this.canvas.animate();
    }


    undo() {
        return this.stack.prev();
    }

    redo() {
        return this.stack.next();
    }

    clear() {
        const state = new WhiteboardState();
        this.stack.add(state);
    }

    save() {
        const state = this.stack.current;
        if (!state) return;
        const json = state.data.toJSON();
        ServerRequest.post('/api/whiteboard', {
            json
        });
    }
}