import { Point } from './point';
import { Vector } from './vector';

// TODO: Add magnitude

/**
 * A curve defined by a series of points
 * @date 1/10/2024 - 2:41:33 PM
 *
 * @export
 * @class Spline
 * @typedef {Spline}
 */
export class Spline {
    /**
     * An array of points defining the spline
     * @date 1/10/2024 - 2:41:33 PM
     *
     * @public
     * @type {Point[]}
     */
    public points: Point[];

    /**
     * Creates an instance of Spline.
     * @date 1/10/2024 - 2:41:33 PM
     *
     * @constructor
     * @param {...Point[]} points
     */
    constructor(...points: Point[]) {
        this.points = points;
    }

    /**
     * Returns the point on the spline at t
     * @param t (between 0 and 1)
     * @returns
     */
    ft(t: number): Point {
        let points: Point[] = this.points.slice();

        const createBezier = (points: Point[], factor: number): Point[] => {
            return new Array(points.length - 1).fill(null).map((_, i) => {
                const p1 = points[i];
                const p2 = points[i + 1];
                const end = p1.interpolate(p2, factor);
                return end;
            });
        };

        while (points.length > 1) {
            points = createBezier(points, t);
        }

        return points[0];
    }

    generatePoints(count: number): Point[] {
        return new Array(count).fill(null).map((_, i) => {
            return this.ft(i / count);
        });
    }
}
