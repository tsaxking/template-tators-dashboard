import {
    Event as EventProperties,
    Match,
    Team,
    TeamPicture
} from '../../../shared/db-types-extended';
import {
    matchSort,
    TBAEvent,
    TBAMatch,
    TBATeam
} from '../../../shared/submodules/tatorscout-calculations/tba';
import { ServerRequest } from '../../utilities/requests';
import { TBA } from '../../utilities/tba';
import { FIRSTMatch } from './match';
import { FIRSTTeam } from './team';
import { socket } from '../../utilities/socket';
import { Cache } from '../cache';
import { EventEmitter } from '../../../shared/event-emitter';
import { attemptAsync, resolveAll, Result } from '../../../shared/check';
import { Section } from './question-scouting/section';
import { Group } from './question-scouting/group';
import { Question } from './question-scouting/question';
/**
 * All events that are emitted by a {@link FIRSTEvent} object
 * @date 10/9/2023 - 6:36:17 PM
 *
 * @typedef {FIRSTEventData}
 */
type FIRSTEventData = {
    'update-teams': FIRSTTeam[];
    'update-matches': FIRSTMatch[];
    'update-properties': EventProperties;
};

type Updates = {
    select: FIRSTEvent;
};

/**
 * Represents a FIRST event
 * @date 10/9/2023 - 6:36:17 PM
 *
 * @export
 * @class FIRSTEvent
 * @typedef {FIRSTEvent}
 */
export class FIRSTEvent extends Cache<FIRSTEventData> {
    private static readonly emitter = new EventEmitter<Updates>();

    public static on = FIRSTEvent.emitter.on.bind(FIRSTEvent.emitter);
    public static off = FIRSTEvent.emitter.off.bind(FIRSTEvent.emitter);
    public static emit = FIRSTEvent.emitter.emit.bind(FIRSTEvent.emitter);
    public static once = FIRSTEvent.emitter.once.bind(FIRSTEvent.emitter);

    public static current: FIRSTEvent | undefined = undefined;

    public static retrieve(event: TBAEvent) {
        if (FIRSTEvent.cache.has(event.key)) {
            return FIRSTEvent.cache.get(event.key) as FIRSTEvent;
        }
        return new FIRSTEvent(event);
    }

    /**
     * Map of all FIRSTEvent objects
     * @date 10/9/2023 - 6:36:17 PM
     *
     * @public
     * @static
     * @readonly
     * @type {Map<string, FIRSTEvent>}
     */
    public static readonly cache = new Map<string, FIRSTEvent>();

    /**
     * Cache for data pertaining to this event
     * @date 10/9/2023 - 6:36:17 PM
     *
     * @readonly
     * @type {Map<string, any>}
     */
    readonly cache = new Map<string, unknown>();

    /**
     * Creates an instance of FIRSTEvent
     * @date 10/9/2023 - 6:36:17 PM
     *
     * @constructor
     * @param {TBAEvent} tba
     */
    constructor(public readonly tba: TBAEvent) {
        super();
        if (!FIRSTEvent.cache.has(tba.key)) {
            FIRSTEvent.cache.get(tba.key)?.destroy();
        }
        FIRSTEvent.cache.set(tba.key, this);
    }

    get key() {
        return this.tba.key;
    }

    get name() {
        return this.tba.name;
    }

    get year() {
        return this.tba.year;
    }

    /**
     * Returns an array of FIRSTMatch objects for this event
     * if it is cached, it will return the cached data
     * If there is an update, it will emit 'update-matches'. This tests every 10 minutes
     * @returns
     */
    async getMatches(): Promise<Result<FIRSTMatch[]>> {
        return attemptAsync(async () => {
            const c = this.cache.get('matches');
            if (c) return c as FIRSTMatch[];

            const serverStream = ServerRequest.retrieveStream<Match>(
                '/api/matches/all-from-event',
                {
                    eventKey: this.tba.key
                },
                JSON.parse
            );

            const tbaRes = await TBA.get<TBAMatch[]>(
                `/event/${this.tba.key}/matches`
            );

            if (tbaRes.isOk()) {
                const { value } = tbaRes;
                value.data.sort(matchSort);

                const matches = value.data.map(
                    match => new FIRSTMatch(match, this)
                );

                serverStream.on('chunk', match => {
                    const found = matches.find(
                        m =>
                            m.event.tba.key === match.eventKey &&
                            m.tba.match_number === match.matchNumber &&
                            m.tba.comp_level === match.compLevel
                    );

                    if (found) {
                        found.cache.set('info', match);
                    }
                });

                value.onUpdate(data => {
                    data.forEach(m => {
                        const found = matches.find(
                            _m =>
                                _m.tba.match_number === m.match_number &&
                                _m.tba.comp_level === m.comp_level
                        );
                        if (found) {
                            // readonly workaround
                            Object.assign(found.tba, m);
                        }
                    });
                });

                return matches;
            }
            throw tbaRes.error;
        });
    }

    /**
     *  Returns an array of FIRSTTeam objects for this event
     *  if it is cached, it will return the cached data
     *  If there is an update, it will emit 'update-teams'. This tests every 24 hours
     * @returns
     */
    async getTeams(): Promise<Result<FIRSTTeam[]>> {
        return attemptAsync(async () => {
            const c = this.cache.get('teams') as FIRSTTeam[];
            if (c && c.length) return c;

            const res = await TBA.get<TBATeam[]>(
                `/event/${this.tba.key}/teams`
            );

            if (res.isOk()) {
                const { value } = res;
                const teams = value.data.map(team => new FIRSTTeam(team, this));

                teams.sort((a, b) => a.number - b.number);

                value.onUpdate(data => {
                    data.forEach(t => {
                        const found = teams.find(
                            _t => _t.tba.team_number === t.team_number
                        );
                        if (found) {
                            // readonly workaround
                            Object.assign(found.tba, t);
                        }
                    });
                });

                this.cache.set('teams', teams);

                return teams;
            }

            throw res.error;
        });
    }

