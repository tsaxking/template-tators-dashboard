import { attemptAsync } from '../../../shared/check';
import { ServerRequest } from '../../utilities/requests';
import { Whiteboards as W } from '../../../server/utilities/tables';
import { Board } from '../whiteboard/board';
import { Canvas } from '../canvas/canvas';
import { Img } from '../canvas/image';
import { Strategy } from './strategy';
import { socket } from '../../utilities/socket';

export class Whiteboard {
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

            return boards.map(b => new Whiteboard(b));
        });
    }

    public static new(name: string, strategy: Strategy) {
        return attemptAsync(async () => {
            const board = new Board('[]'); // empty
            (
                await ServerRequest.post('/api/whiteboards/new', {
                    name,
                    board: board.serialize(),
                    strategyId: strategy.id
                })
            ).unwrap();
        });
    }

    public readonly id: string;
    public name: string;
    public strategyId: string;
    public archived: boolean;
    public readonly board: Board;

    constructor(data: W) {
        // super();
        this.id = data.id;
        this.name = data.name;
        this.strategyId = data.strategyId;
        this.archived = data.archived;
        this.board = new Board(data.board);
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
        c.add(img, this.board);
        return c;
    }

    update(data: Partial<Omit<W, 'id' | 'board' | 'archived'>>) {
        return ServerRequest.post('/api/whiteboards/update', {
            ...this,
            ...data,
            board: this.board.serialize()
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
}


socket.on('whiteboard:update', (data: W) => {
    
});