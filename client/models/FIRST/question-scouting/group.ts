import { attemptAsync, Result } from '../../../../shared/attempt';
import {
    ScoutingQuestion as ScoutingQuestionObj,
    ScoutingQuestionGroup,
} from '../../../../shared/db-types-extended';
import { EventEmitter } from '../../../../shared/event-emitter';
import { Cache } from '../../cache';
import { ScoutingQuestion } from './question';
import { ServerRequest } from '../../../utilities/requests';

type Updates = {
    new: unknown;
    update: unknown;
};

// used to organize questions into separate groups
export class QuestionGroup extends Cache {
    private static readonly $emitter = new EventEmitter<keyof Updates>();

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: Updates[K]) => void,
    ): void {
        QuestionGroup.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: Updates[K]) => void,
    ): void {
        QuestionGroup.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(
        event: K,
        data: Updates[K],
    ): void {
        QuestionGroup.$emitter.emit(event, data);
    }

    public static readonly $cache = new Map<string, QuestionGroup>();

    public static new(
        data: ScoutingQuestionGroup,
    ): Promise<Result<QuestionGroup>> {
        return attemptAsync(async () => {
            const res = await ServerRequest.post(
                '/api/scouting-questions/new-group',
                {
                    ...data,
                },
            );

            if (res.isOk()) return new QuestionGroup(data);
            throw res.error;
        });
    }

    public readonly id: string;
    public readonly eventKey: string;
    public readonly section: string;
    public $name: string;

    constructor(data: ScoutingQuestionGroup) {
        super();
        this.id = data.id;
        this.eventKey = data.eventKey;
        this.section = data.section;
        this.$name = data.name;

        if (!QuestionGroup.$cache.has(this.id)) {
            QuestionGroup.$cache.set(this.id, this);
        }
    }

    get name() {
        return this.$name;
    }

    set name(value: string) {
        this.$name = value;
        this.update();
    }

    public async getQuestions(): Promise<Result<ScoutingQuestion[]>> {
        return attemptAsync(async () => {
            const res = await ServerRequest.post<ScoutingQuestionObj[]>(
                '/api/scouting-questions/get-questions',
                {
                    groupId: this.id,
                },
            );

            if (res.isOk()) {
                return res.value.map((q) => new ScoutingQuestion(q));
            } else throw res.error;
        });
    }

    private async update(): Promise<Result<void>> {
        return attemptAsync(async () => {});
    }
}
