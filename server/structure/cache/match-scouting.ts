import { Cache } from './cache';
import { RetrievedMatchScouting as M } from '../../utilities/tables';
import { attemptAsync } from '../../../shared/check';
import { DB } from '../../utilities/databases';
import Account from '../accounts';
import { uuid } from '../../utilities/uuid';
import { TraceArray } from '../../../shared/submodules/tatorscout-calculations/trace';

export class MatchScouting extends Cache {
    public static filterDuplicates(m: M, i: number, a: M[]) {
        return (
            a.findIndex(
                s =>
                    s.matchNumber === m.matchNumber &&
                    s.compLevel === m.compLevel
            ) === i
        );
    }

    public static fromId(id: string) {
        return attemptAsync(async () => {
            const data = (
                await DB.get('match-scouting/from-id', { id })
            ).unwrap();
            if (!data) return null;
            return new MatchScouting(data);
        });
    }

    public static new(
        data: {
            matchId: string | undefined;
            team: number;
            scoutId: string | undefined;
            scoutGroup: number;
            trace: string;
            checks: string;
            preScouting: number | undefined;
            eventKey: string;
            matchNumber: number;
            compLevel: string;
        },
        overWrite?: boolean
    ) {
        return attemptAsync(async () => {
            const scoutings = (
                await DB.all('match-scouting/from-event', {
                    eventKey: data.eventKey
                })
            ).unwrap();
            const matchScouting = scoutings.find(
                s =>
                    s.matchNumber === data.matchNumber &&
                    s.compLevel === data.compLevel &&
                    s.team === data.team
            );
            if (matchScouting && !overWrite)
                throw new Error(
                    'Match scouting already exists, and overwrite is not enabled'
                );
            if (matchScouting) {
                const ms = new MatchScouting(matchScouting);
                (await ms.remove()).unwrap();
            }
            const account = (await Account.fromId(data.scoutId || '')).unwrap();
            const id = uuid();
            const time = Date.now();

            (
                await DB.run('match-scouting/new', {
                    id,
                    matchId: data.matchId,
                    team: data.team,
                    scoutId: data.scoutId,
                    scoutGroup: data.scoutGroup,
                    trace: data.trace,
                    checks: data.checks,
                    preScouting: data.preScouting || 0,
                    time,
                    scoutName: account?.username || data.scoutId || ''
                })
            ).unwrap();

            return new MatchScouting({
                ...data,
                time,
                id,
                archive: 0,
                scoutName: account?.username || data.scoutId || ''
            });
        });
    }

    public static fromTeam(teamNumber: number, eventKey: string) {
        return attemptAsync(async () => {
            const matches = (
                await DB.all('match-scouting/from-team', {
                    eventKey,
                    team: teamNumber
                })
            ).unwrap();
            return matches
                .filter(MatchScouting.filterDuplicates)
                .map(m => new MatchScouting(m));
        });
    }

    public static fromEvent(eventKey: string) {
        return attemptAsync(async () => {
            const matches = (
                await DB.all('match-scouting/from-event', { eventKey })
            ).unwrap();
            return matches
                .filter(MatchScouting.filterDuplicates)
                .map(m => new MatchScouting(m));
        });
    }

    public static fromMatch(matchId: string) {
        return attemptAsync(async () => {
            const matches = (
                await DB.all('match-scouting/from-match', { matchId })
            ).unwrap();
            return matches
                .filter(MatchScouting.filterDuplicates)
                .map(m => new MatchScouting(m));
        });
    }

    public static fromScoutGroup(eventKey: string, group: number) {
        return attemptAsync(async () => {
            const matches = (
                await DB.all('match-scouting/from-scout-group', {
                    eventKey,
                    scoutGroup: group.toString()
                })
            ).unwrap();
            return matches
                .filter(MatchScouting.filterDuplicates)
                .map(m => new MatchScouting(m));
        });
    }

    public static fromScout(id: string, eventKey: string) {
        return attemptAsync(async () => {
            const matches = (
                await DB.all('match-scouting/from-scout', {
                    scoutId: id,
                    eventKey
                })
            ).unwrap();
            return matches
                .filter(MatchScouting.filterDuplicates)
                .map(m => new MatchScouting(m));
        });
    }

    public static fromCustomMatch(team: number, eventKey: string) {
        return attemptAsync(async () => {
            const matches = (
                await DB.all('match-scouting/team-custom-match', {
                    team: team,
                    eventKey
                })
            ).unwrap();
            return matches
                .filter(MatchScouting.filterDuplicates)
                .map(m => new MatchScouting(m));
        });
    }

    public static teamsPreScouting(team: number, eventKey: string) {
        return attemptAsync(async () => {
            const matches = (
                await DB.all('match-scouting/teams-pre-scouting', {
                    team,
                    eventKey
                })
            ).unwrap();
            return matches
                .filter(MatchScouting.filterDuplicates)
                .map(m => new MatchScouting(m));
        });
    }

    public id: string;
    public matchId: string | undefined;
    public team: number;
    public scoutId: string | undefined;
    public scoutGroup: number;
    public trace: TraceArray;
    public checks: string[];
    public preScouting: number | undefined;
    public time: number;
    public eventKey: string;
    public matchNumber: number;
    public compLevel: string;
    public archive: 0 | 1;

    constructor(data: M) {
        super();
        this.id = data.id;
        this.matchId = data.matchId;
        this.team = data.team;
        this.scoutId = data.scoutId;
        this.scoutGroup = data.scoutGroup;
        this.trace = JSON.parse(data.trace);
        this.checks = JSON.parse(data.checks);
        this.preScouting = data.preScouting;
        this.time = data.time;
        this.eventKey = data.eventKey;
        this.matchNumber = data.matchNumber;
        this.compLevel = data.compLevel;
        this.archive = data.archive;
    }

    remove() {
        return attemptAsync(async () => {
            (
                await DB.run('match-scouting/archive', {
                    id: this.id
                })
            ).unwrap();
            return DB.run('match-scouting/archive', { id: this.id });
        });
    }

    get json() {
        return {
            id: this.id,
            matchId: this.matchId,
            team: this.team,
            scoutId: this.scoutId,
            scoutGroup: this.scoutGroup,
            trace: JSON.stringify(this.trace),
            checks: JSON.stringify(this.checks),
            preScouting: this.preScouting,
            time: this.time,
            eventKey: this.eventKey,
            matchNumber: this.matchNumber,
            compLevel: this.compLevel
        };
    }
}
