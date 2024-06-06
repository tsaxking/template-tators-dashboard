import { Cache } from "./cache";
import { RetrievedMatchScouting as M } from "../../utilities/tables";
import { attemptAsync } from "../../../shared/check";
import { DB } from "../../utilities/databases";
import Account from "../accounts";

export class MatchScouting extends Cache {

    public static fromId(id: string) {
        return attemptAsync(async () => {
            const data = (await DB.get('match-scouting/from-id', { id })).unwrap();
            if (!data) return null;
            return new MatchScouting(data);
        });
    }

    new(data: M) {
        return attemptAsync(async () => {
            const scoutings =( await DB.all('match-scouting/from-event', {
                eventKey: data.eventKey
            })).unwrap();
            const matchScouting = scoutings.find(s => s.matchNumber === data.matchNumber && s.compLevel === data.compLevel && s.team === data.team);
            if (matchScouting) {
                const old = new MatchScouting(matchScouting);
                (await old.archive()).unwrap();
            }

            const account = await Account.fromId(data.scoutId || '');

            (await DB.run('match-scouting/new', {
                id: data.id,
                matchId: data.matchId,
                team: data.team,
                scoutId: data.scoutId,
                scoutGroup: data.scoutGroup,
                trace: data.trace,
                checks: data.checks,
                preScouting: data.preScouting || 0,
                time: data.time,
                scoutName: account?.username || data.scoutId || ''
            })).unwrap();

            return new MatchScouting(data);
        });
    }


    public id: string;
    public matchId: string | undefined;
    public team: number;
    public scoutId: string | undefined;
    public scoutGroup: number;
    public trace: string;
    public checks: string;
    public preScouting: number | undefined;
    public time: number;
    public eventKey: string;
    public matchNumber: number;
    public compLevel: string;

    constructor(data: M) {
        super();
        this.id = data.id;
        this.matchId = data.matchId;
        this.team = data.team;
        this.scoutId = data.scoutId;
        this.scoutGroup = data.scoutGroup;
        this.trace = data.trace;
        this.checks = data.checks;
        this.preScouting = data.preScouting;
        this.time = data.time;
        this.eventKey = data.eventKey;
        this.matchNumber = data.matchNumber;
        this.compLevel = data.compLevel;
    }


    archive() {
        return attemptAsync(async () => {
            (await DB.run('match-scouting/archive', {
                content: JSON.stringify(this),
                compLevel: this.compLevel,
                eventKey: this.eventKey,
                matchNumber: this.matchNumber,
                teamNumber: this.team,
                created: Date.now()
            })).unwrap();
            return DB.run('match-scouting/delete', { id: this.id });
        });
    }
}