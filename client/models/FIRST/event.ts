import {
    Event as EventProperties,
    Match,
    Team,
} from '../../../shared/db-types-extended';
import {
    TBAEvent,
    TBAMatch,
    TBATeam,
} from '../../../shared/submodules/tatorscout-calculations/tba';
import { ServerRequest } from '../../utilities/requests';
import { TBA } from '../../utilities/tba';
import { FIRSTMatch } from './match';
import { FIRSTTeam } from './team';
import { socket } from '../../utilities/socket';
import { Cache } from '../cache';
import { EventEmitter } from '../../../shared/event-emitter';
import { attemptAsync, Result } from '../../../shared/attempt';
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
    private static readonly $emitter = new EventEmitter<keyof Updates>();

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: Updates[K]) => void,
    ): void {
        FIRSTEvent.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: Updates[K]) => void,
    ): void {
        FIRSTEvent.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(
        event: K,
        data: Updates[K],
    ): void {
        FIRSTEvent.$emitter.emit(event, data);
    }

    public static once<K extends keyof Updates>(
        event: K,
        callback: (data: any) => void,
    ): void {
        FIRSTEvent.$emitter.once(event, callback);
    }
    public static current: FIRSTEvent | null = null;

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
    readonly $cache = new Map<string, unknown>();

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

    /**
     * Returns an array of FIRSTMatch objects for this event
     * if it is cached, it will return the cached data
     * If there is an update, it will emit 'update-matches'. This tests every 10 minutes
     * @returns
     */
    async getMatches(): Promise<Result<FIRSTMatch[]>> {
        return attemptAsync(async () => {
            const c = this.$cache.get('matches');
            if (c) return c as FIRSTMatch[];

            const serverStream = ServerRequest.retrieveStream<Match>(
                '/api/matches/all-from-event',
                {
                    eventKey: this.tba.key,
                },
                JSON.parse,
            );

            const tbaRes = await TBA.get<TBAMatch[]>(
                `/event/${this.tba.key}/matches`,
            );

            if (tbaRes.isOk()) {
                const { value } = tbaRes;
                value.data.sort((a, b) => {
                    const levels = ['qm', 'ef', 'qf', 'sf', 'f'];
                    const aLevel = levels.indexOf(a.comp_level);
                    const bLevel = levels.indexOf(b.comp_level);

                    if (aLevel !== bLevel) return aLevel - bLevel;
                    return a.match_number - b.match_number;
                });

                const matches = value.data.map(
                    (match) => new FIRSTMatch(match, this),
                );

                serverStream.on('chunk', (match) => {
                    const found = matches.find(
                        (m) =>
                            m.event.tba.key === match.eventKey &&
                            m.tba.match_number === match.matchNumber &&
                            m.tba.comp_level === match.compLevel,
                    );

                    if (found) {
                        found.$cache.set('info', match);
                    }
                });

                value.onUpdate((data) => {
                    data.forEach((m) => {
                        const found = matches.find(
                            (_m) =>
                                _m.tba.match_number === m.match_number &&
                                _m.tba.comp_level === m.comp_level,
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
            const c = this.$cache.get('teams');
            if (c) return c as FIRSTTeam[];

            const serverStream = ServerRequest.retrieveStream<Team>(
                '/api/teams/all-from-event',
                {
                    eventKey: this.tba.key,
                },
                JSON.parse,
            );

            const res = await TBA.get<TBATeam[]>(
                `/event/${this.tba.key}/teams`,
            );

            if (res.isOk()) {
                const { value } = res;
                const teams = value.data.map((team) =>
                    new FIRSTTeam(team, this)
                );

                serverStream.on('chunk', (team) => {
                    const found = teams.find(
                        (t) => t.tba.team_number === team.number,
                    );

                    if (found) {
                        found.$cache.set('info', team);
                    }
                });

                value.onUpdate((data) => {
                    data.forEach((t) => {
                        const found = teams.find(
                            (_t) => _t.tba.team_number === t.team_number,
                        );
                        if (found) {
                            // readonly workaround
                            Object.assign(found.tba, t);
                        }
                    });
                });

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
                    eventKey: this.tba.key,
                },
                {
                    cached: true,
                },
            );

            if (res.isOk()) {
                if (!res.value) {
                    console.error(
                        `Event properties for ${this.tba.key} have not been set. The server may not have the event in its database.`,
                    );
                } else this.$cache.set('properties', res.value);

                return res.value;
            }

            throw res.error;
        });
    }

    async getTeam(teamNumber: number): Promise<FIRSTTeam | undefined> {
        const teams = await this.getTeams();
        if (teams.isOk()) {
            return teams.value.find((t) => t.tba.team_number === teamNumber);
        } else return undefined;
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
    }
}

socket.on(
    'event:update-properties',
    (eventKey: string, properties: EventProperties) => {
        const event = FIRSTEvent.cache.get(eventKey);
        if (!event) return;

        event.$cache.set('properties', properties);
        event.$emitter.emit('update-properties', properties);
    },
);
