import { EventEmitter } from '../../../../shared/event-emitter';
import { Cache } from '../../cache';
import {
    QuestionOptions,
    QuestionType,
    ScoutingQuestion as ScoutingQuestionObj,
} from '../../../../shared/db-types-extended';
import { attemptAsync, Result } from '../../../../shared/attempt';
import { ServerRequest } from '../../../utilities/requests';
import { FIRSTEvent } from '../event';
import { FIRSTTeam } from '../team';
import { Answer } from './answer';

type Updates = {
    new: unknown;
    update: unknown;
};


export class Question extends Cache {
    public static readonly $cache = new Map<string, Question>();

    private static readonly $emitter = new EventEmitter<keyof Updates>();

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: Updates[K]) => void,
    ): void {
        Question.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: Updates[K]) => void,
    ): void {
        Question.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(
        event: K,
        data: Updates[K],
    ): void {
        Question.$emitter.emit(event, data);
    }

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

    public readonly id: string;
    public $question: string;
    public $type: QuestionType;
    public readonly section: string;
    public $key: string;
    public $description: string;
    public readonly groupId: string;
    public readonly options: QuestionOptions;

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
        return attemptAsync(async () => {
            throw new Error('Method not implemented.');
            // const res = await ServerRequest.post<ScoutingQuestionObj>(
            //     '/api/scouting-questions/update-question',
            //     {
            //         id: this.id,
            //         question: this.$question,
            //         type: this.$type,
            //         key: this.$key,
            //         description: this.$description,
            //         options: this.options,
            //     },
            // );
        });
    }

    delete() {
        return attemptAsync(async () => {
            throw new Error('Method not implemented.');
            // const res = await ServerRequest.post<{
            //     id: string;
            // }>('/api/scouting-questions/delete-question', {
            //     id: this.id,
            // });

            // if (res.isOk()) {
            //     Question.$cache.delete(this.id);
            //     this.destroy();
            //     return;
            // } else throw res.error;
        });
    }

    // async getAnswers(): Promise<Result<{
    //     team: number;
    //     answer: string[];
    // }[]>> {
    //     return attemptAsync(async () => {
    //         throw new Error('Not implemented');
    //     });
    // }

    async getAnswer(
        team: FIRSTTeam,
        event: FIRSTEvent,
    ): Promise<Result<Answer | undefined>> {
        return attemptAsync(async () => {
            const res = await Answer.fromTeam(team.number, event);
            if (res.isOk()) {
                return res.value.find((q) => q.questionId === this.id);
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
                    answer,
                },
            );

            if (res.isOk()) return;
            throw res.error;
        });
    }
}
