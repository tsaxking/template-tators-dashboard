import {
    MatchScoutingComments,
    RetrievedMatchScouting,
    RetrievedScoutingAnswer,
    Team,
    TeamPicture
} from '../../../shared/db-types-extended';
import { EventEmitter } from '../../../shared/event-emitter';
import {
    TBAEvent,
    TBATeam
} from '../../../shared/submodules/tatorscout-calculations/tba';
import {
    RetrieveStreamEventEmitter,
    ServerRequest
} from '../../utilities/requests';
import { TBA } from '../../utilities/tba';
import { socket } from '../../utilities/socket';
import { FIRSTEvent } from './event';
import { Cache } from '../cache';
import { attemptAsync, Result } from '../../../shared/check';
import { MatchScouting } from './match-scouting';
import { Answer } from './question-scouting/answer';
import { Trace } from '../../../shared/submodules/tatorscout-calculations/trace';
import { FIRSTMatch } from './match';
import { TeamComment } from './team-comments';

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
    'new-picture': TeamPicture;
    'new-comment': TeamComment;
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
    private static readonly emitter = new EventEmitter<Updates>();

    public static on = FIRSTTeam.emitter.on.bind(FIRSTTeam.emitter);
    public static off = FIRSTTeam.emitter.off.bind(FIRSTTeam.emitter);
    public static emit = FIRSTTeam.emitter.emit.bind(FIRSTTeam.emitter);
    public static once = FIRSTTeam.emitter.once.bind(FIRSTTeam.emitter);

    public static current?: FIRSTTeam = undefined;

    public static deselect(): void {
        FIRSTTeam.current = undefined;
        FIRSTTeam.emit('select', undefined);
    }

    public static from(team: number, event: string) {
        return attemptAsync(async () => {
            const [tbaTeam, tbaEvent] = await Promise.all([
                TBA.get<TBATeam>(`/event/${event}/team/${team}`),
                TBA.get<TBAEvent>(`/event/${event}`)
            ]);

            const t = tbaTeam.unwrap().data;
            const e = tbaEvent.unwrap().data;

            return FIRSTTeam.retrieve(t, e);
        });
    }

    public static retrieve(team: TBATeam, event: TBAEvent) {
        if (this.cache.has(team.team_number + ':' + event.key)) {
            return this.cache.get(
                team.team_number + ':' + event.key
            ) as FIRSTTeam;
        }

        return new FIRSTTeam(team, FIRSTEvent.retrieve(event));
    }

    /**
     * Map of all FIRSTTeam objects
     * @date 10/9/2023 - 6:55:03 PM
     *
     * @public
     * @static
     * @type {Map<number, FIRSTTeam>}
     */
    // <team number>:<event key>
    public static readonly cache = new Map<string, FIRSTTeam>();

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
        public readonly event: FIRSTEvent
    ) {
        super();
        if (!FIRSTTeam.cache.has(tba.team_number + ':' + event.key)) {
            FIRSTTeam.cache.get(tba.team_number + ':' + event.key)?.destroy();
        }
        FIRSTTeam.cache.set(tba.team_number + ':' + event.key, this);
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
            if (this.cache.has('events')) {
                return this.cache.get('events') as TBAEvent[];
            }

            const res = await TBA.get<TBAEvent[]>(
                `/team/${this.tba.key}/events${simple ? '/simple' : ''}`
            );

            if (res.isOk()) {
                res.value.onUpdate(
                    (data: TBAEvent[]) => {
                        this.emit('update-events', data);
                        this.cache.set('events', data);
                    },
                    1000 * 60 * 60 * 24
                ); // 24 hours

                this.cache.set('events', res.value.data);

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
                    eventKey: this.event.tba.key
                }
            );

            if (res.isOk()) {
                if (res.value) {
                    this.cache.set('watch-priority', res.value.watchPriority);
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
                    eventKey: this.event.tba.key
                }
            );

            if (res.isOk()) {
                this.cache.set('info', res.value);
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
            if (this.cache.has('match-scouting')) {
                return this.cache.get('match-scouting') as MatchScouting[];
            }

            const res = await MatchScouting.fromTeam(
                this.event.key,
                this.number
            );

            if (res.isErr()) throw res.error;

            const data = res.value
                .reverse() // reverse so that the most recent matches are first
                .filter(
                    (s, i, a) =>
                        a.findIndex(_s => {
                            return (
                                _s.matchNumber === s.matchNumber &&
                                _s.compLevel === s.compLevel
                            );
                        }) === i
                );

            this.cache.set('match-scouting', data);
            return data;
        });
    }

    public async getPreScouting() {
        return attemptAsync(async () => {
            const res = await MatchScouting.preFromTeam(
                this.event.key,
                this.number
            );

            if (res.isErr()) throw res.error;

            return res.value.filter((p, i, a) => {
                return (
                    a.findIndex(
                        p2 =>
                            p2.matchNumber === p.matchNumber &&
                            p2.compLevel === p.compLevel
                    ) === i
                );
            });
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
    public async getComments(): Promise<TeamComment[]> {
        const res = await TeamComment.fromTeam(this.number, this.event);

        if (res.isErr()) return [];
        return res.value.filter(c => !!c.comment);
    }

    /**
     * Streams the pit scouting for this team
     * Returns an emitter that emits chunks of the pit scouting
     * @date 10/9/2023 - 6:55:03 PM
     *
     * @public
     * @returns {RetrieveStreamEventEmitter<RetrievedScoutingAnswer>}
     */
    public async getPitScouting(): Promise<Result<Answer[]>> {
        return Answer.fromTeam(this.number, this.event);
    }

    /**
     * Destroys this object, including all event listeners and cache
     * @date 10/9/2023 - 6:55:03 PM
     *
     * @public
     */
    public destroy() {
        FIRSTTeam.cache.delete(this.tba.team_number + ':' + this.event.key);
        super.destroy();
    }

    public select(): void {
        FIRSTTeam.current = this;
        FIRSTTeam.emit('select', this);

        const url = new URL(window.location.href);
        url.searchParams.set('event', this.event.key || '');
        url.searchParams.set('team', String(this.number));

        window.history.pushState({}, '', url.toString());
    }

    public async savePictures(files: FileList): Promise<Result<void>> {
        return attemptAsync(async () => {
            return new Promise((res, rej) => {
                const stream = ServerRequest.streamFiles(
                    '/api/teams/upload-pictures',
                    files,
                    {
                        teamNumber: this.number,
                        eventKey: this.event.key
                    }
                );

                stream.on('error', rej);
                stream.on('complete', () => res());
            });
        });
    }

    async getVelocityData(): Promise<
        Result<{
            map: number[];
            histogram: number[];
            average: number;
            averageSecondsNotMoving: number;
        }>
    > {
        return attemptAsync(async () => {
            const res = await this.getMatchScouting();
            if (res.isErr()) throw res.error;

            const matches = res.value;

            const map = matches.map(m => Trace.velocity.map(m.trace)).flat();

            return {
                map,
                histogram: Trace.velocity.histogram(
                    matches.map(m => m.trace).flat()
                ),
                average: map.reduce((a, b) => a + b, 0) / map.length,
                // 4 ticks per second, so divide by 4, then divide by the number of matches for the average
                averageSecondsNotMoving: map.filter(v => v === 0).length / 4
            };
        });
    }

    async addComment(type: string, comment: string) {
        return TeamComment.new(this, type, comment);
    }

    async getPracticeMatches() {
        return attemptAsync(async () => {
            const res = await MatchScouting.practiceFromTeam(
                this.number,
                this.event.key
            );

            if (res.isErr()) throw res.error;
            return res.value.filter(
                (s, i, a) =>
                    a.findIndex(_s => {
                        return (
                            _s.matchNumber === s.matchNumber &&
                            _s.compLevel === s.compLevel
                        );
                    }) === i
            );
        });
    }

    async getPictures(): Promise<Result<TeamPicture[]>> {
        return attemptAsync(async () => {
            if (this.cache.has('pictures')) {
                return this.cache.get('pictures') as TeamPicture[];
            }
            const res = await ServerRequest.post<TeamPicture[]>(
                '/api/teams/get-pictures',
                {
                    eventKey: this.event.key,
                    teamNumber: this.number
                }
            );

            if (res.isOk()) {
                this.cache.set('pictures', res.value);
                return res.value;
            }

            throw res.error;
        });
    }
}

// update sockets:

socket.on('match-scouting:new', (data: RetrievedMatchScouting) => {
    const team = FIRSTTeam.cache.get(data.team + ':' + data.eventKey);

    if (!team) return;

    // if it's in cache, update by either replacing data or pushing then sorting
    if (team.cache.has('match-scouting')) {
        const ms = team.cache.get('match-scouting') as RetrievedMatchScouting[];
        const match = ms.find(m => m.id === data.id);
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
        team.cache.set('match-scouting', ms);
    }

    team.emit('match-scouting', data);
});

socket.on('match-scouting:delete', (data: RetrievedMatchScouting) => {
    const team = FIRSTTeam.cache.get(data.team + ':' + data.eventKey);

    if (!team) return;

    // if it's in cache, update by either replacing data or pushing then sorting
    if (team.cache.has('match-scouting')) {
        const ms = team.cache.get('match-scouting') as RetrievedMatchScouting[];
        const match = ms.find(m => m.id === data.id);
        if (match) {
            // update
            ms.splice(ms.indexOf(match), 1);
        }
        team.cache.set('match-scouting', ms);
    }

    team.emit('match-scouting', data);
});

// socket.on('match-comments:new', (data: MatchScoutingComments) => {
//     const team = FIRSTTeam.cache.get(data.team + ':' + data.eventKey);

//     if (!team) return;

//     if (team.cache.has('match-comments')) {
//         const mc = team.cache.get('match-comments') as MatchScoutingComments[];
//         const match = mc.find((m) => m.id === data.id);
//         if (match) {
//             mc.splice(mc.indexOf(match), 1, data);
//         } else {
//             mc.push(data);
//         }

//         team.cache.set('match-comments', mc);
//     }

//     team.emit('match-comments', data);
// });

// socket.on('match-comments:delete', (data: MatchScoutingComments) => {
//     const team = FIRSTTeam.cache.get(data.team + ':' + data.eventKey);

//     if (!team) return;

//     if (team.cache.has('match-comments')) {
//         const mc = team.cache.get('match-comments') as MatchScoutingComments[];
//         const match = mc.find((m) => m.id === data.id);
//         if (match) {
//             mc.splice(mc.indexOf(match), 1);
//         }

//         team.cache.set('match-comments', mc);
//     }

//     team.emit('match-comments', data);
// });

socket.on('pit-scouting:new', (data: RetrievedScoutingAnswer) => {
    const team = FIRSTTeam.cache.get(data.teamNumber + ':' + data.eventKey);

    if (!team) return;

    if (team.cache.has('pit-scouting')) {
        const ps = team.cache.get('pit-scouting') as RetrievedScoutingAnswer[];
        const match = ps.find(m => m.id === data.id);
        if (match) {
            ps.splice(ps.indexOf(match), 1, data);
        } else {
            ps.push(data);
        }

        team.cache.set('pit-scouting', ps);
    }

    team.emit('pit-scouting', data);
});

socket.on('pit-scouting:delete', (data: RetrievedScoutingAnswer) => {
    const team = FIRSTTeam.cache.get(data.teamNumber + ':' + data.eventKey);

    if (!team) return;

    if (team.cache.has('pit-scouting')) {
        const ps = team.cache.get('pit-scouting') as RetrievedScoutingAnswer[];
        const match = ps.find(m => m.id === data.id);
        if (match) {
            ps.splice(ps.indexOf(match), 1);
        }

        team.cache.set('pit-scouting', ps);
    }

    team.emit('pit-scouting', data);
});

// TODO: sockets for watch priority

socket.on('teams:pictures-uploaded', async (data: TeamPicture) => {
    const team = FIRSTTeam.cache.get(data.teamNumber + ':' + data.eventKey);
    if (!team) return;

    const pictures = await team.getPictures();

    if (pictures.isErr()) return;

    pictures.value.push({
        picture: data.picture,
        time: data.time,
        accountId: data.accountId,
        eventKey: data.eventKey,
        teamNumber: data.teamNumber
    });

    team.cache.set('pictures', pictures.value);
    team.emit('new-picture', data);
});

Object.assign(window, { FIRSTTeam });
