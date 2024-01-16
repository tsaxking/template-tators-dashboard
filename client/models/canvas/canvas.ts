// type Events =
//     'click' |
//     'mousedown' |
//     'mouseup' |
//     'mousemove' |
//     'mouseleave' |
//     'touchstart' |
//     'touchend' |
//     'touchmove' |
//     'touchcancel';
import { EventEmitter } from '../../../shared/event-emitter';
import { Point2D } from '../../../shared/submodules/calculations/src/linear-algebra/point';
import { attempt } from '../../../shared/attempt';
import { ShapeProperties } from './shape-properties';
import { CanvasImageProperties } from './image';
import { sleep } from '../../../shared/sleep';

/**
 * Similar to mouse events, but with a point
 * @date 1/9/2024 - 11:39:34 AM
 *
 * @export
 * @class CanvasEvent
 * @typedef {CanvasEvent}
 * @template T (MouseEvent | TouchEvent)
 */
export class CanvasEvent<T> {
    /**
     * Time of the event
     * @date 1/9/2024 - 11:40:14 AM
     *
     * @public
     * @readonly
     * @type {Date}
     */
    public readonly time: Date = new Date();

    /**
     * Creates an instance of CanvasEvent.
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @constructor
     * @param {keyof Events} event
     * @param {Point2D} point
     * @param {T} data
     */
    constructor(
        public readonly event: keyof Events,
        public readonly point: Point2D,
        public readonly data: T,
    ) {}
}

/**
 * All events for the canvas
 * @date 1/9/2024 - 11:39:34 AM
 *
 * @typedef {Events}
 */
type Events = {
    click: CanvasEvent<MouseEvent | TouchEvent>;
};

/**
 * An interface for all drawable objects
 * @date 1/9/2024 - 11:39:34 AM
 *
 * @export
 * @interface Drawable
 * @typedef {Drawable}
 */
export interface Drawable<T = unknown> {
    /**
     * The draw function
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx: CanvasRenderingContext2D): void;

    /**
     * Event emitter for the drawable, if it has one
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @readonly
     * @type {?EventEmitter<keyof Events>}
     */
    readonly $emitter?: EventEmitter<keyof Events>;

    /**
     * Determines if the given point is inside the drawable
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @param {Point2D} point
     * @returns {boolean}
     */
    isIn?(point: Point2D): boolean;

    /**
     * Emits an event
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @template {keyof Events} K
     * @param {K} event
     * @param {Events[K]} data
     */
    emit?<K extends keyof Events>(event: K, data: Events[K]): void;
    /**
     * Adds an event listener
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @template {keyof Events} K
     * @param {K} event
     * @param {(e: Events[K]) => void} cb
     */
    on?<K extends keyof Events>(event: K, cb: (e: Events[K]) => void): void;
    /**
     * Removes an event listener
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @template {keyof Events} K
     * @param {K} event
     * @param {(e: Events[K]) => void} cb
     */
    off?<K extends keyof Events>(event: K, cb: (e: Events[K]) => void): void;

    properties?: ShapeProperties<T>;
}

/**
 * The canvas class, this contains elements that can be drawn (drawables), event emitters, and more
 * All points used should be normalized (between 0 and 1)
 * @date 1/9/2024 - 11:39:34 AM
 *
 * @export
 * @class Canvas
 * @typedef {Canvas}
 */
export class Canvas {
    /**
     * All drawables on the canvas
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @public
     * @readonly
     * @type {Drawable[]}
     */
    public readonly drawables: Drawable[] = [];
    /**
     * Event emitter for the canvas
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @public
     * @readonly
     * @type {*}
     */
    public readonly $emitter = new EventEmitter<keyof Events>();
    /**
     * Determines if the canvas is animating
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @private
     * @type {boolean}
     */
    private animating = false;

    // TODO: Implement FPS
    public fps = 30;

    constructor(public readonly ctx: CanvasRenderingContext2D) {
        ctx.canvas.addEventListener('click', (e) => {
            this.$emitter.emit('click', e);
            const [p] = this.getXY(e);

            for (const el of this.drawables) {
                if (el.$emitter && el.isIn?.(p)) {
                    el.emit?.('click', new CanvasEvent('click', p, e));
                }
            }
        });
    }

