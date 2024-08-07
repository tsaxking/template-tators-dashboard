import {
    Match as MatchObj,
    RetrievedMatchScouting,
    Whiteboard as WhiteboardObj
} from '../../../shared/db-types-extended';
import { EventEmitter } from '../../../shared/event-emitter';
import {
    TBAMatch,
    teamsFromMatch
} from '../../../shared/submodules/tatorscout-calculations/tba';
import {
    RetrieveStreamEventEmitter,
    ServerRequest
} from '../../utilities/requests';
import { FIRSTEvent } from './event';
import { FIRSTTeam } from './team';
import { Strategy } from './strategy';
import { Cache } from '../cache';
import { attemptAsync, Result } from '../../../shared/check';
import { Alliance, FIRSTAlliance } from './alliance';

/**
 * Events that are emitted by a {@link FIRSTMatch} object
 * @date 10/9/2023 - 6:39:41 PM
 *
 * @typedef {FIRSTMatchEventData}
 */
type FIRSTMatchEventData = {
    strategy: Strategy[];
    'match-scouting': RetrievedMatchScouting;
};

type Updates = {
    select: FIRSTMatch;
};

/**
 * Represents a FIRST match
 * @date 10/9/2023 - 6:39:41 PM
 *
 * @export
 * @class FIRSTMatch
 * @typedef {FIRSTMatch}
 */
