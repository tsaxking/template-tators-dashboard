import { Trace as T } from '../../shared/trace';
import { Action, Point as P } from '../../shared/trace';
import { Color } from '../submodules/colors/color';
import { Spline } from '../submodules/calculations/src/linear-algebra/spline';
import { Point } from '../submodules/calculations/src/linear-algebra/point';

export class Trace {
    constructor(public readonly points: T) {}

    getHeatmap(): Heatmap {
        return new Heatmap(this.points.filter(Array.isArray) as P[]);
    }
}

export class Heatmap {
    public static get spline() {
        return new Spline(...[
            Color.fromName('blue'),
            Color.fromName('green'),
            Color.fromName('red'),
            Color.fromName('purple'),
            Color.fromName('white'),
        ].map((c) => {
            return new Point(
                ...c.rgb.values.slice(0, 3).map((v) => v / 255) as [
                    number,
                    number,
                    number,
                ],
            );
        }));
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
                        ...Heatmap.spline
                            .ft(p * scale).array
                            .map((v) => v * 255) as [number, number, number],
                        1,
                    )
                        .toString('rgba');

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
