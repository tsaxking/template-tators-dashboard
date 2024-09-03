import { Cache } from './cache';
import { DB } from '../../utilities/databases';
import { Whiteboards as W } from '../../utilities/tables';
import { attemptAsync, parseJSON } from '../../../shared/check';
import { uuid } from '../../utilities/uuid';
import { Strategy } from './strategy';
import { JSONState } from '../../../client/models/whiteboard/board-state';

export class FIRSTWhiteboard extends Cache {
    public static fromStrategy(strategyId: string) {
        return attemptAsync(async () => {
            const boards = (
                await DB.all('whiteboards/from-strategy', { strategyId })
            ).unwrap();
            return boards.map(b => new FIRSTWhiteboard(b));
        });
    }

    public static all() {
        return attemptAsync(async () => {
            const boards = (await DB.all('whiteboards/all')).unwrap();
            return boards.map(b => new FIRSTWhiteboard(b));
        });
    }

    public static archived() {
        return attemptAsync(async () => {
            const boards = (await DB.all('whiteboards/archived')).unwrap();
            return boards.map(b => new FIRSTWhiteboard(b));
        });
    }

    public static fromId(id: string) {
        return attemptAsync(async () => {
            const board = (
                await DB.get('whiteboards/from-id', { id })
            ).unwrap();
            return board ? new FIRSTWhiteboard(board) : undefined;
        });
    }

    public static new(data: Omit<W, 'id' | 'archived'>) {
        return attemptAsync(async () => {
            const id = uuid();
            await DB.run('whiteboards/new', { ...data, id });
            return new FIRSTWhiteboard({ ...data, id, archived: false });
        });
    }

    public readonly id: string;
    public name: string;
    public board: string;
    public archived: boolean;
    public strategyId: string;
    constructor(data: W) {
        super();

        this.id = data.id;
        this.name = data.name;
        this.board = data.board;
        this.archived = data.archived;
        this.strategyId = data.strategyId;
    }

    update(data: Partial<Omit<W, 'id' | 'archived'>>) {
        return attemptAsync(async () => {
            await DB.run('whiteboards/update', { ...this, ...data });
            Object.assign(this, data);
        });
    }

    delete() {
        return DB.run('whiteboards/delete', { id: this.id });
    }

    restore() {
        return DB.run('whiteboards/restore', { id: this.id });
    }

    getStrategy() {
        return Strategy.fromId(this.strategyId);
    }

    addState(state: string, index: number) {
        return attemptAsync(async () => {
            const s = JSON.parse(state) as JSONState;
            const states = JSON.parse(this.board) as JSONState[];
            // remove all states after and including index
            states.splice(index);
            states.push(s);
            this.board = JSON.stringify(states);
            return (await this.update({ board: this.board })).unwrap();
        });
    }
}
