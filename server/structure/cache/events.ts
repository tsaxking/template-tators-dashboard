import { Cache } from './cache';
import { Events as E } from '../../utilities/tables';
import { attemptAsync } from '../../../shared/check';
import { DB } from '../../utilities/databases';

export class Event extends Cache {
    public static fromKey(eventKey: string) {
        return attemptAsync(async () => {
            const data = (
                await DB.get('events/from-key', { eventKey })
            ).unwrap();
            if (!data) return null;
            return new Event(data);
        });
    }

    public static new(eventKey: string) {
        return attemptAsync(async () => {
            const e = (await Event.fromKey(eventKey)).unwrap();
            if (e) throw new Error('Event already exists');
            await DB.run('events/new-event', { eventKey, flipX: 0, flipY: 0 });
        });
    }

    eventKey: string;
    flipX: number;
    flipY: number;

    constructor(data: E) {
        super();
        this.eventKey = data.eventKey;
        this.flipX = data.flipX;
        this.flipY = data.flipY;
    }

    update(data: { flipX: number; flipY: number }) {
        return DB.run('events/update', { eventKey: this.eventKey, ...data });
    }

    delete() {
        return DB.run('events/delete-event', { eventKey: this.eventKey });
    }
}
