import { Whiteboard as WhiteboardObj } from '../../../shared/db-types-extended';
import { Cache } from '../cache';
import { Whiteboard as WB, WhiteboardState } from '../whiteboard/whiteboard';
import { socket } from '../../utilities/socket';
import { EventEmitter } from '../../../shared/event-emitter';

/**
 * Events that are emitted by a {@link FIRSTWhiteboard} object
 * @date 10/9/2023 - 6:58:43 PM
 *
 * @typedef {WhiteboardUpdateData}
 */
type WhiteboardUpdateData = {
    update: WhiteboardState[];
};

type Updates = {
    select: FIRSTWhiteboard;
};

/**
 * Represents a FIRST whiteboard
 * @date 10/9/2023 - 6:58:43 PM
 *
 * @export
 * @class Whiteboard
 * @typedef {FIRSTWhiteboard}
 * @implements {FIRST}
 */
export class FIRSTWhiteboard extends Cache<WhiteboardUpdateData> {
    private static readonly $emitter: EventEmitter<keyof Updates> =
        new EventEmitter<keyof Updates>();

    public static on<K extends keyof Updates>(
        event: K,
        callback: (data: any) => void
    ): void {
        FIRSTWhiteboard.$emitter.on(event, callback);
    }

    public static off<K extends keyof Updates>(
        event: K,
        callback?: (data: any) => void
    ): void {
        FIRSTWhiteboard.$emitter.off(event, callback);
    }

    public static emit<K extends keyof Updates>(event: K, data: any): void {
        FIRSTWhiteboard.$emitter.emit(event, data);
    }

    public static retrieve(data: WhiteboardObj, ctx: CanvasRenderingContext2D) {
        if (FIRSTWhiteboard.cache.has(data.id))
            return FIRSTWhiteboard.cache.get(data.id) as FIRSTWhiteboard;
        return new FIRSTWhiteboard(data, ctx);
    }

    public static current?: FIRSTWhiteboard = undefined;

    /**
     * Cache for all {@link FIRSTWhiteboard} objects
     * @date 10/9/2023 - 6:58:43 PM
     *
     * @public
     * @static
     * @readonly
     * @type {Map<string, FIRSTWhiteboard>}
     */
    public static readonly cache: Map<string, FIRSTWhiteboard> = new Map<
        string,
        FIRSTWhiteboard
    >();

    public readonly board: WB;

    /**
     * Creates an instance of Whiteboard.
     * @date 10/9/2023 - 6:58:43 PM
     *
     * @constructor
     * @param {WhiteboardObj} data
     */
    constructor(
        public readonly data: WhiteboardObj,
        public readonly ctx: CanvasRenderingContext2D
    ) {
        super();
        if (!FIRSTWhiteboard.cache.has(data.id)) {
            FIRSTWhiteboard.cache.set(data.id, this);
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
        FIRSTWhiteboard.cache.delete(this.data.id);
        super.destroy();
    }

    public select(): void {
        FIRSTWhiteboard.current = this;
        FIRSTWhiteboard.emit('select', this);
    }
}

socket.on('whiteboard:update', (data: WhiteboardObj) => {});

socket.on('whiteboard:created', (data: WhiteboardObj) => {});

socket.on('whiteboard:deleted', (id: string) => {});