export class FIRSTMatch extends Cache<FIRSTMatchEventData> {
    private static readonly $emitter: EventEmitter<keyof Updates> =
        new EventEmitter<keyof Updates>();

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: any) => void
    ): void {
        FIRSTMatch.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: any) => void
    ): void {
        FIRSTMatch.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(event: K, data: any): void {
        FIRSTMatch.$emitter.emit(event, data);
    }

    public static once<K extends keyof Updates>(
        event: K,
        callback: (data: any) => void
    ): void {
        FIRSTMatch.$emitter.once(event, callback);
    }

    public static sorter(a: FIRSTMatch, b: FIRSTMatch): number {
        const levels = ['qm', 'qf', 'sf', 'f'];
        const aLevel = levels.indexOf(a.compLevel);
        const bLevel = levels.indexOf(b.compLevel);

        if (aLevel < bLevel) return -1;
        if (aLevel > bLevel) return 1;
        if (+a.number < +b.number) return -1;
        if (+a.number > +b.number) return 1;
        return 0;
    }

    public static current?: FIRSTMatch = undefined;

    /**
     * Map of all FIRSTMatch objects
     * @date 10/9/2023 - 6:39:41 PM
     *
     * @public
     * @static
     * @readonly
     * @type {Map<string, FIRSTMatch>}
     */
    public static readonly cache: Map<string, FIRSTMatch> = new Map<
        string,
        FIRSTMatch
    >();

    /**
     * Creates an instance of FIRSTMatch.
     * @date 10/9/2023 - 6:39:41 PM
     *
     * @constructor
     * @param {TBAMatch} tba
     * @param {FIRSTEvent} event
     */
    constructor(
        public readonly tba: TBAMatch,
        public readonly event: FIRSTEvent
    ) {
        super();

        this.getTeams().then(res => {
            if (res.isOk()) {
                const teams = res.value;

                for (const t of teams) {
                    if (!t) continue;
                    t.on('match-scouting', async () => {
                        const scouting = await this.getMatchScouting();
                        if (scouting.isOk() && scouting.value[t.number])
                            this.$emitter.emit(
                                'match-scouting',
                                scouting.value[t.number]
                            );
                    });
                }
            }
        });
    }

    get number() {
        return this.compLevel === 'sf' ? this.tba.set_number : this.tba.match_number;
        // return this.tba.match_number;
    }

    get compLevel() {
        return this.tba.comp_level;
    }

    get eventKey() {
        return this.event.tba.key;
    }

    get time(): Date {
        return new Date(this.tba.time * 1000);
    }

    get played(): boolean {
        return this.tba.actual_time !== -1;
    }

    /**
     * Streams the strategy for this match
     * Returns an emitter that emits chunks of the strategy
     * @date 10/9/2023 - 6:39:41 PM
     *
     * @public
     * @returns {RetrieveStreamEventEmitter<Strategy>}
     */
    public getStrategy(): RetrieveStreamEventEmitter<Strategy> {
        if (this.$cache.has('strategy')) {
            const res = this.$cache.get('strategy') as Strategy[];

            const em = new RetrieveStreamEventEmitter<Strategy>();

            res.forEach(s => em.emit('chunk', s));

            return em;
        }

        const em = Strategy.from('match', {
            eventKey: this.event.tba.key,
            matchNumber: this.tba.match_number,
            compLevel: this.tba.comp_level
        });

        em.on('complete', data => {
            this.$cache.set('strategy', data);
        });

        return em;
    }

    public async getInfo(): Promise<Result<MatchObj>> {
        return attemptAsync(async () => {
            const info = this.$cache.get('info') as MatchObj;
            if (info) return info;

            const res = await ServerRequest.post<MatchObj>(
                '/api/matches/info',
                {
                    eventKey: this.event.tba.key,
                    matchNumber: this.tba.match_number,
                    compLevel: this.tba.comp_level
                },
                {
                    cached: true
                }
            );

            if (res.isOk()) {
                this.$cache.set('info', res.value);

                return res.value;
            }

            throw res.error;
        });
    }

    /**
     *
     *
     * Retrieves the match scouting for this match in an object with the team number as the key
     * @date 10/9/2023 - 6:39:41 PM
     *
     * @async
     * @returns {Promise<{
            [teamNumber: number]: RetrievedMatchScouting
        }>}
     */
    async getMatchScouting(): Promise<
        Result<{
            [teamNumber: number]: RetrievedMatchScouting;
        }>
    > {
        return attemptAsync(async () => {
            throw new Error('Not implemented');
        });
    }

    async getWhiteboard(): Promise<Result<WhiteboardObj>> {
        return ServerRequest.post<WhiteboardObj>(
            '/api/whiteboard/from-match',
            {
                eventKey: this.event.tba.key,
                matchNumber: this.tba.match_number,
                compLevel: this.tba.comp_level
            },
            {
                cached: true
            }
        );
    }

    /**
     * All teams in this match as FIRSTTeam objects
     * @date 10/9/2023 - 6:39:41 PM
     *
     * @readonly
     * @type {FIRSTTeam[]}
     */
    async getTeams(): Promise<Result<[...Alliance, ...Alliance]>> {
        return attemptAsync(async () => {
            const [r1, r2, r3, rn, b1, b2, b3, bn] = teamsFromMatch(this.tba);

            const _teams = await this.event.getTeams();

            if (_teams.isErr()) throw _teams.error;

            return [r1, r2, r3, rn, b1, b2, b3, bn].map(
                t => _teams.value.find(_t => _t.number === Number(t)) || null
            ) as [...Alliance, ...Alliance];
        });
    }

    async getAlliances(): Promise<
        Result<{ red: FIRSTAlliance; blue: FIRSTAlliance }>
    > {
        return attemptAsync(async () => {
            const teamsRes = await this.getTeams();
            if (teamsRes.isErr()) throw teamsRes.error;

            const [r1, r2, r3, rn, b1, b2, b3, bn] = teamsRes.value;

            const red = new FIRSTAlliance([r1, r2, r3, rn]);
            const blue = new FIRSTAlliance([b1, b2, b3, bn]);

            return { red, blue };
        });
    }

    /**
     * Destroys this object, including all event listeners and cache
     * @date 10/9/2023 - 6:39:41 PM
     *
     * @public
     */
    public destroy() {
        FIRSTMatch.cache.delete(this.tba.key);
        super.destroy();
    }

    public select(): void {
        FIRSTMatch.current = this;
        FIRSTMatch.emit('select', this);
    }
}
