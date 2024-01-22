import { Point2D } from '../../../shared/submodules/calculations/src/linear-algebra/point';
import { Drawable } from './canvas';
import { Polygon } from './polygon';

/**
 * A polygon that the robot cannot enter (shades on the outside)
 * @date 1/9/2024 - 11:13:09 AM
 *
 * @export
 * @class BorderPolygon
 * @typedef {BorderPolygon}
 * @extends {Polygon}
 */
export class BorderPolygon extends Polygon implements Drawable<BorderPolygon> {
    /**
     * Determines if the given point is inside the polygon
     * @date 1/9/2024 - 11:13:09 AM
     *
     * @param {Point2D} point
     * @returns {boolean}
     */
    isIn(point: Point2D) {
        return !super.isIn(point);
    }

    /**
     * Draw the border, use evenodd fill rule (shades on the outside)
     * @date 1/9/2024 - 11:39:15 AM
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        const region = new Path2D();

        region.moveTo(
            this.points[0][0] * ctx.canvas.width,
            this.points[0][1] * ctx.canvas.height,
        );

        for (let i = 1; i < this.points.length; i++) {
            region.lineTo(
                this.points[i][0] * ctx.canvas.width,
                this.points[i][1] * ctx.canvas.height,
            );
        }
        region.closePath();

        region.moveTo(0, 0);
        region.lineTo(ctx.canvas.width, 0);
        region.lineTo(ctx.canvas.width, ctx.canvas.height);
        region.lineTo(0, ctx.canvas.height);
        region.closePath();

        // fill the area between the polygon and the canvas edges
        if (this.properties?.fill?.color) {
            ctx.fillStyle = this.properties.fill.color;
        }
        if (this.properties?.fill) ctx.fill(region, 'evenodd');
        ctx.restore();
    }
}
