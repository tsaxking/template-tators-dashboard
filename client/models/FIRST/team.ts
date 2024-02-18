import {
    MatchScoutingComments,
    RetrievedMatchScouting,
    RetrievedScoutingAnswer,
    Team,
    TeamPictures,
} from '../../../shared/db-types-extended';
import { EventEmitter } from '../../../shared/event-emitter';
import {
    TBAEvent,
    TBATeam,
} from '../../../shared/submodules/tatorscout-calculations/tba';
import {
    RetrieveStreamEventEmitter,
    ServerRequest,
} from '../../utilities/requests';
import { TBA } from '../../utilities/tba';
import { socket } from '../../utilities/socket';
import { FIRSTEvent } from './event';
import { Cache } from '../cache';
import { attemptAsync, Result } from '../../../shared/attempt';
import { MatchScouting } from './match-scouting';

export type Updates = {
    create: FIRSTTeam;
    update: FIRSTTeam;
    delete: number;
    archive: number;
    restore: number;
    destroy: undefined;
    select: FIRSTTeam | undefined;
    '*': { [key: string]: unknown };
};

/**
 * Events that are emitted by a {@link FIRSTTeam} object
 * @date 10/9/2023 - 6:55:03 PM
 *
 * @typedef {FIRSTTeamEventData}
 */
type FIRSTTeamEventData = {
    'match-scouting': RetrievedMatchScouting;
    'match-comments': MatchScoutingComments;
    'pit-scouting': RetrievedScoutingAnswer;
    'update-events': TBAEvent[];
};

/**
 * Represents a FIRST team
 * @date 10/9/2023 - 6:55:03 PM
 *
 * @export
 * @class FIRSTTeam
 * @typedef {FIRSTTeam}
 * @implements {FIRST}
 */
