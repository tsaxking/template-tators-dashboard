import { Cache } from '../cache';
import { EventEmitter } from '../../../shared/event-emitter';
import { MatchScouting as MatchScoutingObj } from '../../../shared/db-types-extended';
import { ServerRequest } from '../../utilities/requests';
import { Result, attemptAsync } from '../../../shared/check';
import { TraceArray } from '../../../shared/submodules/tatorscout-calculations/trace';
import { socket } from '../../utilities/socket';

type MatchScoutingEvents = {
    update: MatchScouting;
};

type Updates = {
    select: MatchScouting;
    new: MatchScouting;
};

export class MatchScouting extends Cache<MatchScoutingEvents> {
    private static readonly $emitter = new EventEmitter<keyof Updates>();

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: Updates[K]) => void,
    ): void {
        MatchScouting.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: Updates[K]) => void,
    ): void {
        MatchScouting.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(
        event: K,
        data: Updates[K],
    ): void {
        MatchScouting.$emitter.emit(event, data);
    }

    public static once<K extends keyof Updates>(
        event: K,
        callback: (data: Updates[K]) => void,
    ): void {
        MatchScouting.$emitter.once(event, callback);
    }

    /**
     * Cache for all {@link MatchScouting} objects
     * @date 10/9/2023 - 6:59:50 PM
     *
     * @public
     * @static
     * @readonly
     * @type {Map<string, MatchScouting>}
     */
    public static readonly cache: Map<string, MatchScouting> = new Map<
        string,
        MatchScouting
    >();

    public static async fromTeam(
        eventKey: string,
        teamNumber: number,
    ): Promise<Result<MatchScouting[]>> {
        return attemptAsync(async () => {
            const all = MatchScouting.cache.values();
            const filtered = Array.from(all).filter((m) => {
                return m.eventKey === eventKey && m.team === teamNumber;
            });
            if (filtered.length) return filtered;

            const res = await ServerRequest.post<MatchScoutingObj[]>(
                '/api/match-scouting/from-team',
                {
                    eventKey,
                    teamNumber,
                },
            );

            if (res.isErr()) throw res.error;
            return res.value.map((d) => new MatchScouting(d));
        });
    }

    public readonly id: string;
    public readonly matchId: string | undefined;
    public readonly team: number;
    public readonly scoutId: string | undefined;
    public readonly scoutGroup: number;
    public readonly scoutName: string;
    public readonly trace: TraceArray;
    public readonly checks: string;
    public readonly preScouting: string | undefined;
    public readonly time: number;
    public readonly prescouting: string | undefined;
    public readonly eventKey: string;
    public readonly matchNumber: number;
    public readonly compLevel: string;

    constructor(data: MatchScoutingObj) {
        super();
        this.id = data.id;
        this.matchId = data.matchId;
        this.team = data.team;
        this.scoutId = data.scoutId;
        this.scoutGroup = data.scoutGroup;
        this.scoutName = data.scoutName;
        this.trace = JSON.parse(data.trace);
        this.checks = data.checks;
        this.preScouting = data.preScouting;
        this.time = data.time;
        this.prescouting = data.prescouting;
        this.eventKey = data.eventKey;
        this.matchNumber = data.matchNumber;
        this.compLevel = data.compLevel;

        if (MatchScouting.cache.has(this.id)) {
            MatchScouting.cache.delete(this.id);
        }

        MatchScouting.cache.set(this.id, this);
    }
}


socket.on('match-scouting:new', (data: MatchScoutingObj) => {
    const m = new MatchScouting(data);
    MatchScouting.emit('new', m);
});