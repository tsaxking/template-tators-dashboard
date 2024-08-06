import { Strategy as S } from '../../../server/utilities/tables';
import { attemptAsync } from '../../../shared/check';
import { EventEmitter } from '../../../shared/event-emitter';
import { ServerRequest } from '../../utilities/requests';
import { socket } from '../../utilities/socket';
import { Cache } from '../cache';

/**
 * Events that are emitted by a {@link Strategy} object
 * @date 10/9/2023 - 6:52:30 PM
 *
 * @typedef {StrategyUpdateData}
 */
type StrategyUpdateData = {
    update: unknown;
};

type Updates = {
    select: Strategy;
    new: Strategy;
    update: Strategy;
};


/**
 * Represents the strategy for a match or a custom match. Can be paired with a whiteboard
 * @date 10/9/2023 - 6:52:30 PM
 *
 * @export
 * @class Strategy
 * @typedef {Strategy}
 * @implements {FIRST}
 */
export class Strategy extends Cache<StrategyUpdateData> {
    private static readonly $emitter: EventEmitter<keyof Updates> =
        new EventEmitter<keyof Updates>();

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: Updates[K]) => void
    ): void {
        Strategy.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: Updates[K]) => void
    ): void {
        Strategy.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(event: K, data: Updates[K]): void {
        Strategy.$emitter.emit(event, data);
    }

    /**
     * Map of all Strategy objects
     * @date 10/9/2023 - 6:52:30 PM
     *
     * @public
     * @static
     * @readonly
     * @type {*}
     */
    public static readonly cache: Map<string, Strategy> = new Map<
        string,
        Strategy
    >();


    public static fromId(id: string) {
        return attemptAsync(async () => {
            const s = (await ServerRequest.post<S>('/api/strategy/from-id', { id })).unwrap();
            return Strategy.retrieve(s);
        });
    }

    public static new(data: Omit<S, 'id' | 'createdBy' | 'archive'>) {
        return ServerRequest.post('/api/strategy/new', data);
    }

    public static retrieve(strategy: S): Strategy {
        if (Strategy.cache.has(strategy.id)) {
            return Strategy.cache.get(strategy.id) as Strategy;
        } else {
            return new Strategy(strategy);
        }
    }

    public readonly id: string;
    public name: string;
    public time: number;
    public createdBy: string;
    public matchId: string | undefined;
    public customMatchId: string | undefined;
    public comment: string;
    public archive: 0 | 1;
    public checks: string[];

    constructor(data: S) {
        super();
        this.id = data.id;
        this.name = data.name;
        this.time = data.time;
        this.createdBy = data.createdBy;
        this.matchId = data.matchId;
        this.customMatchId = data.customMatchId;
        this.comment = data.comment;
        this.archive = data.archive;
        this.checks = JSON.parse(data.checks);

        if (Strategy.cache.has(this.id)) {
            throw new Error('Strategy already exists');
        } else {
            Strategy.cache.set(this.id, this);
        }
    }

    update(data: Omit<S, 'id' | 'createdBy'>) {
        return ServerRequest.post('/api/strategy/update', {
            id: this.id,
            ...data,
        });
    }
}

socket.on('strategy:new', (data: S) => {
    const s = Strategy.retrieve(data);
    Strategy.emit('new', s);
});