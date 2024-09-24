import { attemptAsync } from '../../../shared/check';
import { DB } from '../../utilities/databases';
import { CustomMatches as CM } from '../../utilities/tables';
import { uuid } from '../../utilities/uuid';
import { Cache } from './cache';

export class CustomMatch extends Cache {
    public static fromEvent(eventKey: string) {
        return attemptAsync(async () => {
            const data = (
                await DB.get('custom-matches/from-event', { eventKey })
            ).unwrap();
            if (!data) return undefined;
            return new CustomMatch(data);
        });
    }

    public static new(data: {
        eventKey: string;
        matchNumber: number;
        compLevel: string;
        red1: number;
        red2: number;
        red3: number;
        red4: number | undefined;
        blue1: number;
        blue2: number;
        blue3: number;
        blue4: number | undefined;
        name: string;
    }) {
        return attemptAsync(async () => {
            const id = uuid();
            const created = Date.now();
            (
                await DB.run('custom-matches/new', {
                    ...data,
                    id,
                    created
                })
            ).unwrap();
            return new CustomMatch({ ...data, id, created, archive: 0 });
        });
    }

    public static fromId(id: string) {
        return attemptAsync(async () => {
            const data = (
                await DB.get('custom-matches/from-id', { id })
            ).unwrap();
            if (!data) return undefined;
            return new CustomMatch(data);
        });
    }

    id: string;
    eventKey: string;
    matchNumber: number;
    compLevel: string;
    red1: number;
    red2: number;
    red3: number;
    red4: number | undefined;
    blue1: number;
    blue2: number;
    blue3: number;
    blue4: number | undefined;
    created: number;
    name: string;
    archive: 0 | 1;

    constructor(data: CM) {
        super();
        this.id = data.id;
        this.eventKey = data.eventKey;
        this.matchNumber = data.matchNumber;
        this.compLevel = data.compLevel;
        this.red1 = data.red1;
        this.red2 = data.red2;
        this.red3 = data.red3;
        this.red4 = data.red4;
        this.blue1 = data.blue1;
        this.blue2 = data.blue2;
        this.blue3 = data.blue3;
        this.blue4 = data.blue4;
        this.created = data.created;
        this.name = data.name;
        this.archive = data.archive;
    }

    update(data: Partial<Omit<CM, 'id' | 'created'>>) {
        Object.assign(this, data);
        return DB.run('custom-matches/update', { ...this, ...data });
    }
}
