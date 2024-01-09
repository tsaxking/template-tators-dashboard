export type Point2D = [number, number];
export type Point3D = [number, number, number];


export class Point {
    static random() {
        return new Point(Math.random(), Math.random(), Math.random());
    }

    constructor(public x: number, public y: number, public z: number = 0) {}

    get array(): Point3D {
        return [this.x, this.y, this.z];
    }

    add(point: Point): Point {
        return new Point(this.x + point.x, this.y + point.y, this.z + point.z);
    }

    scale(scale: number): Point {
        return new Point(this.x * scale, this.y * scale, this.z * scale);
    }

    distance(point: Point): number {
        return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2) + Math.pow(this.z - point.z, 2));
    }

    interpolate(point: Point, ratio: number): Point {
        // return a point that is ratio% between this point and the given point
        return new Point(
            this.x + (point.x - this.x) * ratio,
            this.y + (point.y - this.y) * ratio,
            this.z + (point.z - this.z) * ratio
        );
    }
}