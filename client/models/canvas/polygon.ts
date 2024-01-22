import { Point2D } from '../../../shared/submodules/calculations/src/linear-algebra/point';
import { Drawable } from './canvas';
import { ShapeProperties } from './shape-properties';

/**
 * A polygon drawable
 * @date 1/9/2024 - 11:57:35 AM
 *
 * @export
 * @class Polygon
 * @typedef {Polygon}
 */
export class Polygon implements Drawable<Polygon> {
    /**
     * Creates an instance of Polygon.
     * @date 1/9/2024 - 11:57:35 AM
     *
     * @constructor
     * @param {Point2D[]} points
     * @param {?ShapeProperties} [properties]
     */
    constructor(
        public points: Point2D[],
        public properties?: ShapeProperties<Polygon>,
    ) {}

    /**
     * If the given point is inside the polygon (uses ray casting algorithm)
     * @date 1/9/2024 - 11:57:35 AM
     *
     * @param {Point2D} point
     * @returns {boolean}
     */
    isIn(point: Point2D) {
        const [x, y] = point;
        let inside = false;
        for (
            let i = 0, j = this.points.length - 1;
            i < this.points.length;
            j = i++
        ) {
            const xi = this.points[i][0],
                yi = this.points[i][1];
            const xj = this.points[j][0],
                yj = this.points[j][1];

            const intersect = yi > y !== yj > y &&
                x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) inside = !inside;
        }

        return inside;
    }

    /**
     * Draw the polygon
     * @date 1/9/2024 - 11:57:35 AM
     *
     * @param {CanvasRenderingContext2D} context
     */
    draw(context: CanvasRenderingContext2D) {
        context.save();
        context.beginPath();
        const x0 = this.points[0][0] * context.canvas.width;
        const y0 = this.points[0][1] * context.canvas.height;
        context.moveTo(x0, y0);

        for (let i = 1; i < this.points.length; i++) {
            context.lineTo(
                this.points[i][0] * context.canvas.width,
                this.points[i][1] * context.canvas.height,
            );
        }
        context.closePath();

        if (this.properties?.line?.color) {
            context.strokeStyle = this.properties.line.color;
        }
        if (this.properties?.line?.width) {
            context.lineWidth = this.properties.line.width;
        }

        if (this.properties?.line) context.stroke();

        if (this.properties?.fill?.color) {
            context.fillStyle = this.properties.fill.color;
        }
        if (this.properties?.fill) context.fill();

        context.restore();
    }
}
