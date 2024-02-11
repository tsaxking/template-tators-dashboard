import { attemptAsync, Result } from '../../../../shared/check';
import { ScoutingAnswer } from '../../../../shared/db-types-extended';
import { ServerRequest } from '../../../utilities/requests';
import { Cache } from '../../cache';
import { FIRSTEvent } from '../event';
import { EventEmitter } from '../../../../shared/event-emitter';
import { socket } from '../../../utilities/socket';

type Updates = {
    new: Answer;
    update: Answer;
};

export class Answer extends Cache {
    static readonly $cache = new Map<string, Answer>();

    private static readonly $emitter = new EventEmitter<keyof Updates>();

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: Updates[K]) => void,
    ): void {
        Answer.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: Updates[K]) => void,
    ): void {
        Answer.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(
        event: K,
        data: Updates[K],
    ): void {
        Answer.$emitter.emit(event, data);
    }

    public static once<K extends keyof Updates>(
        event: K,
        callback: (data: Updates[K]) => void,
    ): void {
        Answer.$emitter.once(event, callback);
    }

    static async fromTeam(
        team: number,
        event: FIRSTEvent,
        force = false,
    ): Promise<Result<Answer[]>> {
        return attemptAsync(async () => {
            if (!force && Answer.$cache.size) {
                const current = this.$cache.values();

                const answers = Array.from(current).filter((a) => {
                    return a.teamNumber === team && a.eventKey === event.key;
                });

                return answers;
            }

            const res = await ServerRequest.post<ScoutingAnswer[]>(
                '/api/scouting-questions/get-team-answers',
                {
                    teamNumber: team,
                    eventKey: event.key,
                },
            );

            if (res.isErr()) throw res.error;

            return res.value.map((a) => new Answer(a, event.key));
        });
    }

    readonly id: string;
    readonly questionId: string;
    public answer: string[];
    public readonly teamNumber: number;
    public date: number;
    public accountId: string;

    constructor(
        data: ScoutingAnswer,
        public readonly eventKey: string,
    ) {
        super();

        this.id = data.id;
        this.questionId = data.questionId;
        this.answer = JSON.parse(data.answer); // string[]
        this.teamNumber = data.teamNumber;
        this.date = data.date;
        this.accountId = data.accountId;

        if (Answer.$cache.has(this.id)) {
            Answer.$cache.delete(this.id);
        }

        Answer.$cache.set(this.id, this);
    }
}

socket.on(
    'scouting-question:new-answer',
    (data: ScoutingAnswer, eventKey: string) => {
        new Answer(data, eventKey);
    },
);
