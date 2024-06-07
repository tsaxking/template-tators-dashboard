import { Cache } from "./cache";
import { Matches as M } from "../../utilities/tables";
import { attemptAsync } from "../../../shared/check";
import { DB } from "../../utilities/databases";

export class Match extends Cache {
    public static fromId(id: string) {
        return attemptAsync(async () => {
            const data = (await DB.get('matches/from-id', { id })).unwrap();
            if (!data) return null;
            return new Match(data);
        });
    }

    public static fromEvent(eventKey: string) {
        return attemptAsync(async () => {
            const data = (await DB.all('matches/from-event', { eventKey })).unwrap();
            return data.map(d => new Match(d));
        });
    }

    public static new(data: {
        id: string;
        eventKey: string;
        matchNumber: number;
        compLevel: string;
    }) {
        return attemptAsync(async () => {
            const e = (await Match.fromId(data.id)).unwrap();
            if (e) throw new Error('Match already exists');
            await DB.run('matches/new', data);
        });
    }

    id: string;
    eventKey: string;
    matchNumber: number;
    compLevel: string;
    constructor(data: M) {
        super();
        this.id = data.id;
        this.eventKey = data.eventKey;
        this.matchNumber = data.matchNumber;
        this.compLevel = data.compLevel;
    }
}