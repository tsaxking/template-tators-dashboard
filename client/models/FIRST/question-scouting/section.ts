import { attemptAsync, Result } from '../../../../shared/check';
import {
    ScoutingQuestionGroup,
    ScoutingSection
} from '../../../../shared/db-types-extended';
import { EventEmitter } from '../../../../shared/event-emitter';
import { ServerRequest } from '../../../utilities/requests';
import { Cache } from '../../cache';
import { Group } from './group';
import { socket } from '../../../utilities/socket';
import { FIRSTEvent } from '../event';

type Updates = {
    new: Section;
    update: Section;
    delete: string; // id
};

type SectionUpdates = {
    'new-group': Group;
    'delete-group': string; // id
    update: Section;
    delete: void;
};

// pitscouting/prescouting/mechanical/programming/electrical/strategical etc.
export class Section extends Cache<SectionUpdates> {
    private static readonly $emitter = new EventEmitter<keyof Updates>();

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: Updates[K]) => void
    ): void {
        Section.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: Updates[K]) => void
    ): void {
        Section.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(
        event: K,
        data: Updates[K]
    ): void {
        Section.$emitter.emit(event, data);
    }

    static async all(): Promise<Section[]> {
        const cache = Array.from(Section.$cache.values());
        if (cache.length) return cache;

        const res = await ServerRequest.post<ScoutingSection[]>(
            '/api/scouting-questions/get-sections'
        );

        if (res.isOk()) {
            return res.value.map(s => new Section(s));
        }

        return [];
    }

    public static readonly $cache = new Map<string, Section>();

    public static async new(data: {
        name: string;
        multiple: boolean;
    }): Promise<Result<void>> {
        return attemptAsync(async () => {
            const res = await ServerRequest.post<ScoutingSection>(
                '/api/scouting-questions/new-section',
                {
                    name: data.name.trim(),
                    multiple: data.multiple ? 1 : 0,
                },
            );

            if (res.isErr()) throw res.error;
        });
    }

    public static async fromId(
        id: string
    ): Promise<Result<Section | undefined>> {
        return attemptAsync(async () => {
            if (Section.$cache.has(id)) {
                return Section.$cache.get(id) as Section;
            }

            const res = await ServerRequest.post<ScoutingSection | undefined>(
                '/api/scouting-questions/get-section',
                {
                    id
                }
            );

            if (res.isOk()) {
                if (res.value) return new Section(res.value);
                else return undefined;
            }
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

    public async getGroups(event: FIRSTEvent): Promise<Result<Group[]>> {
        return attemptAsync(async () => {
            if (this.$cache.has(`${event.tba.key}-groups`)) {
                const groups = this.$cache.get(
                    `${event.tba.key}-groups`
                ) as Group[];
                if (groups.length) return groups;
            }

            const res = await ServerRequest.post<ScoutingQuestionGroup[]>(
                '/api/scouting-questions/get-groups',
                {
                    section: this.id,
                    eventKey: event.tba.key
                }
            );

            if (res.isOk()) {
                const groups = res.value.map(g => {
                    const group = new Group(g);
                    group.on('delete', () => {
                        this.emit('delete-group', g.id);
                    });
                    return group;
                });
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
            section: this.id
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
            const res = await ServerRequest.post<void>(
                '/api/scouting-questions/delete-section',
                {
                    id: this.id
                }
            );

            if (res.isErr()) throw res.error;
        });
    }
}

socket.on('scouting-question:new-section', (data: ScoutingSection) => {
    const s = new Section(data);
    Section.emit('new', s);
});

socket.on('scouting-question:update-section', (data: ScoutingSection) => {
    const s = Section.$cache.get(data.id);
    if (!s) return;

    s.$name = data.name;
    s.$multiple = !!data.multiple;
    Section.emit('update', s);

    s.emit('update', s);
});

socket.on('scouting-question:new-group', (data: ScoutingQuestionGroup) => {
    const g = new Group(data);
    const s = Section.$cache.get(data.section);
    if (!s) return;
    s.emit('new-group', g);

    const groups = s.$cache.get('groups') as Group[] | undefined;
    if (!groups) return s.$cache.set('groups', [g]);

    groups.push(g);
});

socket.on('scouting-question:section-deleted', (id: string) => {
    const s = Section.$cache.get(id);
    if (!s) return;

    Section.$cache.delete(id);
    s.destroy();
    Section.emit('delete', id);
});
