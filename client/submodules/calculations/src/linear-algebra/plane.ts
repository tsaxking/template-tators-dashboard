import { Point } from "./point";
import { Vector } from "./vector";

export class Plane {
    static from(p1: Point, p2: Point, p3: Point): Plane {
        const v1 = new Vector(p1, p2);
        const v2 = new Vector(p1, p3);
        const normal = v1.cross(v2);
        return new Plane(normal);
    }

    constructor(public normal: Vector) {}

    intersect(v: Vector): Point | null {
        const t = (this.normal.dot(new Vector(this.normal.point, v.point))) / this.normal.dot(v);
        if (t < 0) return null;
        const x = v.ft('x')(t);
        const y = v.ft('y')(t);
        const z = v.ft('z')(t);
        return x === v.rate.x && y === v.rate.y && z === v.rate.z ? new Point(x, y, z) : null;
    }
}