import { EventEmitter } from '../../../shared/event-emitter';
import { Cache } from '../cache';
import { TeamComments as TCObject } from '../../../shared/db-types-extended';
import { attemptAsync } from '../../../shared/check';
import { ServerRequest } from '../../utilities/requests';
import { FIRSTEvent } from './event';


type TeamCommentUpdates = {
    'update': string; // comment
}

type Updates = {
    'new': TeamComment;
    'update': TeamComment;
    'delete': string;
}


export class TeamComment extends Cache<TeamCommentUpdates> {
    public static readonly emitter = new EventEmitter<keyof Updates>();

    public static readonly cache = new Map<string, TeamComment>();

    public static on<T extends keyof Updates>(event: T, listener: (data: Updates[T]) => void) {
        TeamComment.emitter.on(event, listener);
    }

    public static off<T extends keyof Updates>(event: T, listener: (data: Updates[T]) => void) {
        TeamComment.emitter.off(event, listener);
    }

    public static emit<T extends keyof Updates>(event: T, data: Updates[T]) {
        TeamComment.emitter.emit(event, data);
    }

    public static get(id: string) {
        return TeamComment.cache.get(id);
    }

    public static new(obj: TCObject) {
        return attemptAsync(async () => {
            const res = await ServerRequest.post<{
                obj: TCObject;
            }>('/api/scouting-questions/new-question', obj);

            if (res.isOk()) return new TeamComment(res.value.obj);
            throw res.error;
        });
    };

    public static fromTeam(
        teamNumber: number,
        //key: string,
        event: FIRSTEvent
    ) {
        return attemptAsync(async () => {
            // WAIT FOR LOGIC TO GET FIXED
            // const current = this.cache.values();
            // const comments = Array.from(current).filter((c) => {
            //     return c.team === teamNumber && c.eventKey === event.key;
            // });
            // return comments;

            const res = await ServerRequest.post<TCObject[]>(
                '/api/team-comments',
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

    constructor(
        obj: TCObject
    ) {
        super();
        this.id = obj.id;
        this.team = obj.team;
        this.comment = obj.comment;
        this.type = obj.type as 'match' | 'dashboard';
        this.matchScoutingId = obj.matchScoutingId;
        this.accountId = obj.accountId;
        this.time = obj.time;
        this.eventKey = obj.eventKey;
    }
};