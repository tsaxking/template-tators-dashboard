import { attemptAsync, Result } from '../../../../shared/attempt';
import {
    QuestionOptions,
    ScoutingQuestion as ScoutingQuestionObj,
    ScoutingQuestionGroup,
} from '../../../../shared/db-types-extended';
import { EventEmitter } from '../../../../shared/event-emitter';
import { Cache } from '../../cache';
import { Question } from './question';
import { ServerRequest } from '../../../utilities/requests';
import { socket } from '../../../utilities/socket';
import { BootstrapColor } from '../../../submodules/colors/color';

type Updates = {
    new: Group;
    delete: string; // id
};

type GroupUpdates = {
    update: Group;
    'new-question': Question;
    'delete-question': string; // id
    delete: void;
};

// used to organize questions into separate groups
export class Group extends Cache<GroupUpdates> {
    private static readonly $emitter = new EventEmitter<keyof Updates>();

    static readonly colorOrder: BootstrapColor[] = [
        'primary',
        'dark',
        'indigo',
        'steel',
        'warning',
        'grape',
        'cyan',
    ];

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: Updates[K]) => void,
    ): void {
        Group.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: Updates[K]) => void,
    ): void {
        Group.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(
        event: K,
        data: Updates[K],
    ): void {
        Group.$emitter.emit(event, data);
    }

    public static readonly $cache = new Map<string, Group>();

    public static new(data: {
        name: string;
        eventKey: string;
        section: string;
    }): Promise<Result<Group>> {
        return attemptAsync(async () => {
            const res = await ServerRequest.post<{
                data: ScoutingQuestionGroup;
            }>('/api/scouting-questions/new-group', {
                name: data.name,
                eventKey: data.eventKey,
                section: data.section,
            });

            if (res.isOk()) return new Group(res.value.data);
            throw res.error;
        });
    }

    public readonly id: string;
    public readonly eventKey: string;
    public readonly section: string;
    public $name: string;
    public readonly dateAdded: Date;

    constructor(data: ScoutingQuestionGroup) {
        super();
        this.id = data.id;
        this.eventKey = data.eventKey;
        this.section = data.section;
        this.$name = data.name;
        this.dateAdded = new Date(data.dateAdded);

        if (!Group.$cache.has(this.id)) {
            Group.$cache.set(this.id, this);
        }
    }

    get name() {
        return this.$name;
    }

    set name(value: string) {
        this.$name = value;
    }

    public async getQuestions(): Promise<Result<Question[]>> {
        return attemptAsync(async () => {
            const res = await ServerRequest.post<ScoutingQuestionObj[]>(
                '/api/scouting-questions/get-questions',
                {
                    group: this.id,
                },
            );

            if (res.isOk()) {
                return res.value.map((q) => {
                    const question = new Question(q);
                    question.on('delete', () => {
                        this.emit('delete-question', q.id);
                    })
                    return question;
                });
            } else throw res.error;
        });
    }

    async update(): Promise<Result<void>> {
        return attemptAsync(async () => {
            const res = await ServerRequest.post<ScoutingQuestionGroup>(
                '/api/scouting-questions/update-group',
                {
                    id: this.id,
                    name: this.name,
                    eventKey: this.eventKey,
                },
            );

            if (res.isOk()) {
                this.name = res.value.name;
                return;
            }

            throw res.error;
        });
    }

    public async addQuestion(data: {
        question: string;
        type:
            | 'text'
            | 'number'
            | 'boolean'
            | 'select'
            | 'checkbox'
            | 'radio'
            | 'textarea';
        key: string;
        description: string;
        options: QuestionOptions; // TODO: add type
    }) {
        return attemptAsync(async () => {
            const res = await ServerRequest.post<{
                data: ScoutingQuestionObj;
            }>('/api/scouting-questions/new-question', {
                ...data,
                group: this.id,
                section: this.section,
            });

            if (res.isOk()) return new Question(res.value.data);
            throw res.error;
        });
    }

    public async removeQuestion(id: string): Promise<Result<void>> {
        return attemptAsync(async () => {
            const q = Question.$cache.get(id);
            if (!q) throw new Error('Question not found');

            const res = await q.delete();
            if (res.isOk()) {
                Question.$cache.delete(id);
            } else throw res.error;
        });
    }

    delete(): Promise<Result<void>> {
        return attemptAsync(async () => {
            // throw new Error('Method not implemented.');
            const res = await ServerRequest.post<void>(
                '/api/scouting-questions/delete-group',
                {
                    id: this.id,
                },
            );

            if (res.isOk()) {
                Group.$cache.delete(this.id);
                Group.emit('delete', this.id);
                this.emit('delete', undefined);
                this.destroy();
            } else throw res.error;
        });
    }
}

socket.on('scouting-question:new-question', (data: ScoutingQuestionObj) => {
    const g = Group.$cache.get(data.groupId);
    if (!g) return;

    const q = new Question(data);
    g.emit('new-question', q);
});