    /**
     * Returns the event properties for this event
     * if it is cached, it will return the cached data
     * @returns
     */
    async getEventProperties(): Promise<Result<EventProperties | undefined>> {
        return attemptAsync(async () => {
            const res = await ServerRequest.post<EventProperties | undefined>(
                '/api/events/properties',
                {
                    eventKey: this.tba.key
                },
                {
                    cached: true
                }
            );

            if (res.isOk()) {
                if (!res.value) {
                    console.error(
                        `Event properties for ${this.tba.key} have not been set. The server may not have the event in its database.`
                    );
                } else this.cache.set('properties', res.value);

                return res.value;
            }

            throw res.error;
        });
    }

    async cacheTeamPictures() {
        const teams = await this.getTeams();
        if (teams.isErr()) return;

        if (teams.value.some(t => t.cache.has('pictures'))) return;

        const res = await ServerRequest.post<TeamPicture[]>(
            '/api/teams/pictures-from-event',
            {
                eventKey: this.key
            }
        );

        if (res.isOk()) {
            for (const p of res.value) {
                const t = teams.value.find(t => t.number === p.teamNumber);
                if (!t) continue;
                t.cache.set(
                    'pictures',
                    [
                        ...(() => {
                            if (t.cache.has('pictures'))
                                return t.cache.get('pictures') as TeamPicture[];
                            return [];
                        })(),
                        p
                    ].filter(
                        (p, i, a) =>
                            a.findIndex(_p => _p.picture === p.picture) === i
                    )
                );
            }
        }
    }

    async getTeam(teamNumber: number): Promise<FIRSTTeam | undefined> {
        const teams = await this.getTeams();
        if (teams.isOk()) {
            return teams.value.find(t => t.tba.team_number === teamNumber);
        }
        return undefined;
    }

    /**
     * Destroys this event object, removing it from the cache and clearing all data
     */
    public destroy(): void {
        FIRSTEvent.cache.delete(this.tba.key);
        super.destroy();
    }

    select(): void {
        FIRSTEvent.current = this;
        FIRSTEvent.emit('select', this);
        const url = new URL(window.location.href);
        url.searchParams.set('event', this.tba.key);
        window.history.replaceState({}, '', url.toString());
    }

    async getPitScouting(): Promise<
        Result<{
            sections: Section[];
            groups: Group[];
            questions: Question[];
        }>
    > {
        return attemptAsync(async () => {
            // const sections = await Section.all();

            const [sections, groups, questions] = await Promise.all([
                Section.all(),
                Group.fromEvent(this.key),
                Question.fromEvent(this.key)
            ]);

            if (questions.isErr()) throw questions.error;
            if (groups.isErr()) throw groups.error;

            return {
                sections,
                groups: groups.value,
                questions: questions.value
            };
        });
    }

    async getStatus(): Promise<
        Result<{
            pictures: number[];
            matches: {
                match: number;
                compLevel: 'qm' | 'qf' | 'sf' | 'f';
                teams: number[];
            }[];
            questions: {
                team: number;
                questions: string[];
            }[];
        }>
    > {
        return ServerRequest.post<{
            pictures: number[];
            matches: {
                match: number;
                compLevel: 'qm' | 'qf' | 'sf' | 'f';
                teams: number[];
            }[];
            questions: {
                team: number;
                questions: string[];
            }[];
        }>('/api/events/status', {
            eventKey: this.key
        });
    }

    async getEventSummary(): Promise<
        Result<
            {
                labels: string[];
                title: string;
                data: {
                    [key: number]: number[];
                };
            }[]
        >
    > {
        return attemptAsync(async () => {
            const res = await ServerRequest.post<
                {
                    labels: string[];
                    title: string;
                    data: {
                        [key: number]: number[];
                    };
                }[]
            >('/api/events/summary', {
                eventKey: this.key
            });

            if (res.isOk()) return res.value;
            throw res.error;
        });
    }

    async copyQuestionsFromEvent(eventKey: string) {
        return attemptAsync(async () => {
            if (eventKey === this.key) throw new Error('Cannot copy from self');

            const res = await ServerRequest.post(
                '/api/scouting-questions/copy-questions',
                {
                    from: eventKey,
                    to: this.key
                }
            );

            if (res.isOk()) return;
            throw res.error;
        });
    }
}

// socket.on(
//     'event:update-properties',
//     ({ eventKey, properties }: { eventKey: string; properties: string }) => {
//         const event = FIRSTEvent.cache.get(eventKey);
//         if (!event) return;

//         event.cache.set('properties', properties);
//         event.emit('update-properties', properties);
//     }
// );

FIRSTEvent.on('select', async e => {
    const url = new URL(window.location.href);
    const res = await e.getTeams();
    if (res.isErr()) return console.error(res.error);
    const t = url.searchParams.get('team');
    if (t) {
        const team = res.value.find(_t => _t.number === +t);
        if (team) return team.select();
    } else {
        const team = res.value.find(t => t.number === 2122);
        if (team) team.select();
    }
});

Object.assign(window, { FIRSTEvent });
