import { EventEmitter } from '../../../shared/event-emitter';
import { Cache } from '../cache';
import { TeamComment as TCObject } from '../../../shared/db-types-extended';
import { attemptAsync } from '../../../shared/check';
import { ServerRequest } from '../../utilities/requests';
import { FIRSTEvent } from './event';
import { socket } from '../../utilities/socket';
import { FIRSTTeam } from './team';

type TeamCommentUpdates = {
    update: string; // comment
};

type Updates = {
    new: TeamComment;
    update: TeamComment;
    delete: string;
};

export class TeamComment extends Cache<TeamCommentUpdates> {
    public static readonly emitter = new EventEmitter<keyof Updates>();

    public static readonly cache = new Map<string, TeamComment>();

    public static on<T extends keyof Updates>(
        event: T,
        listener: (data: Updates[T]) => void,
    ) {
        TeamComment.emitter.on(event, listener);
    }

    public static off<T extends keyof Updates>(
        event: T,
        listener: (data: Updates[T]) => void,
    ) {
        TeamComment.emitter.off(event, listener);
    }

    public static emit<T extends keyof Updates>(event: T, data: Updates[T]) {
        TeamComment.emitter.emit(event, data);
    }

    public static get(id: string) {
        return TeamComment.cache.get(id);
    }

    public static new(team: FIRSTTeam, type: string, comment: string) {
        return ServerRequest.post('/api/team-comments/new', {
            comment,
            type,
            teamNumber: team.number,
            eventKey: team.event.key,
        });
    }

    public static fromTeam(
        teamNumber: number,
        //key: string,
        event: FIRSTEvent,
    ) {
        return attemptAsync(async () => {
            const current = this.cache.values();
            const comments = Array.from(current).filter((c) => {
                return c.team === teamNumber && c.eventKey === event.key;
            });

            if (comments.length) return comments;

            const res = await ServerRequest.post<TCObject[]>(
                '/api/team-comments/get',
                {
                    team: teamNumber,
                    eventKey: event.key,
                },
            );
            if (res.isErr()) throw res.error;

            return res.value.map((obj) => new TeamComment(obj));
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
}

socket.on('team-comment:new', (data: TCObject) => {
    const team = FIRSTTeam.$cache.get(data.team + ':' + data.eventKey);
    if (!team) return;

    const comment = new TeamComment(data);
    team.emit('new-comment', comment);
});
