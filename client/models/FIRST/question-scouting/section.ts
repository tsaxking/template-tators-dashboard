import { attemptAsync, Result } from '../../../../shared/attempt';
import {
    ScoutingQuestionGroup,
    ScoutingSection,
} from '../../../../shared/db-types-extended';
import { EventEmitter } from '../../../../shared/event-emitter';
import { ServerRequest } from '../../../utilities/requests';
import { Cache } from '../../cache';
import { QuestionGroup } from './group';

type Updates = {
    new: unknown;
    update: unknown;
};

// pitscouting/prescouting/mechanical/programming/electrical/strategical etc.
export class QuestionSection extends Cache {
    private static readonly $emitter = new EventEmitter<keyof Updates>();

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: Updates[K]) => void,
    ): void {
        QuestionSection.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: Updates[K]) => void,
    ): void {
        QuestionSection.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(
        event: K,
        data: Updates[K],
    ): void {
        QuestionSection.$emitter.emit(event, data);
    }

    public static readonly $cache = new Map<string, QuestionSection>();

    public static async new(
        data: ScoutingSection,
    ): Promise<Result<QuestionSection>> {
        return attemptAsync(async () => {
            const res = await ServerRequest.post(
                '/api/scouting-questions/new-section',
                {
                    ...data,
                },
            );

            if (res.isOk()) return new QuestionSection(data);

            throw res.error;
        });
    }

    public $name: string;
    public $multiple: boolean;

    constructor(data: ScoutingSection) {
        super();

        this.$name = data.name;
        this.$multiple = !!data.multiple; // multiple is 0 or 1 in the database

        if (QuestionSection.$cache.has(data.name)) {
            QuestionSection.$cache.get(data.name)?.destroy();
        }

        QuestionSection.$cache.set(data.name, this);
    }

    public async getGroups(): Promise<Result<QuestionGroup[]>> {
        return attemptAsync(async () => {
            if (this.$cache.has('groups')) {
                return this.$cache.get('groups') as QuestionGroup[];
            }

            const res = await ServerRequest.post<ScoutingQuestionGroup[]>(
                '/api/scouting-questions/get-groups',
                {
                    section: this.name,
                },
            );

            if (res.isOk()) {
                const groups = res.value.map((g) => new QuestionGroup(g));
                this.$cache.set('groups', groups);
                return groups;
            }

            throw res.error;
        });
    }

    public get name(): string {
        return this.$name;
    }

    public set name(name: string) {
        this.$name = name;
        this.update();
    }

    public get multiple(): boolean {
        return this.$multiple;
    }

    public set multiple(multiple: boolean) {
        this.$multiple = multiple;
        this.update();
    }

    // sends info to server
    private async update(): Promise<Result<void>> {
        return attemptAsync(async () => {});
    }
}


