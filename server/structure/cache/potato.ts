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

    // this should only be called if the potato doesn't exist
    private static build(accountId: string) {
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


    private update(data: P) {
        return DB.run('potato/update', data);
    }
}