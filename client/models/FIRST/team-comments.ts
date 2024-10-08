import { EventEmitter } from '../../../shared/event-emitter';
import { Cache } from '../cache';
import { TeamComment as TCObject } from '../../../shared/db-types-extended';
import { attemptAsync } from '../../../shared/check';
import { ServerRequest } from '../../utilities/requests';
import { FIRSTEvent } from './event';
import { socket } from '../../utilities/socket';
import { FIRSTTeam } from './team';
import { MatchScouting } from './match-scouting';

type TeamCommentUpdates = {
    update: string; // comment
};

type Updates = {
    new: TeamComment;
    update: TeamComment;
    delete: string;
};

export class TeamComment extends Cache<TeamCommentUpdates> {
    public static readonly emitter = new EventEmitter<Updates>();

    public static on = TeamComment.emitter.on.bind(TeamComment.emitter);
    public static off = TeamComment.emitter.off.bind(TeamComment.emitter);
    public static emit = TeamComment.emitter.emit.bind(TeamComment.emitter);
    public static once = TeamComment.emitter.once.bind(TeamComment.emitter);

    public static readonly cache = new Map<string, TeamComment>();

    public static get(id: string) {
        return TeamComment.cache.get(id);
    }

    public static new(team: FIRSTTeam, type: string, comment: string) {
        return ServerRequest.post('/api/team-comments/new', {
            comment: comment.trim(),
            type: type.trim(),
            teamNumber: team.number,
            eventKey: team.event.key
        });
    }

    public static fromTeam(
        teamNumber: number,
        //key: string,
        event: FIRSTEvent
    ) {
        return attemptAsync(async () => {
            const current = this.cache.values();
            const comments = Array.from(current).filter(c => {
                return c.team === teamNumber && c.eventKey === event.key;
            });

            if (comments.length) return comments;

            const res = await ServerRequest.post<TCObject[]>(
                '/api/team-comments/get',
                {
                    team: teamNumber,
                    eventKey: event.key
                }
            );
            if (res.isErr()) throw res.error;

            return res.value.map(obj => new TeamComment(obj));
        });
    }

    public readonly id: string;
    public readonly team: number;
    public comment: string;
    public type: 'match' | 'dashboard';
    public matchScoutingId: string | undefined;
    public accountId: string | undefined;
    public time: number;
    public readonly eventKey: string;

    constructor(obj: TCObject) {
        super();
        this.id = obj.id;
        this.team = obj.team;
        this.comment = obj.comment;
        this.type = obj.type as 'match' | 'dashboard';
        this.matchScoutingId = obj.matchScoutingId;
        this.accountId = obj.accountId;
        this.time = obj.time;
        this.eventKey = obj.eventKey;

        TeamComment.cache.set(this.id, this);
    }

    async getMatchScouting() {
        return attemptAsync(async () => {
            if (!this.matchScoutingId) throw new Error('No match scouting ID');
            const res = await MatchScouting.fromId(this.matchScoutingId);
            if (res.isErr()) throw res.error;
            return res.value;
        });
    }
}

socket.on('team-comment:new', (data: TCObject) => {
    const team = FIRSTTeam.cache.get(data.team + ':' + data.eventKey);
    if (!team) return;

    const comment = new TeamComment(data);
    team.emit('new-comment', comment);
});
