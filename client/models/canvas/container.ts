import { Drawable } from './canvas';

export class Container implements Drawable {
    private $elements: Drawable[] = [];
    private $filtered: Drawable[] = [];

    constructor(...elements: Drawable[]) {
        this.elements = elements;
    }

    public set elements(value: Drawable[]) {
        this.$elements = value;
        this.$filtered = value;
    }

    public get elements(): Drawable[] {
        return this.$elements;
    }

    filter(fn: (element: Drawable) => boolean): void {
        this.$filtered = this.$elements.filter(fn);
    }

    sort(fn: (a: Drawable, b: Drawable) => number): void {
        this.$filtered.sort(fn);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        for (const e of this.$filtered) {
            e.draw(ctx);
        }
    }
}
