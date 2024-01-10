import { Point } from "./point";
import { Vector } from "./vector";

export class Spline {
    public points: Point[];

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
}