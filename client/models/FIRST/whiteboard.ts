import { Whiteboard as WhiteboardObj } from "../../../shared/db-types-extended";
import { Cache } from "../cache";
import { Whiteboard as WB, WhiteboardState } from "../whiteboard/whiteboard";

/**
 * Events that are emitted by a {@link WhiteboardCache} object
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
 * @typedef {WhiteboardCache}
 * @implements {FIRST}
 */
export class WhiteboardCache extends Cache<WhiteboardUpdateData> {
    public static current?: WhiteboardCache = undefined;


    /**
     * Cache for all {@link WhiteboardCache} objects
     * @date 10/9/2023 - 6:58:43 PM
     *
     * @public
     * @static
     * @readonly
     * @type {Map<string, WhiteboardCache>}
     */
    public static readonly cache: Map<string, WhiteboardCache> = new Map<string, WhiteboardCache>();






    public readonly board: WB;


    /**
     * Creates an instance of Whiteboard.
     * @date 10/9/2023 - 6:58:43 PM
     *
     * @constructor
     * @param {WhiteboardObj} data
     */
    constructor(public readonly data: WhiteboardObj, ctx: CanvasRenderingContext2D) {
        super();
        if (!WhiteboardCache.cache.has(data.id)) {
            WhiteboardCache.cache.set(data.id, this);
        }

        const b = JSON.parse(data.board) as WhiteboardState[];
        this.board = WB.build(b, ctx);
    }




    /**
     * Destroys this object, including all event listeners and cache
     * @date 10/9/2023 - 6:58:43 PM
     *
     * @public
     */
    public destroy() {
        WhiteboardCache.cache.delete(this.data.id);
        super.destroy();
    }


    public select(): void {
        WhiteboardCache.current = this;
        WhiteboardCache.emit('select', this);
    }
}