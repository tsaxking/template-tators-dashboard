import { attemptAsync } from '../../../shared/check';
import { DB } from '../../utilities/databases';
import { Cache } from './cache';
import { Potato as P } from '../../utilities/tables';
import Account from '../accounts';

export class Potato extends Cache {
    public static fromUsername(username: string) {
        return attemptAsync(async () => {
            const account = await Account.fromUsername(username);
            if (!account) return null;
            return (await this.fromAccount(account.id)).unwrap();
        });
    }

    public static fromAccount(accountId: string) {
        return attemptAsync(async () => {
            const potato = (
                await DB.get('potato/from-account', { accountId })
            ).unwrap();
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
            const now = Date.now();

            (
                await DB.run('potato/new', {
                    accountId,
                    lastAccessed: now,
                    achievements: '[]',
                    shadowAchievements: '[]',
                    potatoChips: 0,
                    name: ''
                })
            ).unwrap();

            return new Potato({
                accountId,
                achievements: '[]',
                shadowAchievements: '[]',
                potatoChips: 0,
                lastAccessed: now,
                name: ''
            });
        });
    }

    public static all() {
        return attemptAsync(async () => {
            return (await DB.all('potato/all'))
                .unwrap()
                .map(p => new Potato(p));
        });
    }

    static get achievements() {
        return Object.freeze(['tator']);
    }

    lastAccessed: number;
    accountId: string;
    achievements: string[];
    shadowAchievements: string[];
    potatoChips: number;
    name: string;

    constructor(data: P) {
        super();
        this.lastAccessed = data.lastAccessed;
        this.accountId = data.accountId;
        this.achievements = JSON.parse(data.achievements);
        this.shadowAchievements = JSON.parse(data.shadowAchievements);
        this.potatoChips = data.potatoChips;
        this.name = data.name;
    }

    update(data: Partial<P>) {
        return DB.run('potato/update', {
            ...this.json,
            ...data
        });
    }

    private get json() {
        return {
            lastAccessed: this.lastAccessed,
            accountId: this.accountId,
            achievements: JSON.stringify(this.achievements),
            shadowAchievements: JSON.stringify(this.shadowAchievements),
            potatoChips: this.potatoChips,
            name: this.name
        };
    }

    give(chips: number) {
        this.potatoChips += chips;
        if (this.potatoChips < 0) this.potatoChips = 0;
        return this.update(this.json);
    }

    award(achievement: string, shadow = false) {
        if (shadow) {
            this.shadowAchievements.push(achievement);
        } else {
            this.achievements.push(achievement);
        }

        return this.update(this.json);
    }

    getUsername() {
        return attemptAsync(async () => {
            const a = await Account.fromId(this.accountId);
            if (!a) return 'Unknown';
            return a.username;
        });
    }

    toObject() {
        return attemptAsync(async () => {
            const username = (await this.getUsername()).unwrap();
            return {
                username,
                ...this.json
            };
        });
    }
}