export class FIRSTTeam extends Cache<FIRSTTeamEventData> {
    private static readonly $emitter = new EventEmitter<keyof Updates>();

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: Updates[K]) => void,
    ): void {
        FIRSTTeam.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: Updates[K]) => void,
    ): void {
        FIRSTTeam.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(
        event: K,
        data: Updates[K],
    ): void {
        FIRSTTeam.$emitter.emit(event, data);
    }

    public static current?: FIRSTTeam = undefined;

    public static deselect(): void {
        FIRSTTeam.current = undefined;
        FIRSTTeam.emit('select', undefined);
    }

    /**
     * Map of all FIRSTTeam objects
     * @date 10/9/2023 - 6:55:03 PM
     *
     * @public
     * @static
     * @type {Map<number, FIRSTTeam>}
     */
    public static readonly $cache = new Map<number, FIRSTTeam>();

    /**
     * Creates an instance of FIRSTTeam.
     * @date 10/9/2023 - 6:55:03 PM
     *
     * @constructor
     * @param {TBATeam} tba
     * @param {FIRSTEvent} event
     */
    constructor(
        public readonly tba: TBATeam,
        public readonly event: FIRSTEvent,
    ) {
        super();
        if (!FIRSTTeam.$cache.has(tba.team_number)) {
            FIRSTTeam.$cache.get(tba.team_number)?.destroy();
        }
        FIRSTTeam.$cache.set(tba.team_number, this);
    }

    get number(): number {
        return this.tba.team_number;
    }

    get name(): string {
        return this.tba.nickname;
    }

    /**
     * Requests all events from TBA
     * Also starts an update that will update the cache every 24 hours and emit 'update-events' when it does
     * @date 10/9/2023 - 6:55:03 PM
     *
     * @public
     * @async
     * @param {boolean} [simple=false]
     * @returns {Promise<TBAEvent[]>}
     */
    public async getEvents(simple = false): Promise<Result<TBAEvent[]>> {
        return attemptAsync(async () => {
            if (this.$cache.has('events')) {
                return this.$cache.get('events') as TBAEvent[];
            }

            const res = await TBA.get<TBAEvent[]>(
                `/team/${this.tba.key}/events${simple ? '/simple' : ''}`,
            );

            if (res.isOk()) {
                res.value.onUpdate(
                    (data: TBAEvent[]) => {
                        this.$emitter.emit('update-events', data);
                        this.$cache.set('events', data);
                    },
                    1000 * 60 * 60 * 24,
                ); // 24 hours

                this.$cache.set('events', res.value.data);

                return res.value.data;
            }

            throw res.error;
        });
    }

    /**
     * Retrieves the watch priority from the server
     * If cached, it will return the cached value
     *
     * @date 10/9/2023 - 6:55:03 PM
     *
     * @public
     * @async
     * @returns {Promise<number>}
     */
    public async getWatchPriority(): Promise<Result<number>> {
        return attemptAsync(async () => {
            const res = await ServerRequest.post<Team | undefined>(
                '/api/teams/properties',
                {
                    teamKey: this.tba.key,
                    eventKey: this.event.tba.key,
                },
            );

            if (res.isOk()) {
                if (res.value) {
                    this.$cache.set('watch-priority', res.value.watchPriority);
                    return res.value.watchPriority;
                }

                return 0;
            }

            throw res.error;
        });
    }

    public async getInfo(): Promise<Result<Team>> {
        return attemptAsync(async () => {
            const res = await ServerRequest.post<Team>(
                '/api/teams/properties',
                {
                    teamKey: this.tba.key,
                    eventKey: this.event.tba.key,
                },
            );

            if (res.isOk()) {
                this.$cache.set('info', res.value);
                return res.value;
            }

            throw res.error;
        });
    }

    /**
     * Streams the match scouting for this team
     * Returns an emitter that emits chunks of the match scouting
     * @date 10/9/2023 - 6:55:03 PM
     *
     * @public
     * @returns {RetrieveStreamEventEmitter<RetrievedMatchScouting>}
     */
    public async getMatchScouting(): Promise<Result<MatchScouting[]>> {
        return attemptAsync(async () => {
            if (this.$cache.has('match-scouting')) {
                return this.$cache.get('match-scouting') as MatchScouting[];
            }

            const res = await MatchScouting.fromTeam(
                this.event.key,
                this.number
            );

            if (res.isErr()) throw res.error;

            this.$cache.set('match-scouting', res.value);
            return res.value;
        });
    }

    /**
     * Streams the match comments for this team
     * Returns an emitter that emits chunks of the match comments
     * @date 10/9/2023 - 6:55:03 PM
     *
     * @public
     * @returns {RetrieveStreamEventEmitter<MatchScoutingComments>}
     */
    public getMatchComments(): RetrieveStreamEventEmitter<
        MatchScoutingComments
    > {
        if (this.$cache.has('match-comments')) {
            const res = this.$cache.get(
                'match-comments',
            ) as MatchScoutingComments[];

            const em = new RetrieveStreamEventEmitter<MatchScoutingComments>();

            setTimeout(() => res.forEach((ms) => em.emit('chunk', ms)));

            return em;
        }

        const em = ServerRequest.retrieveStream<MatchScoutingComments>(
            '/api/teams/match-comments',
            {
                team: this.tba.team_number,
                eventKey: this.event.tba.key,
            },
            JSON.parse,
        );

        em.on('complete', (data) => {
            this.$cache.set('match-comments', data);
        });

        return em;
    }

    /**
     * Streams the pit scouting for this team
     * Returns an emitter that emits chunks of the pit scouting
     * @date 10/9/2023 - 6:55:03 PM
     *
     * @public
     * @returns {RetrieveStreamEventEmitter<RetrievedScoutingAnswer>}
     */
    public getPitScouting(): RetrieveStreamEventEmitter<
        RetrievedScoutingAnswer
    > {
        if (this.$cache.has('pit-scouting')) {
            const res = this.$cache.get(
                'pit-scouting',
            ) as RetrievedScoutingAnswer[];

            const em = new RetrieveStreamEventEmitter<
                RetrievedScoutingAnswer
            >();

            setTimeout(() => res.forEach((ms) => em.emit('chunk', ms)));

            return em;
        }

        const em = ServerRequest.retrieveStream<RetrievedScoutingAnswer>(
            '/api/teams/pit-scouting',
            {
                team: this.tba.team_number,
                eventKey: this.event.tba.key,
            },
            JSON.parse,
        );

        em.on('complete', (data) => {
            this.$cache.set('pit-scouting', data);
        });

        return em;
    }

    /**
     * Destroys this object, including all event listeners and cache
     * @date 10/9/2023 - 6:55:03 PM
     *
     * @public
     */
    public destroy() {
        FIRSTTeam.$cache.delete(this.tba.team_number);
        super.destroy();
    }

    public select(): void {
        FIRSTTeam.current = this;
        FIRSTTeam.emit('select', this);
    }

    public async savePictures(files: FileList): Promise<Result<void>> {
        return attemptAsync(async () => {
            return new Promise((res, rej) => {
                const stream = ServerRequest.streamFiles(
                    '/api/teams/upload-pictures',
                    files,
                    {
                        teamNumber: this.number,
                        eventKey: this.event.key,
                    },
                );

                stream.on('error', rej);
                stream.on('complete', res);
            });
        });
    }

    public async getPictures(): Promise<Result<TeamPictures[]>> {
        return attemptAsync(async () => {
            if (this.$cache.has('pictures')) {
                return this.$cache.get('pictures') as TeamPictures[];
            }

            const res = await ServerRequest.post<TeamPictures[]>(
                '/api/teams/get-pictures',
                {
                    teamNumber: this.number,
                    eventKey: this.event.key,
                },
            );

            if (res.isOk()) {
                this.$cache.set('pictures', res.value);
                return res.value;
            }

            throw res.error;
        });
    }
}

