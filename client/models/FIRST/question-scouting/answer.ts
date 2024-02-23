import { attemptAsync, Result } from '../../../../shared/check';
import { ScoutingAnswer } from '../../../../shared/db-types-extended';
import { ServerRequest } from '../../../utilities/requests';
import { Cache } from '../../cache';
import { FIRSTEvent } from '../event';
import { EventEmitter } from '../../../../shared/event-emitter';
import { socket } from '../../../utilities/socket';
import { Question } from './question';

type Updates = {
    new: Answer;
    delete: string; // id
};

type AnswerEvents = {
    update: undefined;
    delete: void;
};

export class Answer extends Cache<AnswerEvents> {
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

                if (answers.length) return answers;
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

    static async fromId(
        id: string,
        eventKey: string,
    ): Promise<Result<Answer | undefined>> {
        return attemptAsync(async () => {
            if (Answer.$cache.has(id)) return Answer.$cache.get(id) as Answer;

            const res = await ServerRequest.post<ScoutingAnswer | undefined>(
                '/api/scouting-questions/get-answer',
                {
                    id,
                },
            );

            if (res.isOk()) {
                if (res.value) return new Answer(res.value, eventKey);
                else return undefined;
            }
            throw res.error;
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

    async delete(): Promise<Result<void>> {
        return attemptAsync(async () => {
            const res = await ServerRequest.post(
                '/api/scouting-questions/delete-answer',
                {
                    id: this.id,
                },
            );

            if (res.isErr()) throw res.error;
        });
    }

    async getQuestion() {
        const q = await Question.fromId(this.questionId);
        if (q.isOk()) return q.value;
        else {
            console.log('error getting question', q.error);
            return undefined;
        }
    }
}

socket.on(
    'scouting-question:new-answer',
    (data: ScoutingAnswer, eventKey: string) => {
        const a = new Answer(data, eventKey);
        Answer.emit('new', a);
    },
);

socket.on(
    'scouting-question:update-answer',
    (data: ScoutingAnswer, eventKey: string) => {
        const answer = Answer.$cache.get(data.id);

        if (answer) {
            answer.answer = JSON.parse(data.answer);
            answer.date = data.date;
            answer.accountId = data.accountId;
            console.log('update answer', answer);

            answer.emit('update', undefined);
        } else {
            new Answer(data, eventKey);
        }
    },
);

socket.on('scouting-question:answer-deleted', (id: string) => {
    const answer = Answer.$cache.get(id);
    if (answer) {
        Answer.$cache.delete(id);
        answer.emit('delete', undefined);
        answer.destroy();
    }
});
