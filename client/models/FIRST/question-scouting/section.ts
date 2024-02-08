import { attemptAsync, Result } from '../../../../shared/attempt';
import {
    ScoutingQuestionGroup,
    ScoutingSection,
} from '../../../../shared/db-types-extended';
import { EventEmitter } from '../../../../shared/event-emitter';
import { ServerRequest } from '../../../utilities/requests';
import { Cache } from '../../cache';
import { Group } from './group';

type Updates = {
    new: Section;
    update: Section;
};

type SectionUpdates = {
    'new-group': Group;
    'delete-group': string; // id
    update: Section;
};

// pitscouting/prescouting/mechanical/programming/electrical/strategical etc.
export class Section extends Cache<SectionUpdates> {
    private static readonly $emitter = new EventEmitter<keyof Updates>();

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: Updates[K]) => void,
    ): void {
        Section.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: Updates[K]) => void,
    ): void {
        Section.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(
        event: K,
        data: Updates[K],
    ): void {
        Section.$emitter.emit(event, data);
    }

    static async all(): Promise<Section[]> {
        const cache = Array.from(Section.$cache.values());
        if (cache.length) return cache;

        const res = await ServerRequest.post<ScoutingSection[]>(
            '/api/scouting-questions/get-sections',
        );

        if (res.isOk()) {
            return res.value.map((s) => new Section(s));
        }

        return [];
    }

    public static readonly $cache = new Map<string, Section>();

    public static async new(data: {
        name: string;
        multiple: boolean;
    }): Promise<Result<Section>> {
        return attemptAsync(async () => {
            const res = await ServerRequest.post<ScoutingSection>(
                '/api/scouting-questions/new-section',
                {
                    ...data,
                },
            );

            if (res.isOk()) return new Section(res.value);

            throw res.error;
        });
    }

    public $name: string;
    public $multiple: boolean;
    public readonly id: string;
    public readonly dateAdded: string;
    public readonly accountId: string;

    constructor(data: ScoutingSection) {
        super();

        this.$name = data.name;
        this.$multiple = !!data.multiple; // multiple is 0 or 1 in the database
        this.id = data.id;
        this.dateAdded = data.dateAdded;
        this.accountId = data.accountId;

        if (Section.$cache.has(data.id)) {
            Section.$cache.get(data.id)?.destroy();
        }

        Section.$cache.set(data.id, this);
    }

    public async getGroups(): Promise<Result<Group[]>> {
        return attemptAsync(async () => {
            if (this.$cache.has('groups')) {
                return this.$cache.get('groups') as Group[];
            }

            const res = await ServerRequest.post<ScoutingQuestionGroup[]>(
                '/api/scouting-questions/get-groups',
                {
                    section: this.name,
                },
            );

            if (res.isOk()) {
                const groups = res.value.map((g) => new Group(g));
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
        return attemptAsync(async () => {
            throw new Error('Not implemented');
        });
    }

    addGroup(group: { name: string; eventKey: string }) {
        return Group.new({
            name: group.name,
            eventKey: group.eventKey,
            section: this.id,
        });
    }

    removeGroup(id: string) {
        return attemptAsync(async () => {
            const group = Group.$cache.get(id);
            if (!group) throw new Error('Group not found');
            const res = await group.delete();
            if (res.isOk()) {
                Group.$cache.delete(id);
                group.destroy();
                return;
            } else throw res.error;
        });
    }

    delete() {
        return attemptAsync(async () => {
            throw new Error('Not implemented');
            // const res = await ServerRequest.post<void>(
            //     '/api/scouting-questions/delete-section',
            //     {
            //         id: this.id,
            //     },
            // );

            // if (res.isOk()) {
            //     Section.$cache.delete(this.id);
            //     this.destroy();
            //     return;
            // } else throw res.error;
        });
    }
}
