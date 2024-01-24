import { EventEmitter } from '../../../../shared/event-emitter';
import { Cache } from '../../cache';
import { ScoutingQuestion as ScoutingQuestionObj } from '../../../../shared/db-types-extended';
import { attemptAsync, Result } from '../../../../shared/attempt';
import { ServerRequest } from '../../../utilities/requests';

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

    public static new(
        data: {
            question: string;
            type:
                | 'text'
                | 'number'
                | 'boolean'
                | 'select'
                | 'checkbox'
                | 'radio'
                | 'textarea';
            section: string;
            key: string;
            description: string;
            groupId: string;
            options: any; // TODO: add type
        },
    ): Promise<Result<Question>> {
        return attemptAsync(async () => {
            const res = await ServerRequest.post<{
                data: ScoutingQuestionObj;
            }>(
                '/api/scouting-questions/new-question',
                data,
            );

            if (res.isOk()) return new Question(res.value.data);
            throw res.error;
        });
    }

    public readonly id: string;
    public $question: string;
    public $type:
        | 'text'
        | 'number'
        | 'boolean'
        | 'select'
        | 'checkbox'
        | 'radio'
        | 'textarea';
    public readonly section: string;
    public $key: string;
    public $description: string;
    public readonly groupId: string;

    constructor(data: ScoutingQuestionObj) {
        super();

        this.id = data.id;
        this.$question = data.question;
        this.$type = data.type;
        this.section = data.section;
        this.$key = data.key;
        this.$description = data.description;
        this.groupId = data.groupId;
    }

    public get question(): string {
        return this.$question;
    }

    public set question(value: string) {
        this.$question = value;
        this.update();
    }

    public get type():
        | 'text'
        | 'number'
        | 'boolean'
        | 'select'
        | 'checkbox'
        | 'radio'
        | 'textarea' {
        return this.$type;
    }

    public set type(
        value:
            | 'text'
            | 'number'
            | 'boolean'
            | 'select'
            | 'checkbox'
            | 'radio'
            | 'textarea',
    ) {
        this.$type = value;
        this.update();
    }

    public get key(): string {
        return this.$key;
    }

    public set key(value: string) {
        this.$key = value;
        this.update();
    }

    public get description(): string {
        return this.$description;
    }

    public set description(value: string) {
        this.$description = value;
        this.update();
    }

    private async update(): Promise<Result<void>> {
        return attemptAsync(async () => {});
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
}
