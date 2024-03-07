import { attemptAsync, Result } from '../../../../shared/check';
import {
    QuestionOptions,
    ScoutingQuestion as ScoutingQuestionObj,
    ScoutingQuestionGroup
} from '../../../../shared/db-types-extended';
import { EventEmitter } from '../../../../shared/event-emitter';
import { Cache } from '../../cache';
import { Question } from './question';
import { ServerRequest } from '../../../utilities/requests';
import { socket } from '../../../utilities/socket';
import { BootstrapColor } from '../../../submodules/colors/color';
import { Section } from './section';

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
        'cyan'
    ];

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: Updates[K]) => void
    ): void {
        Group.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: Updates[K]) => void
    ): void {
        Group.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(
        event: K,
        data: Updates[K]
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
                section: data.section
            });

            if (res.isOk()) return new Group(res.value.data);
            throw res.error;
        });
    }

    public static async fromId(id: string): Promise<Result<Group | undefined>> {
        return attemptAsync(async () => {
            if (Group.$cache.has(id)) return Group.$cache.get(id) as Group;

            const res = await ServerRequest.post<
                ScoutingQuestionGroup | undefined
            >('/api/scouting-questions/get-group', {
                id
            });

            if (res.isOk()) {
                if (res.value) return new Group(res.value);
                else return undefined;
            }
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

        if (Group.$cache.has(this.id)) {
            Group.$cache.delete(this.id);
        }

        Group.$cache.set(this.id, this);
    }

    get name() {
        return this.$name;
    }

    set name(value: string) {
        this.$name = value;
    }

    public async getQuestions(): Promise<Result<Question[]>> {
        return attemptAsync(async () => {
            const cached = Question.$cache.values();
            const questions = Array.from(cached).filter(
                q => q.groupId === this.id
            );
            if (questions.length) return questions;

            if (!this.id) {
                console.error(this);
                throw new Error('Group id not found');
            }
            const res = await ServerRequest.post<ScoutingQuestionObj[]>(
                '/api/scouting-questions/get-questions',
                {
                    group: this.id
                }
            );

            if (res.isOk()) {
                const questions = res.value.map(q => {
                    const question = new Question(q);
                    question.on('delete', () => {
                        this.emit('delete-question', q.id);
                    });
                    return question;
                });

                this.$cache.set('questions', questions);

                return questions;
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
                    eventKey: this.eventKey
                }
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
                section: this.section
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
                    id: this.id
                }
            );

            if (res.isErr()) throw res.error;
        });
    }

    async getSection(): Promise<Section | undefined> {
        const s = await Section.fromId(this.section);
        if (s.isOk()) return s.value;
        console.log('error getting section', s.error);
        return undefined;
    }
}

socket.on('scouting-question:new-question', (data: ScoutingQuestionObj) => {
    console.log('new question', data);

    const g = Group.$cache.get(data.groupId);
    if (!g) return;

    const q = new Question(data);
    (g.$cache.get('questions') as Question[]).push(q);
    g.emit('new-question', q);
    Question.emit('new', q);
});

socket.on('scouting-question:group-deleted', (id: string) => {
    const g = Group.$cache.get(id);
    if (!g) return;

    Group.$cache.delete(id);
    g.emit('delete', undefined);
    g.destroy();
});
