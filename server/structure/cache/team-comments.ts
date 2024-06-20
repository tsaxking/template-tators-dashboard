import { Cache } from './cache';
import { TeamComments } from '../../utilities/tables';
import { attemptAsync } from '../../../shared/check';
import { uuid } from '../../utilities/uuid';
import { DB } from '../../utilities/databases';
import Filter from 'bad-words';

export class TeamComment extends Cache {
    public static new(data: {
        team: number;
        comment: string;
        type: string;
        matchScoutingId: string | undefined;
        accountId: string | undefined;
        eventKey: string;
    }) {
        return attemptAsync(async () => {
            const id = uuid();
            const time = Date.now();

            // remove bad words
            const f = new Filter();
            data.comment = f.clean(data.comment);

            (
                await DB.run('team-comments/new', {
                    ...data,
                    id,
                    time: time.toString(),
                    matchScoutingId: data.matchScoutingId || ''
                })
            ).unwrap();

            return new TeamComment({
                ...data,
                id,
                time: time.toString(),
                archive: 0
            });
        });
    }

    public static fromAccount(accountId: string) {
        return attemptAsync(async () => {
            const data = (
                await DB.all('team-comments/from-account', { accountId })
            ).unwrap();
            return data.map(d => new TeamComment(d));
        });
    }

    public static fromEvent(eventKey: string) {
        return attemptAsync(async () => {
            const data = (
                await DB.all('team-comments/from-event', { eventKey })
            ).unwrap();
            return data.map(d => new TeamComment(d));
        });
    }

    public static fromMatchScouting(matchScoutingId: string) {
        return attemptAsync(async () => {
            const data = (
                await DB.all('team-comments/from-match-scouting', {
                    matchScoutingId
                })
            ).unwrap();
            return data.map(d => new TeamComment(d));
        });
    }

    public static fromTeam(team: number, eventKey: string) {
        return attemptAsync(async () => {
            const data = (
                await DB.all('team-comments/from-team', { team, eventKey })
            ).unwrap();
            return data.map(d => new TeamComment(d));
        });
    }

    public id: string;
    public team: number;
    public comment: string;
    public type: string;
    public matchScoutingId: string | undefined;
    public accountId: string | undefined;
    public time: number;
    public eventKey: string;
    public archive: 0 | 1;

    constructor(data: TeamComments) {
        super();
        this.id = data.id;
        this.team = data.team;
        this.comment = data.comment;
        this.type = data.type;
        this.matchScoutingId = data.matchScoutingId;
        this.accountId = data.accountId;
        this.eventKey = data.eventKey;
        this.time = +data.time;
        this.archive = data.archive;
    }

    update(data: {
        team: number;
        comment: string;
        type: string;
        matchScoutingId: string | undefined;
        accountId: string | undefined;
        eventKey: string;
    }) {
        return attemptAsync(async () => {
            (
                await DB.run('team-comments/update', {
                    ...data,
                    id: this.id,
                    matchScoutingId: data.matchScoutingId || '',
                    accountId: data.accountId || '',
                    time: this.time.toString()
                })
            ).unwrap();

            this.team = data.team;
            this.comment = data.comment;
            this.type = data.type;
            this.matchScoutingId = data.matchScoutingId;
            this.accountId = data.accountId;
            this.eventKey = data.eventKey;
        });
    }
}
