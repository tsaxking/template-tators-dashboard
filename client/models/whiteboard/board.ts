import { attempt } from '../../../shared/check';
import { Drawable } from '../canvas/drawable';
import { FIRSTWhiteboard } from '../FIRST/whiteboard';
import { BoardState, WhiteboardState } from './board-state';
import { Stroke } from './stroke';

// this class manages all of the states of the board

export class Board extends Drawable {
    public color: string = 'black';

    public readonly states: BoardState[];
    public currentIndex = -1;

    public drawingStroke = new Stroke([], 'black');

    constructor(
        data: WhiteboardState[],
        public readonly whiteboard: FIRSTWhiteboard
    ) {
        super();

        this.states = data.map(d => BoardState.deserialize(d, this).unwrap());
        this.currentIndex = this.states.length - 1;
    }

    getCurrentState(): BoardState | undefined {
        return this.states[this.currentIndex];
    }

    next() {
        if (this.currentIndex < this.states.length - 1) {
            this.getCurrentState()?.removeListeners();
            this.currentIndex++;
            this.getCurrentState()?.setListeners();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.getCurrentState()?.removeListeners();
            this.currentIndex--;
            this.getCurrentState()?.setListeners();
        }
    }

    push(state: BoardState) {
        if (this.currentIndex < this.states.length - 1) {
            this.states.splice(this.currentIndex + 1);
        }
        this.states.push(state.clone().unwrap());
        this.next();
        this.whiteboard.addState(state, this.currentIndex);
    }

    clear() {
        const state = new BoardState(new Stroke([], 'black'), this, true);
        this.push(state);
        return state;
    }

    serialize() {
        return attempt(() => {
            return JSON.stringify(this.states.map(s => s.serialize()));
        });
    }

    isIn() {
        return true;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const start = this.states.findLastIndex(
            (s, i) => s.clear && i <= this.currentIndex
        );
        const end = this.currentIndex;
        const drawables = this.states.slice(start, end + 1);
        for (const d of drawables) {
            d.draw(ctx);
        }
        this.drawingStroke.draw(ctx);
    }

    setColor(color: string) {
        this.color = color;
        this.drawingStroke.color = color;
    }
}
