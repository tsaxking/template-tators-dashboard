import { Strategy as S } from '../../../server/utilities/tables';
import { attempt, attemptAsync, Result } from '../../../shared/check';
import { EventEmitter } from '../../../shared/event-emitter';
import { ServerRequest } from '../../utilities/requests';
import { socket } from '../../utilities/socket';
import { Cache } from '../cache';
import { CustomMatch } from './custom-match';
import { FIRSTMatch } from './match';
import { FIRSTWhiteboard } from './whiteboard';

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
    public static current: Strategy | undefined;

    private static readonly emitter = new EventEmitter<Updates>();

    public static on = Strategy.emitter.on.bind(Strategy.emitter);
    public static off = Strategy.emitter.off.bind(Strategy.emitter);
    public static emit = Strategy.emitter.emit.bind(Strategy.emitter);
    public static once = Strategy.emitter.once.bind(Strategy.emitter);

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
            const s = (
                await ServerRequest.post<S>('/api/strategy/from-id', { id })
            ).unwrap();
            return Strategy.retrieve(s);
        });
    }

    public static fromMatch(
        eventKey: string,
        matchNumber: number,
        compLevel: string
    ) {
        return attemptAsync(async () => {
            const s = (
                await ServerRequest.post<S[]>('/api/strategy/from-match', {
                    eventKey,
                    matchNumber,
                    compLevel
                })
            ).unwrap();
            return s.map(s => Strategy.retrieve(s));
        });
    }

    public static new(
        data: Omit<
            S,
            | 'id'
            | 'createdBy'
            | 'archive'
            | 'time'
            | 'createdBy'
            | 'checks'
            | 'comment'
        >
    ) {
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
        this.time = +data.time;
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

    update(
        data: Partial<
            Omit<S, 'id' | 'createdBy' | 'checks'> & {
                checks: string[];
            }
        >
    ) {
        return ServerRequest.post('/api/strategy/update', {
            ...this,
            ...data
        });
    }

    getTeams() {
        return attemptAsync(async () => {
            const match = (await this.getMatch()).unwrap();
            return (await match.getTeams()).unwrap();
        });
    }

    getMatch() {
        return attemptAsync(async () => {
            if (this.matchId)
                return (await FIRSTMatch.fromId(this.matchId)).unwrap();
            if (this.customMatchId)
                return (await CustomMatch.fromId(this.customMatchId)).unwrap();
            throw new Error('No match found');
        });
    }

    getChecks() {
        return attemptAsync(async () => {
            return (await Check.from(this)).unwrap();
        });
    }
    select() {
        Strategy.current = this;
        Strategy.emit('select', this);
    }

    getWhiteboards() {
        return FIRSTWhiteboard.fromStrategy(this.id);
    }
}

type CheckEvents = {
    'new-check': string;
    'remove-check': string;
};

export class Check extends EventEmitter<CheckEvents> {
    public static checks = ['a', 'b', 'c', 'd', 'e'];

    public static from(strategy: Strategy) {
        return attemptAsync(async () => {
            const data = strategy.checks;
            const teams = (await strategy.getTeams())
                .unwrap()
                .filter(Boolean)
                .map(t => t.number);
            const checks = data.map(d => d.split(':') as [string, string]);

            console.log('Check.from:', data, teams);
            return teams.map(t => {
                const c = checks.filter(c => +c[0] === t).map(c => c[1]);
                return new Check(t, c, strategy);
            }) as [Check, Check, Check, Check, Check, Check];
        });
    }

    constructor(
        public readonly team: number,
        public checks: string[],
        public readonly strategy: Strategy
    ) {
        super();
    }

    private change() {
        return attemptAsync(async () => {
            const data = this.serialize();
            await this.strategy.update({
                checks: [...data, ...this.strategy.checks]
                    // Remove duplicates
                    .filter((c, i, a) => a.indexOf(c) === i)
            });
        });
    }

    serialize(): string[] {
        // ['2122:check']
        return this.checks.map(c => `${this.team}:${c}`);
    }

    add(check: string) {
        this.checks.push(check);
        this.emit('new-check', check);
        return this.change();
    }

    remove(check: string) {
        this.checks = this.checks.filter(c => c !== check);
        this.emit('remove-check', check);
        return this.change();
    }

    toggle(check: string) {
        if (this.has(check)) {
            return this.remove(check);
        } else {
            return this.add(check);
        }
    }

    has(check: string) {
        return this.checks.includes(check);
    }
}

socket.on('strategy:new', (data: S) => {
    const s = Strategy.retrieve(data);
    Strategy.emit('new', s);
});

socket.on('strategy:update', (data: S) => {
    const s = Strategy.retrieve(data);
    Object.assign(s, data);
    s.checks = JSON.parse(data.checks);
    Strategy.emit('update', s);
});
