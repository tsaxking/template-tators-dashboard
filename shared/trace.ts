export type Actions = 'spk' | 'amp' | 'src' | 'trp' | 'clb';
type P = [number, number, number, Actions | undefined];
type TraceArray = P[];


/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:27 AM
 *
 * @type {("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:\"<>?`~[]';./=\\,")}
 */
const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:"<>?`~[]\';./=\\,';

export class Trace {
    // static encode(trace: TraceArray) {
    //     return trace.map(Trace.compress);
    // }
    // static decode(trace: TraceArray) {
    //     return trace.map(Trace.decompress);
    // }

    // static compress(point: P): string {
    //     const [i, x, y, a] = point;
    //     // compress the point to a smaller string



    // }

    // static decompress(str: string) {}

    constructor(public readonly trace: TraceArray) {}



    velocityMap() {
        return this.trace.map((p1, i, a) => {
            if (i === a.length - 1) return null;

            const [,x1,y1] = p1;
            const [,x2,y2] = a[i + 1];

            const dx = x2 - x1;
            const dy = y2 - y1;
            
            const distance = Math.sqrt(dx * dx + dy * dy);

            return distance / .25;
        }).filter((p) => p !== null);
    }

    velocityHistogram() {
        const map = this.velocityMap();

        const max = Math.max(...map);
        const min = Math.min(...map);

        const range = max - min;

        const buckets = new Array(10).fill(0);

        map.forEach((v) => {
            const bucket = Math.floor(((v - min) / range) * 10);
            buckets[bucket]++;
        });

        return buckets;
    }
};