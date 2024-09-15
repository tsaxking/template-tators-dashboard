import { Cache } from './cache';
import { StrategyConfigs as SC } from '../../utilities/tables';
import { attemptAsync } from '../../../shared/check';
import { uuid } from '../../utilities/uuid';
import { DB } from '../../utilities/databases';
import { Strategy } from './strategy';


export class StrategyConfigs extends Cache {
    public static new(config: Omit<SC, 'id'>) {
        return attemptAsync(async () => {
            const id = uuid();
            (await DB.run('strategy-configs/new', {
                ...config,
                id
            })).unwrap();

            return new StrategyConfigs({
                id,
                ...config
            });
        });
    }

    public static fromId(id: string) {
        return attemptAsync(async () => {
            const config = (await DB.run('strategy-configs/from-id', { id })).unwrap();
            return new StrategyConfigs(config);
        });
    }

    public static fromStrategyId(strategyId: string) {
        return attemptAsync(async () => {
            const configs = (await DB.all('strategy-configs/from-strategy', { strategyId })).unwrap();
            return configs.map(config => new StrategyConfigs(config));
        });
    }
    
    public readonly id: string;
    public readonly strategyId: string;
    public team: number;
    public type: string;
    public value: string;
    
    constructor(config: SC) {
        super();
        this.id = config.id;
        this.strategyId = config.strategyId;
        this.team = config.team;
        this.type = config.type;
        this.value = config.value;
    }

    getStrategy() {
        return Strategy.fromId(this.strategyId);
    }

    update(data: Partial<Omit<SC, 'id' | 'strategyId'>>) {
        return attemptAsync(async () => {
            (await DB.run('strategy-configs/update', {
                ...this,
                ...data
            })).unwrap();
            Object.assign(this, data);
        });
    }

    delete() {
        return DB.run('strategy-configs/delete', { id: this.id });
    }
}