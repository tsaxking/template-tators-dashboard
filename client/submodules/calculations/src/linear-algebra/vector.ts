import { Plane } from "./plane";
import { Point } from "./point";

export type Vector3D = [number, number, number];

export class Vector {
    constructor(public point: Point, public rate: Point) {}


    get magnitude(): number {
        return new Point(0, 0, 0).distance(this.rate);
    }

    /**
     * Returns a function of t that returns the position of the vector at time t
     * @param param 
     * @returns 
     */
    ft(param: 'x' | 'y' | 'z'): (t: number) => number {
        return (t: number) => this.point[param] + this.rate[param] * t;
    };

    /**
     * Magnitude of the vector projection of this vector onto v
     * @param v
     * @returns 
     */
    dot(v: Vector) {
        return this.rate.x * v.rate.x + this.rate.y * v.rate.y + this.rate.z * v.rate.z;
    };

    /**
     * Returns the angle between the two vectors in radians
     */
    angle(v: Vector) {
        return Math.acos(this.dot(v) / (this.magnitude * v.magnitude));
    }

    /**
     * Area/Volume of the parallelogram formed by the two vectors
     * Vector is perpendicular to the plane formed by the two vectors
     * The return vector starts at the origin
     * @param v 
     */
    cross(v: Vector): Vector {
        return new Vector(
            new Point(0, 0, 0),
            new Point(
                this.rate.y * v.rate.z - this.rate.z * v.rate.y,
                this.rate.z * v.rate.x - this.rate.x * v.rate.z,
                this.rate.x * v.rate.y - this.rate.y * v.rate.x
            )
        );
    }

    /**
     * Moves the vector to the given point (mutates "this" vector) and returns it
     * @param point 
     * @returns 
     */
    move(point: Point): this {
        this.point = point;
        return this;
    }


    /**
     * Returns the determinant of the two vectors (area/volume of the parallelogram formed by the two vectors)
     * @param v 
     * @returns 
     */
    determinant(v: Vector): number {
        return this.cross(v).magnitude;
    }



    /**
     * Scales the vector by the given magnitude (mutates "this" vector) and returns it
     * @param magnitude 
     * @returns 
     */
    scale(magnitude: number): this {
        this.rate = this.rate.scale(magnitude);
        return this;
    }

    /**
     * Adds the given vector to "this" vector (mutates "this" vector) and returns it
     * @param v 
     * @returns 
     */
    add(v: Vector): this {
        this.rate = this.rate.add(v.rate);
        return this;
    }

    get plane(): Plane {
        return new Plane(this);
    }

    get end() {
        return this.point.add(this.rate);
    }
}