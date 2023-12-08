import { Whiteboard as WhiteboardObj } from "../../../shared/db-types-extended";
import { EventEmitter } from "../../../shared/event-emitter";
import { Cache } from "../cache";

/**
 * Events that are emitted by a {@link Whiteboard} object
 * @date 10/9/2023 - 6:58:43 PM
 *
 * @typedef {WhiteboardUpdateData}
 */
type WhiteboardUpdateData = {};



/**
 * Represents a FIRST whiteboard
 * @date 10/9/2023 - 6:58:43 PM
 *
 * @export
 * @class Whiteboard
 * @typedef {Whiteboard}
 * @implements {FIRST}
 */
export class Whiteboard extends Cache<WhiteboardUpdateData> {
    /**
     * Cache for all {@link Whiteboard} objects
     * @date 10/9/2023 - 6:58:43 PM
     *
     * @public
     * @static
     * @readonly
     * @type {Map<string, Whiteboard>}
     */
    public static readonly cache: Map<string, Whiteboard> = new Map<string, Whiteboard>();




    /**
     * Creates an instance of Whiteboard.
     * @date 10/9/2023 - 6:58:43 PM
     *
     * @constructor
     * @param {WhiteboardObj} data
     */
    constructor(public readonly data: WhiteboardObj) {
        super();
        if (!Whiteboard.cache.has(data.id)) {
            Whiteboard.cache.set(data.id, this);
        }
    }




    /**
     * Destroys this object, including all event listeners and cache
     * @date 10/9/2023 - 6:58:43 PM
     *
     * @public
     */
    public destroy() {
        Whiteboard.cache.delete(this.data.id);
        super.destroy();
    }
}