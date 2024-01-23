import { EventEmitter } from '../../../../shared/event-emitter';
import { Cache } from '../../cache';
import { ScoutingQuestion as ScoutingQuestionObj } from '../../../../shared/db-types-extended';
import { attemptAsync, Result } from '../../../../shared/attempt';
import { ServerRequest } from '../../../utilities/requests';

type Updates = {
    new: unknown;
    update: unknown;
};

export class ScoutingQuestion extends Cache {
    private static readonly $emitter = new EventEmitter<keyof Updates>();

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: Updates[K]) => void,
    ): void {
        ScoutingQuestion.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: Updates[K]) => void,
    ): void {
        ScoutingQuestion.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(
        event: K,
        data: Updates[K],
    ): void {
        ScoutingQuestion.$emitter.emit(event, data);
    }

    public static new(
        data: ScoutingQuestionObj,
    ): Promise<Result<ScoutingQuestion>> {
        return attemptAsync(async () => {
            const res = await ServerRequest.post(
                '/api/scouting-questions/new-question',
                {
                    ...data,
                },
            );

            if (res.isOk()) return new ScoutingQuestion(data);
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
}
