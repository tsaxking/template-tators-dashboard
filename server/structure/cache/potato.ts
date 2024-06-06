import { attemptAsync } from "../../../shared/check";
import { DB } from "../../utilities/databases";
import { Cache } from "./cache";
import { Potato as P } from "../../utilities/tables";
import { State } from "../../../shared/potato-types";

export class Potato extends Cache {
    public static fromAccount(accountId: string) {
        return attemptAsync(async () => {
            const potato = (await DB.get('potato/from-account', { accountId })).unwrap();
            if (potato) {
                const p = new Potato(potato);
                p.update({
                    ...potato,
                    lastAccessed: Date.now()
                });
                return p;
            } else {
                return (await this.build(accountId)).unwrap();
            }
        });
    }

    public static build(accountId: string) {
        return attemptAsync(async () => {
            const init = JSON.stringify({
                level: 0,
                achievements: {
                    normal: [],
                    shadow: []
                }
            });

            const now = Date.now();

            (await DB.run('potato/new', {
                accountId,
                json: init,
                lastAccessed: now
            })).unwrap();

            return new Potato({
                accountId,
                json: init,
                lastAccessed: now
            });
        });
    }

    static get achievements() {
        return Object.freeze(['tator']);
    }

    lastAccessed: number;
    accountId: string;
    json: string;

    constructor(data: P) {
        super();
        this.lastAccessed = data.lastAccessed;
        this.accountId = data.accountId;
        this.json = data.json;
    }

    get state() {
        return JSON.parse(this.json) as State;
    }


    update(data: P) {
        return DB.run('potato/update', data);
    }

    save(state: State) {
        return attemptAsync(async () => {
            const { floor } = Math;

            // TODO: logic for if the state is valid
            const { level, achievements: {
                normal, shadow
            } } = this.state;
            const { lastAccessed } = this; 
            const now = Date.now();
            const ticks = floor((now - lastAccessed) / (5 * 1000 * 60)); // 5 minutes per tick
            const canSave = true;



            if (canSave) {(await this.update({
                accountId: this.accountId,
                lastAccessed: Date.now(),
                json: JSON.stringify(state)
            })).unwrap(); return 'saved';}
            else return 'not allowed';
        });
    }
}