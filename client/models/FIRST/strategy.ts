import { CompLevel, Strategy as StrategyObj, Whiteboard as WhiteboardObj } from "../../../shared/db-types-extended";
import { EventEmitter } from "../../../shared/event-emitter";
import { RetrieveStreamEventEmitter } from "../../utilities/requests";
import { ServerRequest } from "../../utilities/requests";
import { Whiteboard } from "./whiteboard";
import { Cache } from "../cache";

/**
 * Events that are emitted by a {@link Strategy} object
 * @date 10/9/2023 - 6:52:30 PM
 *
 * @typedef {StrategyUpdateData}
 */
type StrategyUpdateData = {};

/**
 * Used to create a {@link Strategy} object from different sources
 * @date 10/9/2023 - 6:52:30 PM
 *
 * @typedef {FromType}
 */
type FromType = {
    'match': {
        eventKey: string;
        matchNumber: number;
        compLevel: string;
    };

    'custom-match': {
        eventKey: string;
        matchNumber: number;
        compLevel: CompLevel;
    } | {
        id: string;
    };

    'whiteboard': {
        id: string;
    };
}


/**
 * Represents the strategy for a match or a custom match. Can be paired with a whiteboard
 * @date 10/9/2023 - 6:52:30 PM
 *
 * @export
 * @class Strategy
 * @typedef {Strategy}
 * @implements {FIRST}
 */
export class Strategy extends Cache<StrategyUpdateData> {
    public static current?: Strategy = undefined;

    /**
     * Map of all Strategy objects
     * @date 10/9/2023 - 6:52:30 PM
     *
     * @public
     * @static
     * @readonly
     * @type {*}
     */
    public static readonly cache: Map<string, Strategy> = new Map<string, Strategy>();

    /**
     * Retrieves a {@link Strategy} object from the server using different methods
     * @date 10/9/2023 - 6:52:30 PM
     *
     * @static
     * @template K
     * @param {K} type
     * @param {FromType[K]} body
     * @returns {RetrieveStreamEventEmitter<Strategy>}
     */
    static from<K extends keyof FromType>(type: K, body: FromType[K]): RetrieveStreamEventEmitter<Strategy> {
        return ServerRequest
            .retrieveStream<Strategy>(
                `/api/${type}/strategy`, 
                body, 
                (s) => new Strategy(JSON.parse(s) as StrategyObj)
            );
    }












    /**
     * Creates an instance of Strategy.
     * @date 10/9/2023 - 6:52:29 PM
     *
     * @constructor
     * @param {StrategyObj} data
     */
    constructor(public readonly data: StrategyObj) {
        super();
        if (!Strategy.cache.has(data.id)) {
            Strategy.cache.set(data.id, this);
        }
    }


    /**
     * Streams all whiteboards associated with this strategy
     * Returns an emitter that emits chunks of the whiteboards
     * @date 10/9/2023 - 6:52:29 PM
     *
     * @public
     * @returns {RetrieveStreamEventEmitter<Whiteboard>}
     */
    public getWhiteboards(): RetrieveStreamEventEmitter<Whiteboard> {
        if (this.$cache.has('strategy')) {
            const res = this.$cache.get('strategy') as Whiteboard[];

            const em = new RetrieveStreamEventEmitter<Whiteboard>();

            res.forEach(s => em.emit('chunk', s));

            return em;
        }

        const em = ServerRequest
            .retrieveStream<Whiteboard>(
                '/api/strategy/whiteboards', 
                {
                    whiteboardId: this.data.whiteboardId
                }, 
                (s) => new Whiteboard(JSON.parse(s) as WhiteboardObj)
            );


        em.on('complete', (data) => {
            this.$cache.set('strategy', data);
        });

        return em;
    }











    /**
     * Destroys this object, including all event listeners and cache
     * @date 10/9/2023 - 6:52:29 PM
     *
     * @public
     */
    public destroy() {
        Strategy.cache.delete(this.data.id);
        super.destroy();
    }


    public select(): void {
        Strategy.current = this;
        Strategy.emit('select', this);
    }
};