import { Point, Point3D } from "../src/linear-algebra/point";
import { Spline } from "../src/linear-algebra/spline";
import { rotate3D, scale, translate } from "../src/linear-algebra/matrix-calculations";
import { Vector } from "../src/linear-algebra/vector";
import { colorFromPos, clear, colorToString, DrawEdgeOptions, drawEdge, drawPoint, drawSpline } from "../src/graphing";

const canvas = document.createElement('canvas');
canvas.height = window.innerHeight
canvas.width = window.innerWidth;

export const ctx = canvas.getContext('2d');

document.body.appendChild(canvas);

const cube3d: Point3D[] = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],

    [0, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 1, 1]
];


type Edge3D = [Point3D, Point3D];
type Edge = [Point, Point];


const transform = (point: Point): Point => {
    let [x, y, z] = point.array;
    [x, y, z] = rotate3D([x, y, z], [.5, .5, .5], [.5, .5, .5]);
    [x, y, z] = rotate3D([x, y, z], [.5, .5, .5], rotationMatrix);
    [x, y, z] = scale([x, y, z], [.5, .5, .5]);
    [x, y, z] = translate([x, y, z], [.5, .25, .25]);
    return new Point(...[x, y, z]);
};



// const points: Point[] = new Array(10).fill(null).map(Point.random);

const points: Point[] = [
    new Point(0, 0, 1),
    new Point(0, 1, 0),
    new Point(0, 1, 0),
    new Point(0, 1, 0),
    new Point(0, 1, 0),
    new Point(0, 1, 0),
    new Point(0, 1, 0),
    new Point(1, 0, 0),
    new Point(1, 0, 0),
    new Point(1, 0, 0),
    new Point(1, 0, 0),
    new Point(1, 0, 0),
    new Point(1, 0, 0),
    new Point(0.5, 0, 1),
    new Point(0.5, 0, 1),
    new Point(0.5, 0, 1),
    new Point(0.5, 0, 1),
    new Point(1, 1, 1)
]



const rotateAnimation: Point3D = [.003, .003, .003];
const rotationMatrix: Point3D = [0, 0, 0];


const animate = () => {
    rotationMatrix[0] += rotateAnimation[0];
    rotationMatrix[1] += rotateAnimation[1];
    rotationMatrix[2] += rotateAnimation[2];
};


export const drawCube = (ctx: CanvasRenderingContext2D, cube: Point3D[]) => {

    const drawEdgeOptions: DrawEdgeOptions = {
        transform,
        lineWidth: 2,
        gradient: true
    };


    const draw = (edge: Edge3D) => {
        const [p1, p2] = edge;
        drawEdge(ctx, [new Point(...p1), new Point(...p2)], drawEdgeOptions);
        // drawEdge(ctx, [new Point(...p1), new Point(...p2)]);
    }

    draw([cube[0], cube[1]]);
    draw([cube[1], cube[2]]);
    draw([cube[2], cube[3]]);
    draw([cube[3], cube[0]]);
    draw([cube[4], cube[5]]);
    draw([cube[5], cube[6]]);
    draw([cube[6], cube[7]]);
    draw([cube[7], cube[4]]);
    draw([cube[0], cube[4]]);
    draw([cube[1], cube[5]]);
    draw([cube[2], cube[6]]);
    draw([cube[3], cube[7]]);
    cube.forEach(point => {
        const p = new Point(...point);
        // drawPoint(ctx, p);
        drawPoint(ctx, p, {
            transform,
            width: 5,
            height: 5,
            round: true,
            strokeStyle: colorToString(colorFromPos(p)),
            fillStyle: colorToString(colorFromPos(p))
        });
    });




};


function draw() {
    if (!ctx) throw new Error('2d context not supported');
    clear(ctx);
    ctx.fillStyle = 'gray';
    ctx.fillRect(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
    );

    animate();

    drawCube(ctx, cube3d);
    drawSpline(ctx, new Spline(...points), 100, (p) => ({
        transform,
        width: 2,
        height: 2,
        fillStyle: colorToString(colorFromPos(p)),
        round: true,
        strokeStyle: 'transparent'
    }));

    // requestAnimationFrame(draw);
}

draw();