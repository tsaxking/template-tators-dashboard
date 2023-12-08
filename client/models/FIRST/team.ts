import { CompLevel, Event as EventProperties, MatchScouting, Team, RetrievedMatchScouting, MatchScoutingComments, ScoutingAnswer, RetrievedScoutingAnswer } from "../../../shared/db-types-extended";
import { EventEmitter } from "../../../shared/event-emitter";
import { TBAEvent, TBAMatch, TBATeam } from "../../../shared/tba";
import { RetrieveStreamEventEmitter, ServerRequest } from "../../utilities/requests";
import { TBA, TBAResponse } from "../../utilities/tba";
import { FIRSTMatch } from "./match";
import { socket } from '../../utilities/socket';
import { FIRSTEvent } from "./event";
import { Cache } from "../cache";


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
    /**
     * Map of all FIRSTTeam objects
     * @date 10/9/2023 - 6:55:03 PM
     *
     * @public
     * @static
     * @type {Map<number, FIRSTTeam>}
     */
    public static cache: Map<number, FIRSTTeam> = new Map<number, FIRSTTeam>();

    /**
     * Creates an instance of FIRSTTeam.
     * @date 10/9/2023 - 6:55:03 PM
     *
     * @constructor
     * @param {TBATeam} tba
     * @param {FIRSTEvent} event
     */
    constructor(public readonly tba: TBATeam, public readonly event: FIRSTEvent) {
        super();
        if (!FIRSTTeam.cache.has(tba.team_number)) {
            FIRSTTeam.cache.get(tba.team_number)?.destroy();
        }
        FIRSTTeam.cache.set(tba.team_number, this);
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
    public async getEvents(simple: boolean = false): Promise<TBAEvent[]> {
        if (this.$cache.has('events')) return this.$cache.get('events') as TBAEvent[];


        const res = await TBA.get<TBAEvent[]>(`/team/${this.tba.key}/events${simple ? '/simple' : ''}`);

        res.onUpdate((data: TBAEvent[]) => {
            this.$emitter.emit('update-events', data);
            this.$cache.set('events', data);
        }, 1000 * 60 * 60 * 24); // 24 hours

        this.$cache.set('events', res.data);

        return res.data;
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
    public async getWatchPriority(): Promise<number> {
        const res = await ServerRequest.post<Team | undefined>('/api/teams/properties', {
            teamKey: this.tba.key,
            eventKey: this.event.tba.key
        });

        if (res) this.$cache.set('watch-priority', res.watchPriority);

        return res?.watchPriority || 0;
    }

    /**
     * Streams the match scouting for this team
     * Returns an emitter that emits chunks of the match scouting
     * @date 10/9/2023 - 6:55:03 PM
     *
     * @public
     * @returns {RetrieveStreamEventEmitter<RetrievedMatchScouting>}
     */
    public getMatchScouting(): RetrieveStreamEventEmitter<RetrievedMatchScouting> {
        if (this.$cache.has('match-scouting')) {
            const res = this.$cache.get('match-scouting') as RetrievedMatchScouting[];

            const em = new RetrieveStreamEventEmitter<RetrievedMatchScouting>();

            res.forEach((ms) => em.emit('chunk', ms));

            return em;
        }

        const em = ServerRequest
            .retrieveStream<RetrievedMatchScouting>(
                '/api/teams/match-scouting', 
                {
                    team: this.tba.team_number,
                    eventKey: this.event.tba.key
                }, 
                JSON.parse
            );

        em.on('complete', (data) => {
            this.$cache.set('match-scouting', data);
        });

        return em;
    }

    /**
     * Streams the match comments for this team
     * Returns an emitter that emits chunks of the match comments
     * @date 10/9/2023 - 6:55:03 PM
     *
     * @public
     * @returns {RetrieveStreamEventEmitter<MatchScoutingComments>}
     */
    public getMatchComments(): RetrieveStreamEventEmitter<MatchScoutingComments> {
        if (this.$cache.has('match-comments')) {
            const res = this.$cache.get('match-comments') as MatchScoutingComments[];

            const em = new RetrieveStreamEventEmitter<MatchScoutingComments>();

            res.forEach((ms) => em.emit('chunk', ms));

            return em;
        }

        const em = ServerRequest
            .retrieveStream<MatchScoutingComments>(
                '/api/teams/match-comments', 
                {
                    team: this.tba.team_number,
                    eventKey: this.event.tba.key
                }, 
                JSON.parse
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
    public getPitScouting(): RetrieveStreamEventEmitter<RetrievedScoutingAnswer> {
        if (this.$cache.has('pit-scouting')) {
            const res = this.$cache.get('pit-scouting') as RetrievedScoutingAnswer[];

            const em = new RetrieveStreamEventEmitter<RetrievedScoutingAnswer>();

            res.forEach((ms) => em.emit('chunk', ms));

            return em;
        }

        const em = ServerRequest
            .retrieveStream<RetrievedScoutingAnswer>(
                '/api/teams/pit-scouting', 
                {
                    team: this.tba.team_number,
                    eventKey: this.event.tba.key
                }, 
                JSON.parse
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
        FIRSTTeam.cache.delete(this.tba.team_number);
        super.destroy();
    }
}





// update sockets:



socket.on('match-scouting:new', (data: RetrievedMatchScouting) => {
    const team = FIRSTTeam.cache.get(data.team);

    if (!team) return;

    // if it's in cache, update by either replacing data or pushing then sorting
    if (team.$cache.has('match-scouting')) {
        const ms = team.$cache.get('match-scouting') as RetrievedMatchScouting[];
        const match = ms.find((m) => m.id === data.id);
        if (match) {
            // update
            ms.splice(ms.indexOf(match), 1, data);
        } else {
            // add then sort
            ms.push(data);
            ms.sort((a, b) => {
                const levels = ['qm', 'qf', 'sf', 'f'];
                if (a.compLevel === b.compLevel) return a.matchNumber - b.matchNumber;
                return levels.indexOf(a.compLevel) - levels.indexOf(b.compLevel);
            });
        }
        team.$cache.set('match-scouting', ms);
    }

    team.$emitter.emit('match-scouting', data);
});

socket.on('match-scouting:delete', (data: RetrievedMatchScouting) => {
    const team = FIRSTTeam.cache.get(data.team);

    if (!team) return;

    // if it's in cache, update by either replacing data or pushing then sorting
    if (team.$cache.has('match-scouting')) {
        const ms = team.$cache.get('match-scouting') as RetrievedMatchScouting[];
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
    const team = FIRSTTeam.cache.get(data.team);

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
    const team = FIRSTTeam.cache.get(data.team);

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
    const team = FIRSTTeam.cache.get(data.teamNumber);

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
    const team = FIRSTTeam.cache.get(data.teamNumber);

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