import { Cache } from './cache';
import { DB } from '../../utilities/databases';
import { Whiteboards as W } from '../../utilities/tables';
import { attemptAsync } from '../../../shared/check';
import { uuid } from '../../utilities/uuid';

export class Whiteboard extends Cache {
    public static fromStrategy(strategyId: string) {
        return attemptAsync(async () => {
            const boards = (
                await DB.all('whiteboards/from-strategy', { strategyId })
            ).unwrap();
            return boards.map(b => new Whiteboard(b));
        });
    }

    public static fromId(id: string) {
        return attemptAsync(async () => {
            const board = (
                await DB.get('whiteboards/from-id', { id })
            ).unwrap();
            return board ? new Whiteboard(board) : undefined;
        });
    }

    public static new(data: Omit<W, 'id'>) {
        return attemptAsync(async () => {
            const id = uuid();
            await DB.run('whiteboards/new', { ...data, id });
            return new Whiteboard({ ...data, id });
        });
    }

    public readonly id: string;
    public name: string;
    public board: string;
    public archive: 0 | 1;
    public strategyId: string;
    constructor(data: W) {
        super();

        this.id = data.id;
        this.name = data.name;
        this.board = data.board;
        this.archive = data.archive;
        this.strategyId = data.strategyId;
    }

    update(data: Partial<Omit<W, 'id'>>) {
        return attemptAsync(async () => {
            await DB.run('whiteboards/update', { ...this, ...data });
            Object.assign(this, data);
        });
    }
}