    get width() {
        return this.ctx.canvas.width;
    }

    /**
     * Sets the width of the canvas
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @type {number}
     */
    set width(width: number) {
        this.ctx.canvas.width = width;
    }

    /**
     * Height of the canvas
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @type {number}
     */
    get height() {
        return this.ctx.canvas.height;
    }

    /**
     * Sets the height of the canvas
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @type {number}
     */
    set height(height: number) {
        this.ctx.canvas.height = height;
    }

    /**
     * Image data of the canvas
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @type {ImageData}
     */
    get imageData() {
        return this.ctx.getImageData(0, 0, this.width, this.height);
    }

    /**
     * Sets the image data of the canvas
     * This will clear the canvas, and stop animating
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @type {ImageData}
     */
    set imageData(imageData: ImageData) {
        this.animating = false;
        this.clear();
        this.ctx.putImageData(imageData, 0, 0);
    }

    /**
     * Adds drawables to the canvas
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @param {...Drawable[]} drawables
     */
    add(...drawables: Drawable<any>[]) {
        this.drawables.push(...drawables);
    }

    /**
     * Removes drawables from the canvas
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @param {...Drawable[]} drawables
     */
    remove(...drawables: Drawable<any>[]) {
        for (const drawable of drawables) {
            const index = this.drawables.indexOf(drawable);
            if (index !== -1) this.drawables.splice(index, 1);
        }
    }

    /**
     * Clears the canvas
     * @date 1/9/2024 - 11:39:34 AM
     */
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Iterates through all drawables and calls their draw function
     * @date 1/9/2024 - 11:39:34 AM
     */
    draw() {
        for (const element of this.drawables) {
            if (element.properties?.drawCondition?.(element) === false) {
                continue;
            }

            this.ctx.save();
            attempt(() => element.draw(this.ctx));
            this.ctx.restore();
        }
    }

    /**
     * Animates the canvas (calls draw() every frame)
     * To change the animation, change the elements array outside of this class
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @param {(canvas: this) => void} [update] - The update function, called every frame (optional)
     */
    animate(update?: (canvas: this) => void): () => void {
        const stop = () => (this.animating = false);
        if (this.animating) return stop;

        this.animating = true;
        const loop = async () => {
            if (!this.animating) return;
            this.clear();
            this.draw();
            // update?.(this);
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
        return stop;
    }

    /**
     * Clears the canvas, stops animation, and removes all drawables
     * @date 1/9/2024 - 11:39:34 AM
     */
    destroy() {
        this.clear();
        this.animating = false;
        this.drawables.length = 0;
    }

    /**
     * Gets the x and y coordinates of the event
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @param {(MouseEvent | TouchEvent)} e
     * @returns {Point2D[]}
     */
    getXY(e: MouseEvent | TouchEvent): Point2D[] {
        const rect = this.ctx.canvas.getBoundingClientRect();

        const makePoint = (x: number, y: number): [number, number] => {
            return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
        };

        if (e instanceof MouseEvent) {
            return [makePoint(e.clientX, e.clientY)];
        } else {
            return Array.from(e.touches).map((
                touch,
            ) => makePoint(touch.clientX, touch.clientY));
        }
    }

    /**
     * Adds an event listener
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @template {keyof Events} K
     * @param {K} event
     * @param {(e: Events[K]) => void} cb
     * @returns {void) => void}
     */
    on<K extends keyof Events>(event: K, cb: (e: Events[K]) => void) {
        this.$emitter.on(event, cb);
    }

    /**
     * Removes an event listener
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @template {keyof Events} K
     * @param {K} event
     * @param {(e: Events[K]) => void} cb
     * @returns {void) => void}
     */
    off<K extends keyof Events>(event: K, cb: (e: Events[K]) => void) {
        this.$emitter.off(event, cb);
    }

    /**
     * Emits an event
     * @date 1/9/2024 - 11:39:34 AM
     *
     * @template {keyof Events} K
     * @param {K} event
     * @param {Events[K]} data
     */
    emit<K extends keyof Events>(event: K, data: Events[K]) {
        this.$emitter.emit(event, data);
    }
}
