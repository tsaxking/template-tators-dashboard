import { attempt } from '../../../shared/check';
import { Drawable } from '../canvas/drawable';
import { FIRSTWhiteboard } from '../FIRST/whiteboard';
import { BoardState, JSONState, Pens } from './board-state';

// this class manages all of the states of the board

export class Board extends Drawable {
    public readonly states: BoardState[];
    public currentIndex = -1;

    public readonly currentProperties: {
        color: keyof Pens;
    } = {
        color: 'black'
    };

    constructor(data: string, public readonly whiteboard: FIRSTWhiteboard) {
        super();

        const states = JSON.parse(data) as JSONState[];
        this.states = states.map(s => BoardState.fromJSON(s, this).unwrap());
        this.currentIndex = this.states.length - 1;
    }

    getState(): BoardState | undefined {
        return this.states[this.currentIndex];
    }

    next() {
        if (this.currentIndex < this.states.length - 1) {
            this.getState()?.removeListeners();
            this.currentIndex++;
            this.getState()?.setListeners();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.getState()?.removeListeners();
            this.currentIndex--;
            this.getState()?.setListeners();
        }
    }

    push(state: BoardState) {
        this.getState()?.removeListeners();
        if (this.currentIndex < this.states.length - 1) {
            this.states.splice(this.currentIndex + 1);
        }
        this.states.push(state.clone().unwrap());
        this.whiteboard.update({
            board: this.serialize().unwrap(),
        })
        this.next();
    }

    clear() {
        const state = new BoardState(
            {
                red: [],
                blue: [],
                black: []
            },
            [undefined, undefined, undefined, undefined, undefined, undefined],
            this
        );
        this.push(state);
        return state;
    }

    serialize() {
        return attempt(() => {
            return JSON.stringify(this.states.map(s => s.toJSON()));
        });
    }

    isIn() {
        return true;
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.getState()?.draw(ctx);
    }
}
