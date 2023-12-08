import { CompLevel, Event as EventProperties, MatchScouting, Team, RetrievedMatchScouting, MatchScoutingComments, ScoutingAnswer, RetrievedScoutingAnswer, Strategy as StrategyObj, Whiteboard as WhiteboardObj, Match as MatchObj } from "../../../shared/db-types-extended";
import { EventEmitter } from "../../../shared/event-emitter";
import { TBAEvent, TBAMatch, TBATeam } from "../../../shared/tba";
import { RetrieveStreamEventEmitter, ServerRequest } from "../../utilities/requests";
import { TBA, TBAResponse } from "../../utilities/tba";
import { socket } from '../../utilities/socket';
import { FIRSTEvent } from "./event";
import { FIRSTTeam } from "./team";
import { Strategy } from "./strategy";
import { Cache } from "../cache";

/**
 * Events that are emitted by a {@link FIRSTMatch} object
 * @date 10/9/2023 - 6:39:41 PM
 *
 * @typedef {FIRSTMatchEventData}
 */
type FIRSTMatchEventData = {
    'strategy': Strategy[];
    'match-scouting': RetrievedMatchScouting;
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
    public static readonly cache: Map<string, FIRSTMatch> = new Map<string, FIRSTMatch>();


    /**
     * Creates an instance of FIRSTMatch.
     * @date 10/9/2023 - 6:39:41 PM
     *
     * @constructor
     * @param {TBAMatch} tba
     * @param {FIRSTEvent} event
     */
    constructor(public readonly tba: TBAMatch, public readonly event: FIRSTEvent) {
        super();
        this.teams.forEach(t => {
            t.on('match-scouting', async () => {
                const scouting = await this.getMatchScouting();
                this.$emitter.emit('match-scouting', scouting[t.tba.team_number]);
            });
        });
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

        em.on('complete', (data) => {
            this.$cache.set('strategy', data);
        });

        return em;
    }

    public async getInfo(): Promise<MatchObj> {
        return new Promise<MatchObj>((res, rej) => {
            let info = this.$cache.get('info');
            if (info) return res(info);

            ServerRequest.post<MatchObj>('/api/matches/info', {
                eventKey: this.event.tba.key,
                matchNumber: this.tba.match_number,
                compLevel: this.tba.comp_level
            }, {
                cached: true
            }).then((data) => {
                this.$cache.set('info', data);
                res(data);
            }).catch(rej);
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
    async getMatchScouting(): Promise<{
        [teamNumber: number]: RetrievedMatchScouting
    }> {
        const scouting = await Promise.all(this.teams.map(t => {
            return new Promise<RetrievedMatchScouting>((res, rej) => {
                t.getMatchScouting()
                    .on('complete', (matches) => {
                        const match = matches.find(m => m.compLevel === this.tba.comp_level && m.matchNumber === this.tba.match_number);
                        if (match) res(match);
                        else rej(new Error('Match not found'));
                    });
            });
        }));

        return scouting.reduce((acc, cur, i) => {
            acc[this.teams[i].tba.team_number] = cur;

            return acc;
        }, {} as { [teamNumber: number]: RetrievedMatchScouting });
    }

    async getWhiteboard(): Promise<WhiteboardObj> {
        return ServerRequest.post<WhiteboardObj>('/api/whiteboard/from-match', {
            eventKey: this.event.tba.key,
            matchNumber: this.tba.match_number,
            compLevel: this.tba.comp_level
        }, {
            cached: true
        });
    }

    /**
     * All teams in this match as FIRSTTeam objects
     * @date 10/9/2023 - 6:39:41 PM
     *
     * @readonly
     * @type {FIRSTTeam[]}
     */
    get teams(): [FIRSTTeam, FIRSTTeam, FIRSTTeam, FIRSTTeam, FIRSTTeam, FIRSTTeam] {
        const [red1, red2, red3] = this.tba.alliances.red.team_keys;
        const [blue1, blue2, blue3] = this.tba.alliances.blue.team_keys;

        const teams = [ 
            red1, red2, red3,
            blue1, blue2, blue3
        ].map(t => FIRSTTeam.cache.get(+t.replace('frc', '')));

        if (teams.some(t => !t)) {
            throw new Error('Some teams are undefined');
        }

        return teams as [FIRSTTeam, FIRSTTeam, FIRSTTeam, FIRSTTeam, FIRSTTeam, FIRSTTeam];
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
};