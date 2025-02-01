import { attemptAsync } from '../../../shared/check';
import { ServerRequest } from '../../utilities/requests';
import { Whiteboards as W } from '../../../server/utilities/tables';
import { Board } from '../whiteboard/board';
import { Canvas } from '../canvas/canvas';
import { Img } from '../canvas/image';
import { Strategy } from './strategy';
import { socket } from '../../utilities/socket';
import { BoardState, WhiteboardState } from '../whiteboard/board-state';
import { Cache } from '../cache';
import { EventEmitter } from '../../../shared/event-emitter';

type WhiteboardEvents = {
    updated: undefined;
};

type GlobalWhiteboardEvents = {
    new: FIRSTWhiteboard;
};

export class FIRSTWhiteboard extends Cache<WhiteboardEvents> {
    public static readonly cache = new Map<string, FIRSTWhiteboard>();

    public static readonly emitter = new EventEmitter<GlobalWhiteboardEvents>();

    public static on = FIRSTWhiteboard.emitter.on.bind(FIRSTWhiteboard.emitter);
    public static off = FIRSTWhiteboard.emitter.off.bind(
        FIRSTWhiteboard.emitter
    );
    public static emit = FIRSTWhiteboard.emitter.emit.bind(
        FIRSTWhiteboard.emitter
    );
    public static once = FIRSTWhiteboard.emitter.once.bind(
        FIRSTWhiteboard.emitter.once.bind(FIRSTWhiteboard.emitter)
    );

    public static fromStrategy(strategyId: string) {
        return attemptAsync(async () => {
            const boards = (
                await ServerRequest.post<W[]>(
                    '/api/whiteboards/from-strategy',
                    {
                        strategyId
                    }
                )
            ).unwrap();

            return boards.map(FIRSTWhiteboard.retrieve);
        });
    }

    public static new(name: string, strategy: Strategy) {
        return attemptAsync(async () => {
            (
                await ServerRequest.post('/api/whiteboards/new', {
                    name,
                    strategyId: strategy.id
                })
            ).unwrap();
        });
    }

    public static retrieve(w: W) {
        if (FIRSTWhiteboard.cache.has(w.id))
            return FIRSTWhiteboard.cache.get(w.id) as FIRSTWhiteboard;
        return new FIRSTWhiteboard(w);
    }

    public readonly id: string;
    public name: string;
    public strategyId: string;
    public archived: boolean;
    public readonly board: Board;

    constructor(data: W) {
        super();
        this.id = data.id;
        this.name = data.name;
        this.strategyId = data.strategyId;
        this.archived = data.archived;
        this.board = new Board(JSON.parse(data.board), this);

        if (!FIRSTWhiteboard.cache.has(this.id))
            FIRSTWhiteboard.cache.set(this.id, this);
    }

    buildCanvas(ctx: CanvasRenderingContext2D, year: number) {
        const img = new Img(`/public/pictures/${year}field.png`);
        img.width = 1;
        img.height = 1;
        const c = new Canvas(ctx, {
            events: [
                'mousedown',
                'mousemove',
                'mouseup',
                'touchstart',
                'touchmove',
                'touchend',
                'touchcancel',
                'click'
            ]
        });
        c.adaptable = true;
        c.ratio = 2;
        c.add(img, this.board);
        return c;
    }

    update(data: Partial<Omit<W, 'id' | 'archived' | 'board'>>) {
        return attemptAsync(async () => {
            return (
                await ServerRequest.post('/api/whiteboards/update', {
                    id: this.id,
                    archived: this.archived,
                    strategyId: data.strategyId ?? this.strategyId,
                    name: data.name ?? this.name
                })
            ).unwrap();
        });
    }

    addState(state: BoardState, index: number) {
        return attemptAsync(async () => {
            return (
                await ServerRequest.post('/api/whiteboards/add-state', {
                    id: this.id,
                    state: JSON.stringify(state.serialize()),
                    index
                })
            ).unwrap();
        });
    }

    archive() {
        return ServerRequest.post('/api/whiteboards/archive', {
            id: this.id
        });
    }

    restore() {
        return ServerRequest.post('/api/whiteboards/restore', {
            id: this.id
        });
    }

    getStrategy() {
        return Strategy.fromId(this.strategyId);
    }
}

socket.on('whiteboard:created', async (data: W) => {
    const wb = FIRSTWhiteboard.retrieve(data);

    FIRSTWhiteboard.emit('new', wb);

    const s = await wb.getStrategy();
    if (s.isErr()) return console.log(s.error);

    s.value.emit('new-whiteboard', wb);
});

socket.on('whiteboard:update', (data: W) => {
    const wb = FIRSTWhiteboard.cache.get(data.id);
    if (!wb) return;

    wb.name = data.name;
    wb.archived = data.archived;
    wb.strategyId = data.strategyId;

    wb.emit('updated', undefined);
});

socket.on(
    'whiteboard:state-added',
    (data: { id: string; state: string; index: number }) => {
        const wb = FIRSTWhiteboard.cache.get(data.id);
        if (!wb) return;

        const state = JSON.parse(data.state) as WhiteboardState;

        const states = wb.board.states;
        const exists = states.find(
            s => JSON.stringify(s.serialize()) === data.state
        );
        if (exists) return console.log('State already exists');

        const parsedState = BoardState.deserialize(state, wb.board).unwrap();
        states.splice(data.index, 0, parsedState);
        wb.board.currentIndex++;

        wb.emit('updated', undefined);
    }
);
