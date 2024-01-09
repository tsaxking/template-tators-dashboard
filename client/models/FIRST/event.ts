import { Event as EventProperties, Match, Team } from "../../../shared/db-types-extended";
import { TBAEvent, TBAMatch, TBATeam } from "../../../shared/tba";
import { ServerRequest } from "../../utilities/requests";
import { TBA, TBAResponse } from "../../utilities/tba";
import { FIRSTMatch } from "./match";
import { FIRSTTeam } from "./team";
import { socket } from '../../utilities/socket';
import { Cache, Updates } from "../cache";
import { EventEmitter } from "../../../shared/event-emitter";
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
}


/**
 * Represents a FIRST event
 * @date 10/9/2023 - 6:36:17 PM
 *
 * @export
 * @class FIRSTEvent
 * @typedef {FIRSTEvent}
 */
export class FIRSTEvent extends Cache<FIRSTEventData> {
    private static readonly $emitter: EventEmitter<Updates> = new EventEmitter<Updates>();


    public static on<K extends Updates>(event: K, callback: (data: any) => void): void {
        FIRSTEvent.$emitter.on(event, callback);
    }

    public static off<K extends Updates>(event: K, callback?: (data: any) => void): void {
        FIRSTEvent.$emitter.off(event, callback);
    }


    public static emit<K extends Updates>(event: K, data: any): void {
        FIRSTEvent.$emitter.emit(event, data);
    }
    public static current?: FIRSTEvent = undefined;
    
    /**
     * Map of all FIRSTEvent objects
     * @date 10/9/2023 - 6:36:17 PM
     *
     * @public
     * @static
     * @readonly
     * @type {Map<string, FIRSTEvent>}
     */
    public static readonly cache: Map<string, FIRSTEvent> = new Map<string, FIRSTEvent>();

    /**
     * Cache for data pertaining to this event
     * @date 10/9/2023 - 6:36:17 PM
     *
     * @readonly
     * @type {Map<string, any>}
     */
    readonly $cache: Map<string, any> = new Map<string, any>();

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





    /**
     * Returns an array of FIRSTMatch objects for this event
     * if it is cached, it will return the cached data
     * If there is an update, it will emit 'update-matches'. This tests every 10 minutes
     * @returns 
     */
    async getMatches(): Promise<FIRSTMatch[]> {
        const c = this.$cache.get('matches');
        if (c) return c as FIRSTMatch[];


        const serverStream = ServerRequest.retrieveStream<Match>('/api/matches/all-from-event', {
            eventKey: this.tba.key
        }, JSON.parse);

        const r = await TBA.get<TBAMatch[]>(`/event/${this.tba.key}/matches`).then((res) => {
            res.data.sort((a, b) => {
                const levels = ['qm', 'ef', 'qf', 'sf', 'f'];
                const aLevel = levels.indexOf(a.comp_level);
                const bLevel = levels.indexOf(b.comp_level);

                if (aLevel !== bLevel) return aLevel - bLevel;
                return a.match_number - b.match_number;
            });

            return {
                data: res.data.map((match) => new FIRSTMatch(match, this)),
                time: res.time,
                onUpdate: (callback: (data: FIRSTMatch[]) => void, time?: number) => {
                    res.onUpdate((data) => {
                        callback(data.map((match) => new FIRSTMatch(match, this)));
                    }, time);
                }
            }
        });

        serverStream.on('chunk', (match) => {
            const m = r.data.find(_m => _m.tba.match_number === match.matchNumber && _m.tba.comp_level === match.compLevel);
            if (!m) return;
            m.$cache.set('info', match);
        });

        this.$cache.set('matches', r.data);
        r.onUpdate((data: FIRSTMatch[]) => {
            this.$cache.set('matches', data);
            this.$emitter.emit('update-matches', data);
        }, 1000 * 60 * 10);
        return r.data;
    }

    /**
     *  Returns an array of FIRSTTeam objects for this event
     *  if it is cached, it will return the cached data
     *  If there is an update, it will emit 'update-teams'. This tests every 24 hours
     * @returns 
     */
    async getTeams(): Promise<FIRSTTeam[]> {
        const c = this.$cache.get('teams');
        if (c) return c as FIRSTTeam[];

        const serverStream = ServerRequest.retrieveStream<Team>('/api/teams/all-from-event', {
            eventKey: this.tba.key
        }, JSON.parse);

        const r = await TBA.get<TBATeam[]>(`/event/${this.tba.key}/teams`).then((res) => {
            res.data.sort((a, b) => a.team_number - b.team_number);

            return {
                data: res.data.map((team) => new FIRSTTeam(team, this)),
                time: res.time,
                onUpdate: (callback: (data: FIRSTTeam[]) => void, time?: number) => {
                    res.onUpdate((data) => {
                        callback(data.map((team) => new FIRSTTeam(team, this)));
                    }, time);
                }
            }
        });

        serverStream.on('chunk', (team) => {
            const t = r.data.find(_t => _t.tba.team_number === team.number);
            if (!t) return;
            t.$cache.set('info', team);
        });

        this.$cache.set('teams', r.data);
        r.onUpdate((data) => {
            this.$cache.set('teams', data);
            this.emit('update-teams', data);
        }, 1000 * 60 * 10 * 24);

        return r.data;
    }

    /**
     * Returns the event properties for this event
     * if it is cached, it will return the cached data
     * @returns 
     */
    async getEventProperties(): Promise<EventProperties|undefined> {
        const p = await ServerRequest.post<EventProperties|undefined>('/api/events/properties', {
            eventKey: this.tba.key
        }, {
            cached: true
        });

        if (!p) console.error(`Event properties for ${this.tba.key} have not been set. The server may not have the event in its database.`);
        else this.$cache.set('properties', p);

        return p;
    }

    async getTeam(teamNumber: number): Promise<FIRSTTeam | undefined> {
        const teams = await this.getTeams();
        return teams.find(t => t.tba.team_number === teamNumber);
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
};

socket.on('event:update-properties', (eventKey: string, properties: EventProperties) => {
    const event = FIRSTEvent.cache.get(eventKey);
    if (!event) return;

    event.$cache.set('properties', properties);
    event.$emitter.emit('update-properties', properties);
});