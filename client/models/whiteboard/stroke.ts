import { Point2D } from '../../../shared/submodules/calculations/src/linear-algebra/point';
import { Path } from '../canvas/path';

export class Stroke extends Path {
    constructor(points: Point2D[], color: string) {
        super(points);
        this.properties.line.color = color;
    }

    get color() {
        return this.properties.line.color as string;
    }

    set color(color: string) {
        this.properties.line.color = color;
    }

    clone() {
        return new Stroke(
            this.points.map(p => [p[0], p[1]]),
            this.color
        );
    }
}
