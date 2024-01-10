import { Point, Point3D, Point2D } from "./point";
import { Vector } from "./vector";
import { Plane } from "./plane";

type Matrix = number[][];
type SpatialMatrix = [
    Point3D,
    Point3D,
    Point3D
]

export function multiplyMatricies(a: Matrix, b: Matrix) {
    // ensure that the matricies are compatible
    if (a[0].length !== b.length) {
        throw new Error('Matricies are not compatible, ' + 'A: ' + a.length + 'x' + a[0].length + ' B: ' + b.length + 'x' + b[0].length + '');
    }


    // create the new matrix
    const c: number[][] = [];

    // for each row in a
    for (let i = 0; i < a.length; i++) {
        // create a new row
        c[i] = [];

        // for each column in b
        for (let j = 0; j < b[0].length; j++) {
            // create a new column
            c[i][j] = 0;

            // for each element in the column
            for (let k = 0; k < b.length; k++) {
                // add the product of the elements
                c[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    return c;
}

export function transform(point: Point3D, matrix: SpatialMatrix): Point3D {
    const [x, y, z] = point;
    const [[a], [b], [c]] = multiplyMatricies(matrix, [[x], [y], [z]]);
    return [a, b, c];
}

export function translate([x, y, z]: Point3D, [dx, dy, dz]: Point3D): Point3D {
    return [x + dx, y + dy, z + dz];
}

export function scale([x, y, z]: Point3D, [dx, dy, dz]: Point3D): Point3D {
    return [x * dx, y * dy, z * dz];
}

export function rotate2D([x, y]: Point2D, r: number): Point2D {
    return [
        x * Math.cos(r) - y * Math.sin(r),
        x * Math.sin(r) + y * Math.cos(r)
    ];
}

export function rotate3D(point: Point3D, about: Point3D, angle: Point3D): Point3D {
    let [x, y, z] = point;
    const [ax, ay, az] = about;
    const [rx, ry, rz] = angle;

    [x, y, z] = translate([x, y, z], [-ax, -ay, -az]);

    [y, z] = rotate2D([y, z], rx);
    [x, z] = rotate2D([x, z], ry);
    [x, y] = rotate2D([x, y], rz);
    [x, y, z] = translate([x, y, z], [ax, ay, az]);

    return [x, y, z];
}

export function perspective(point: Point3D, cameraDistance: number, viewPlane: Vector, viewAngle: number): Point2D | undefined {
    const cameraPoint = new Point(0, 0, -1 * cameraDistance);
    const cameraVector = new Vector(cameraPoint, new Point(...point));

    if (cameraVector.angle(viewPlane) > viewAngle / 2) return;

    const result = viewPlane.plane.intersect(cameraVector)?.array;
    if (!result) return;
    const [x, y] = result;
    return [x, y];
}