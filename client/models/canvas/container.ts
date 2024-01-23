import { Drawable } from "./canvas";



export class Container implements Drawable {
    private $elements: (Drawable | null)[] = [];
    private $filtered: Drawable[] = [];

    constructor(...elements: (Drawable | null)[]) {
        this.elements = elements;
    }

    public set elements(value: (Drawable | null)[]) {
        this.$elements = value;
        this.$filtered = value.filter((e): e is Drawable => e !== null);
    }

    public get elements(): (Drawable | null)[] {
        return this.$elements;
    }

    filter(fn: (element: Drawable | null, i: number, arr: (Drawable | null)[]) => boolean): void {
        this.$filtered = this.$elements.filter(fn).filter((e): e is Drawable => e !== null);
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