import { Action, Action2024, P, Trace as T } from '../../shared/submodules/tatorscout-calculations/trace';
import { Color } from '../submodules/colors/color';
import { Circle } from './canvas/circle';
import { Spline } from '../../shared/submodules/calculations/src/linear-algebra/spline';
import { Point, Point2D } from '../../shared/submodules/calculations/src/linear-algebra/point';
import { Drawable } from './canvas/canvas';
import { Path } from './canvas/path'


type TraceProperties<action = Action> = {
    actions: action[]
    drawTrace: boolean
}


export class Trace<action = Action> implements Drawable<Trace> {
    public $actions: Circle[] = [];
    public $path: Path
    public $points: P[]
    public $from: number = 0
    public $to: number = 600

    constructor(points: P[], public readonly options: Partial<TraceProperties<action>>) {
        this.points = points
    }
    
    public get points() {
        return this.$points;
    }

    public get to() {
        return this.$to;
    }

    public set to(to: number) {
        this.$to = to;
        this.points = this.$points.filter(T.filterIndex(this.$from, this.$to));
    }

    public get from() {
        return this.$from
    }

    public set from(from: number) {
        this.$from = from;
        this.points = this.$points.filter(T.filterIndex(this.$from, this.$to));
    }

    public set points(points: P[]) {
        this.$points = points;
        this.$path.points.length = 0
        this.$path.add(...points.map(p => [p[1], p[2]]) as Point2D[]);
        if (this.options.actions) {
            for (const a of this.options.actions) {
                const points = this.$points.filter(T.filterAction<action>(a));

                this.$actions = points.map(p => new Circle([p[1], p[2]], .05));
            }
        }
    }

    getHeatmap(): Heatmap {
        return new Heatmap(this.points.filter(Array.isArray) as P[]);
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.options.drawTrace) {
            this.$path.draw(ctx);
        }

        for (const a of this.$actions) {
            a.draw(ctx);
        }
    }
    //Takes array of points, filters for what you want it to, maps it
}








export class Heatmap {
    public static get spline() {
        return new Spline(
            ...[
                Color.fromName('blue'),
                Color.fromName('green'),
                Color.fromName('red'),
                Color.fromName('purple'),
                Color.fromName('white'),
            ].map((c) => {
                return new Point(
                    ...(c.rgb.values.slice(0, 3).map((v) => v / 255) as [
                        number,
                        number,
                        number,
                    ]),
                );
            }),
        );
    }

    public readonly map: number[][];

    constructor(points: P[] = []) {
        this.map = new Array(100).fill(0).map(() => new Array(50).fill(0));

        const circlePoints: [number, number][] = [];

        for (let x = -5; x <= 5; x++) {
            for (let y = -5; y <= 5; y++) {
                if (Math.sqrt(x * x + y * y) <= 5) {
                    circlePoints.push([x, y]);
                }
            }
        }

        points.forEach(([x, y]) => {
            for (const [dx, dy] of circlePoints) {
                // add 1/distance to the heatmap point
                const distance = Math.sqrt(dx * dx + dy * dy);
                this.map[Math.floor(x + dx)][Math.floor(y + dy)] += Math.floor(
                    (1 / distance) * 5,
                ); // normalize to 0-5
            }
        });
    }

    draw(
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        fieldImage: string,
    ) {
        ctx.canvas.height = height;
        ctx.canvas.width = width;

        const drawHeatmap = () => {
            const max = Math.max(...this.map.map((row) => Math.max(...row)));
            const min = Math.min(...this.map.map((row) => Math.min(...row)));

            const scale = 1 / (max - min);

            for (const y in this.map) {
                for (const x in this.map[y]) {
                    const p = this.map[x][y];

                    ctx.fillStyle = new Color(
                        ...(Heatmap.spline
                            .ft(p * scale)
                            .array.map((v) => v * 255) as [
                                number,
                                number,
                                number,
                            ]),
                        1,
                    ).toString('rgba');

                    ctx.fillRect(
                        +x * (width / this.map.length),
                        +y * (height / this.map[0].length),
                        width / this.map.length,
                        height / this.map[0].length,
                    );
                }
            }
        };

        const img = new Image();
        img.src = fieldImage;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, width, height);
            drawHeatmap();
        };
    }
}
