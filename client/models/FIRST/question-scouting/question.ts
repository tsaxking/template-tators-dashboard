import { EventEmitter } from '../../../../shared/event-emitter';
import { Cache } from '../../cache';
import {
    QuestionOptions,
    QuestionType,
    ScoutingQuestion as ScoutingQuestionObj
} from '../../../../shared/db-types-extended';
import { attemptAsync, Result } from '../../../../shared/check';
import { ServerRequest } from '../../../utilities/requests';
import { FIRSTEvent } from '../event';
import { FIRSTTeam } from '../team';
import { Answer } from './answer';
import { socket } from '../../../utilities/socket';
import { Group } from './group';

type Updates = {
    new: unknown;
    update: unknown;
    delete: string;
};

type QuestionUpdates = {
    delete: void;
};

export class Question extends Cache<QuestionUpdates> {
    public static readonly cache = new Map<string, Question>();

    private static readonly emitter = new EventEmitter<Updates>();

    public static on = Question.emitter.on.bind(Question.emitter);
    public static off = Question.emitter.off.bind(Question.emitter);
    public static emit = Question.emitter.emit.bind(Question.emitter);
    public static once = Question.emitter.once.bind(Question.emitter);

    public static new(data: {
        question: string;
        type: QuestionType;
        section: string;
        key: string;
        description: string;
        groupId: string;
        options: QuestionOptions;
    }): Promise<Result<Question>> {
        return attemptAsync(async () => {
            const res = await ServerRequest.post<{
                data: ScoutingQuestionObj;
            }>('/api/scouting-questions/new-question', data);

            if (res.isOk()) return new Question(res.value.data);
            throw res.error;
        });
    }

    public static async fromId(
        id: string
    ): Promise<Result<Question | undefined>> {
        return attemptAsync(async () => {
            if (Question.cache.has(id)) {
                return Question.cache.get(id) as Question;
            }

            const res = await ServerRequest.post<
                ScoutingQuestionObj | undefined
            >('/api/scouting-questions/get-question', {
                id
            });

            if (res.isOk()) {
                if (res.value) return new Question(res.value);
                else return undefined;
            }
            throw res.error;
        });
    }

    public static async fromEvent(eventKey: string) {
        return attemptAsync(async () => {
            const cached = Array.from(Question.cache.values()).filter(
                q => q.eventKey
            );
            if (cached.length) return cached;

            const questions = await ServerRequest.post<ScoutingQuestionObj[]>(
                '/api/scouting-questions/questions-from-event',
                {
                    eventKey
                }
            );

            if (questions.isErr()) throw questions.error;

            return questions.value.map(q => new Question(q));
        });
    }

    public readonly id: string;
    public $question: string;
    public $type: QuestionType;
    public readonly section: string;
    public $key: string;
    public $description: string;
    public readonly groupId: string;
    public readonly options: QuestionOptions;
    public readonly eventKey: string;

    constructor(data: ScoutingQuestionObj) {
        super();
        this.id = data.id;
        this.$question = data.question;
        this.$type = data.type;
        this.section = data.section;
        this.$key = data.key;
        this.$description = data.description;
        this.groupId = data.groupId;
        this.options = JSON.parse(data.options) as QuestionOptions;
        this.eventKey = data.eventKey;

        if (Question.cache.has(this.id)) {
            Question.cache.delete(this.id);
        }

        Question.cache.set(this.id, this);
    }

    public get question(): string {
        return this.$question;
    }

    public set question(value: string) {
        this.$question = value;
        // this.update();
    }

    public get type(): QuestionType {
        return this.$type;
    }

    public set type(value: QuestionType) {
        this.$type = value;
        // this.update();
    }

    public get key(): string {
        return this.$key;
    }

    public set key(value: string) {
        this.$key = value;
        // this.update();
    }

    public get description(): string {
        return this.$description;
    }

    public set description(value: string) {
        this.$description = value;
        // this.update();
    }

    async update(): Promise<Result<void>> {
        return ServerRequest.post('/api/scouting-questions/update-question', {
            id: this.id,
            question: this.$question,
            type: this.$type,
            key: this.$key,
            description: this.$description,
            options: this.options
        });
    }

    delete() {
        return attemptAsync(async () => {
            const res = await ServerRequest.post<{
                id: string;
            }>('/api/scouting-questions/delete-question', {
                id: this.id
            });

            if (res.isErr()) throw res.error;
        });
    }

    // async getAnswers(eventKey: string): Promise<Result<{
    //     team: number;
    //     answer: string[];
    // }[]>> {
    //     return attemptAsync(async () => {
    //         throw new Error('Not implemented');
    //     });
    // }

    async getAnswer(
        team: FIRSTTeam,
        event: FIRSTEvent
    ): Promise<Result<Answer | undefined>> {
        return attemptAsync(async () => {
            const res = await Answer.fromTeam(team.number, event);
            if (res.isOk()) {
                return res.value.find(q => q.questionId === this.id);
            } else throw res.error;
        });
    }

    async saveAnswer(team: FIRSTTeam, answer: string[]): Promise<Result<void>> {
        return attemptAsync(async () => {
            // throw new Error('Method not implemented.');
            const res = await ServerRequest.post<void>(
                '/api/scouting-questions/submit-answer',
                {
                    question: this.id,
                    team: team.tba.team_number,
                    answer: answer.map(a => a.trim()),
                    eventKey: team.event.key
                }
            );

            if (res.isOk()) return;
            throw res.error;
        });
    }

    async getGroup(): Promise<Result<Group>> {
        return attemptAsync(async () => {
            const g = await Group.fromId(this.groupId);
            if (g.isOk()) {
                if (!g.value) throw new Error('Group not found');
                return g.value;
            }
            throw g.error;
        });
    }
}

socket.on('scouting-question:question-deleted', (id: string) => {
    const q = Question.cache.get(id);
    if (!q) return;

    Question.cache.delete(id);
    q.emit('delete', undefined);
    q.destroy();
});
