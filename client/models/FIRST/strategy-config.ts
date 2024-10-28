import { Cache } from "../cache";
import { StrategyConfigs as SC } from "../../../server/utilities/tables";
import { EventEmitter } from "../../../shared/event-emitter";
import { attemptAsync } from "../../../shared/check";
import { ServerRequest } from "../../utilities/requests";

type StrategyConfigEvents = {
    update: undefined;
};

type GlobalStrategyConfigEvents = {
    new: StrategyConfig;
};

export class StrategyConfig extends Cache<StrategyConfigEvents> {
    public static readonly emitter = new EventEmitter<GlobalStrategyConfigEvents>();

    public static on = StrategyConfig.emitter.on.bind(StrategyConfig.emitter);
    public static off = StrategyConfig.emitter.off.bind(StrategyConfig.emitter);
    public static once = StrategyConfig.emitter.once.bind(StrategyConfig.emitter);
    public static emit = StrategyConfig.emitter.emit.bind(StrategyConfig.emitter);



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

    delete() {
        return attemptAsync(async () => {
            await ServerRequest.post('/api/strategy/delete-config', {
                id: this.id
            });
        });
    }

    update(data: Partial<Omit<SC, 'id' | 'strategyId'>>) {
        const { team, type, value } = data;
        return ServerRequest.post('/api/strategy/update-config', {
            id: this.id,
            team,
            type,
            value
        });
    }
}