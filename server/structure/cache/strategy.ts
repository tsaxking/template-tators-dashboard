import { Cache } from "./cache";
import { DB } from "../../utilities/databases";
import { Strategy as S } from '../../utilities/tables';
import { attemptAsync } from "../../../shared/check";
import { CompLevel } from "../../../shared/db-types-extended";
import { uuid } from "../../utilities/uuid";

export class Strategy extends Cache {
    public static fromId(id: string) {
        return attemptAsync(async () => {
            const s = (await DB.get('strategy/from-id', { id })).unwrap();
            if (!s) return undefined;
            return new Strategy(s);
        });
    }

    public static fromMatch(eventKey: string, matchNumber: number, compLevel: CompLevel) {
        return attemptAsync(async () => {
            const s = (await DB.all('strategy/from-match', { 
                eventKey,
                matchNumber,
                compLevel,
            })).unwrap();
            return s.map(s => new Strategy(s));
        });
    }

    public static fromCustomMatch(customMatchId: string) {
        return attemptAsync(async () => {
            const s = (await DB.all('strategy/from-custom-match', { customMatchId })).unwrap();
            return s.map(s => new Strategy(s));
        });
    }

    public static new(data: Omit<S, 'id' | 'archive'>) {
        return attemptAsync(async () => {
            const id = uuid();
            await DB.run('strategy/new', { ...data, id });
            return new Strategy({ ...data, id, archive: 0 });
        });
    }

    public readonly id: string;
    public name: string;
    public time: number;
    public readonly createdBy: string;
    public matchId: string | undefined;
    public customMatchId: string | undefined;
    public comment: string;
    public archive: 0 | 1;
    public checks: string;
    constructor(data: S) {
        super();

        this.id = data.id;
        this.name = data.name;
        this.time = data.time;
        this.createdBy = data.createdBy;
        this.matchId = data.matchId;
        this.customMatchId = data.customMatchId;
        this.comment = data.comment;
        this.archive = data.archive;
        this.checks = data.checks;
    }

    update(data: Partial<Omit<S, 'id' | 'createdBy'>>) {
        return attemptAsync(async () => {
            (await DB.run('strategy/update', { ...this, ...data })).unwrap();
            Object.assign(this, data);
        });
    }
}