// update sockets:

socket.on('match-scouting:new', (data: RetrievedMatchScouting) => {
    const team = FIRSTTeam.$cache.get(data.team);

    if (!team) return;

    // if it's in cache, update by either replacing data or pushing then sorting
    if (team.$cache.has('match-scouting')) {
        const ms = team.$cache.get(
            'match-scouting',
        ) as RetrievedMatchScouting[];
        const match = ms.find((m) => m.id === data.id);
        if (match) {
            // update
            ms.splice(ms.indexOf(match), 1, data);
        } else {
            // add then sort
            ms.push(data);
            ms.sort((a, b) => {
                const levels = ['qm', 'qf', 'sf', 'f'];
                if (a.compLevel === b.compLevel) {
                    return a.matchNumber - b.matchNumber;
                }
                return (
                    levels.indexOf(a.compLevel) - levels.indexOf(b.compLevel)
                );
            });
        }
        team.$cache.set('match-scouting', ms);
    }

    team.$emitter.emit('match-scouting', data);
});

socket.on('match-scouting:delete', (data: RetrievedMatchScouting) => {
    const team = FIRSTTeam.$cache.get(data.team);

    if (!team) return;

    // if it's in cache, update by either replacing data or pushing then sorting
    if (team.$cache.has('match-scouting')) {
        const ms = team.$cache.get(
            'match-scouting',
        ) as RetrievedMatchScouting[];
        const match = ms.find((m) => m.id === data.id);
        if (match) {
            // update
            ms.splice(ms.indexOf(match), 1);
        }
        team.$cache.set('match-scouting', ms);
    }

    team.$emitter.emit('match-scouting', data);
});

socket.on('match-comments:new', (data: MatchScoutingComments) => {
    const team = FIRSTTeam.$cache.get(data.team);

    if (!team) return;

    if (team.$cache.has('match-comments')) {
        const mc = team.$cache.get('match-comments') as MatchScoutingComments[];
        const match = mc.find((m) => m.id === data.id);
        if (match) {
            mc.splice(mc.indexOf(match), 1, data);
        } else {
            mc.push(data);
        }

        team.$cache.set('match-comments', mc);
    }

    team.$emitter.emit('match-comments', data);
});

socket.on('match-comments:delete', (data: MatchScoutingComments) => {
    const team = FIRSTTeam.$cache.get(data.team);

    if (!team) return;

    if (team.$cache.has('match-comments')) {
        const mc = team.$cache.get('match-comments') as MatchScoutingComments[];
        const match = mc.find((m) => m.id === data.id);
        if (match) {
            mc.splice(mc.indexOf(match), 1);
        }

        team.$cache.set('match-comments', mc);
    }

    team.$emitter.emit('match-comments', data);
});

socket.on('pit-scouting:new', (data: RetrievedScoutingAnswer) => {
    const team = FIRSTTeam.$cache.get(data.teamNumber);

    if (!team) return;

    if (team.$cache.has('pit-scouting')) {
        const ps = team.$cache.get('pit-scouting') as RetrievedScoutingAnswer[];
        const match = ps.find((m) => m.id === data.id);
        if (match) {
            ps.splice(ps.indexOf(match), 1, data);
        } else {
            ps.push(data);
        }

        team.$cache.set('pit-scouting', ps);
    }

    team.$emitter.emit('pit-scouting', data);
});

socket.on('pit-scouting:delete', (data: RetrievedScoutingAnswer) => {
    const team = FIRSTTeam.$cache.get(data.teamNumber);

    if (!team) return;

    if (team.$cache.has('pit-scouting')) {
        const ps = team.$cache.get('pit-scouting') as RetrievedScoutingAnswer[];
        const match = ps.find((m) => m.id === data.id);
        if (match) {
            ps.splice(ps.indexOf(match), 1);
        }

        team.$cache.set('pit-scouting', ps);
    }

    team.$emitter.emit('pit-scouting', data);
});

// TODO: sockets for watch priority
// TODO: sockets for picture upload
