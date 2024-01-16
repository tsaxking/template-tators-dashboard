import { Point2D } from '../../../shared/submodules/calculations/src/linear-algebra/point';
import { Drawable } from './canvas';
import { ShapeProperties } from './shape-properties';

/**
 * A circle drawable
 * @date 1/9/2024 - 11:47:29 AM
 *
 * @export
 * @class Circle
 * @typedef {Circle}
 */
export class Circle implements Drawable {
    /**
     * Creates an instance of Circle.
     * @date 1/9/2024 - 11:47:29 AM
     *
     * @constructor
     * @param {Point2D} center [x, y] normalized coordinates
     * @param {number} radius normalized radius of the circle to the height of the canvas
     * @param {?ShapeProperties} [properties]
     */
    constructor(
        public center: Point2D,
        public radius: number,
        public properties?: ShapeProperties,
    ) {}

    /**
     * If the given point is inside the circle
     * @date 1/9/2024 - 11:47:29 AM
     *
     * @param {Point2D} point
     * @returns {boolean}
     */
    isIn(point: Point2D) {
        const [x, y] = point;
        return Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)) <
            this.radius;
    }

    /**
     * Draw the circle
     * @date 1/9/2024 - 11:47:29 AM
     *
     * @param {CanvasRenderingContext2D} context
     */
    draw(context: CanvasRenderingContext2D) {
        context.save();
        context.beginPath();
        if (this.properties?.line?.color) {
            context.strokeStyle = this.properties.line.color;
        }
        if (this.properties?.line?.width) {
            context.lineWidth = this.properties.line.width;
        }
        if (this.properties?.fill?.color) {
            context.fillStyle = this.properties.fill.color;
        }
        context.arc(
            this.x * context.canvas.width,
            this.y * context.canvas.height,
            this.radius * context.canvas.height,
            0,
            2 * Math.PI,
        );
        if (this.properties?.fill) context.fill();
        context.stroke();
        context.restore();
    }

    /**
     * Returns the x coordinate of the center
     * @date 1/9/2024 - 11:47:29 AM
     *
     * @readonly
     * @type {Point2D}
     */
    get x() {
        return this.center[0];
    }

    /**
     * Returns the x coordinate of the center
     */
    set x(x: number) {
        this.center[0] = x;
    }

    /**
     * Returns the y coordinate of the center
     * @date 1/9/2024 - 11:47:29 AM
     *
     * @readonly
     * @type {Point2D}
     */
    get y() {
        return this.center[1];
    }

    /**
     * Returns the y coordinate of the center
     */
    set y(y: number) {
        this.center[1] = y;
    }
}
