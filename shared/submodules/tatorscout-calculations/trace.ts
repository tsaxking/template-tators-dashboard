import { all as all2024, zones as zones2024 } from './2024-areas';
import { all as all2025, zones as zones2025 } from './2025-areas';
import { isInside } from '../calculations/src/polygon';
import { Point2D } from '../calculations/src/linear-algebra/point';
import { $Math } from '../../math';

/**
 * Description placeholder
 * @date 1/8/2025 - 7:24:32 PM
 *
 * @export
 * @typedef {Action2025}
 */
export type Action2025 =
    | 'cl1'
    | 'cl2'
    | 'cl3'
    | 'cl4'
    | 'prc'
    | 'brg'
    | 'dpc'
    | 'shc';
/**
 * Description placeholder
 * @date 1/25/2024 - 4:58:49 PM
 *
 * @export
 * @typedef {Action2024}
 */
export type Action2024 = 'spk' | 'amp' | 'src' | 'trp' | 'clb' | 'nte' | 'lob';
/**
 * Description placeholder
 * @date 1/25/2024 - 4:58:49 PM
 *
 * @export
 * @typedef {Action2023}
 */
export type Action2023 = 'cne' | 'cbe' | 'bal' | 'pck';

export type Zones2025 =
    | 'blue-auto'
    | 'blue-barge'
    | 'blue-reef'
    | 'blue-prc'
    | 'blue-zone'
    | 'red-auto'
    | 'red-barge'
    | 'red-reef'
    | 'red-prc'
    | 'red-zone'
    | 'sta1'
    | 'sta2'
    | 'sta3'
    | 'sta4';

export type Zones2024 =
    | 'blue-auto'
    | 'blue-stage'
    | 'blue-amp'
    | 'blue-src'
    | 'blue-zone'
    | 'red-auto'
    | 'red-stage'
    | 'red-amp'
    | 'red-src'
    | 'red-zone';

export const actions = {
    cl1: 'coralL1',
    cl2: 'coralL2',
    cl3: 'coralL3',
    cl4: 'coralL4',
    prc: 'processor',
    brg: 'barge',
    dpc: 'deepclimb',
    shc: 'shallowclimb',
    spk: 'speaker',
    amp: 'amp',
    src: 'source',
    trp: 'trap',
    clb: 'climb',
    lob: 'lob',
    cne: 'cone',
    cbe: 'cube',
    bal: 'balance',
    pck: 'pick',
    nte: 'nte'
};

export type TraceParse2025 = {
    mobility: boolean;
    parked: boolean;
    groundPicks: boolean;
};

export type TraceParse2024 = {
    mobility: boolean;
    parked: boolean;
    groundPicks: boolean;
};

/**
 * Description placeholder
 * @date 1/25/2024 - 4:58:49 PM
 *
 * @export
 * @typedef {Action}
 */
export type Action = Action2025 | Action2024 | Action2023;

export type Zones = Zones2025 | Zones2024;

export type TraceParse = TraceParse2025 | TraceParse2024;

/**
 * Description placeholder
 * @date 1/25/2024 - 4:58:49 PM
 *
 * @export
 * @typedef {P}
 */
export type P = [number, number, number, Action | 0];
/**
 * Description placeholder
 * @date 1/25/2024 - 4:58:49 PM
 *
 * @export
 * @typedef {TraceArray}
 */
export type TraceArray = P[];

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:27 AM
 *
 * @type {("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:\"<>?`~[]';./=\\,")}
 */
const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:"<>?`~[]\';./=\\,';

/**
 * Description placeholder
 * @date 1/25/2024 - 4:58:49 PM
 */
const compressI = (num: number) => {
    let str = chars[Math.floor(num / chars.length)] + chars[num % chars.length];
    if (str[0] === 'A') str = str.slice(1); // remove leading A, since that is the default
    return str;
};

/**
 * Description placeholder
 * @date 1/25/2024 - 4:58:49 PM
 */
const decompressI = (str: string) => {
    if (str.length === 1) str = 'A' + str; // add leading A, since that is the default
    const index = chars.indexOf(str[0]) * chars.length + chars.indexOf(str[1]);
    return index;
};

/**
 * Description placeholder
 * @date 1/25/2024 - 4:58:49 PM
 */
const compressNum = (num: number) => {
    let str = '';
    while (num > 0) {
        str = chars[num % chars.length] + str;
        num = Math.floor(num / chars.length);
    }
    return str;
};

/**
 * Description placeholder
 * @date 1/25/2024 - 4:58:49 PM
 */
const decompressNum = (str: string) => {
    let num = 0;
    for (let i = 0; i < str.length; i++) {
        num = num * chars.length + chars.indexOf(str[i]);
    }
    return num;
};

/**
 * Description placeholder
 * @date 1/25/2024 - 4:58:48 PM
 *
 * @export
 * @class Trace
 * @typedef {Trace}
 */
export class Trace {
    /**
     * Description placeholder
     * @date 1/25/2024 - 4:58:48 PM
     *
     * @static
     * @param {TraceArray} trace
     * @returns {*}
     */
    static encode(trace: TraceArray) {
        return trace.map(Trace.compress);
    }
    /**
     * Description placeholder
     * @date 1/25/2024 - 4:58:48 PM
     *
     * @static
     * @param {string[]} trace
     * @returns {*}
     */
    static decode(trace: string[]) {
        return trace.map(Trace.decompress);
    }

    /**
     * Description placeholder
     * @date 1/25/2024 - 4:58:48 PM
     *
     * @static
     * @param {P} point
     * @returns {string}
     */
    static compress(point: P): string {
        const [i, x, y, a] = point;
        // i is a whole number between 0 and 600
        // x is a decimal between 0 and 1 (0.1234)
        // y is a decimal between 0 and 1 (0.1234)
        // a is a 3 character string without any punctuation (spk, amp, src, trp, clb)
        // compress the point to a smaller string

        const iStr = compressI(i);
        const xStr = compressNum(Math.floor(x * 10000));
        const yStr = compressNum(Math.floor(y * 10000));
        const aStr = a === 0 ? ' ' : a;

        return [iStr, xStr, yStr, aStr].join(' ');
    }

    /**
     * Description placeholder
     * @date 1/25/2024 - 4:58:48 PM
     *
     * @static
     * @param {string} str
     * @returns {P}
     */
    static decompress(str: string): P {
        const [iStr, xStr, yStr, aStr] = str.split(' ');
        const i = decompressI(iStr);
        const x = decompressNum(xStr) / 10000;
        const y = decompressNum(yStr) / 10000;
        const a = aStr === '' ? 0 : (aStr as Action);

        return [i, x, y, a];
    }

    /**
     * Description placeholder
     * @date 1/25/2024 - 4:58:48 PM
     *
     * @static
     * @param {TraceArray} trace1
     * @param {TraceArray} trace2
     * @returns {| {
     *             status: 'incorrect-length';
     *             l1: number;
     *             l2: number;
     *         }
     *         | {
     *             status: 'incorrect-point';
     *             i: number;
     *             p1: P;
     *             p2: P;
     *         }
     *         | {
     *             status: 'incorrect-action';
     *             i: number;
     *             a1: Action | 0;
     *             a2: Action | 0;
     *         }
     *         | {
     *             status: 'identical';
     *         }}
     */
    static compare(
        trace1: TraceArray,
        trace2: TraceArray
    ):
        | {
              status: 'incorrect-length';
              l1: number;
              l2: number;
          }
        | {
              status: 'incorrect-point';
              i: number;
              p1: P;
              p2: P;
          }
        | {
              status: 'incorrect-action';
              i: number;
              a1: Action | 0;
              a2: Action | 0;
          }
        | {
              status: 'identical';
          } {
        if (trace1.length !== trace2.length) {
            return {
                status: 'incorrect-length',
                l1: trace1.length,
                l2: trace2.length
            };
        }

        for (let i = 0; i < trace1.length; i++) {
            const p1 = trace1[i];
            const p2 = trace2[i];

            if (p1[0] !== p2[0] || p1[1] !== p2[1]) {
                return {
                    status: 'incorrect-point',
                    i,
                    p1,
                    p2
                };
            }

            if (p1[3] !== p2[3]) {
                return {
                    status: 'incorrect-action',
                    i,
                    a1: p1[3],
                    a2: p2[3]
                };
            }
        }

        return {
            status: 'identical'
        };
    }

    static fixZeroIssue(trace: TraceArray): TraceArray {
        return trace.slice().map((t, i, a) => {
            if (t[1] === 0 && t[2] === 0) {
                t[1] = a[i - 1]?.[1] || a[i + 1][1];
                t[2] = a[i - 1]?.[2] || a[i + 1][2];
            }

            return t;
        });
    }

    static getSection(point: P): 'auto' | 'teleop' | 'endgame' {
        const [i] = point;
        if (i < 65) return 'auto';
        if (i < (150 - 30) * 4) return 'teleop';
        return 'endgame';
    }

    static expand(trace: TraceArray) {
        // fill in missing points
        const expanded: TraceArray = [];
        for (let i = 0; i < trace.length - 1; i++) {
            const point = trace[i];
            const nextPoint = trace[i + 1];
            expanded.push(point);

            const filler: TraceArray = [];

            try {
                filler.push(
                    ...(Array.from({
                        length: nextPoint[0] - point[0] - 1
                    }).map((_, i) => {
                        return [point[0] + i + 1, point[1], point[2], 0];
                    }) as TraceArray)
                );
            } catch {
                // do nothing as the length is 0
            }

            expanded.push(...filler);
        }

        return expanded;
    }

    /**
     * Description placeholder
     * @date 1/25/2024 - 4:58:48 PM
     *
     * @static
     * @param {P} p
     * @param {number} i
     * @param {P[]} a
     * @returns {boolean}
     */
    static filterPipe(p: P, i: number, a: P[]) {
        if (p[3] !== 0 && a[i - 1]) {
            const x1 = a[i - 1][1];
            const y1 = a[i - 1][2];

            const x2 = p[1];
            const y2 = p[2];

            if (x1 === x2 && y1 === y2) return false;
        }

        return p[1] !== -1 && p[2] !== -1;
    }

    /**
     * Description placeholder
     * @date 1/25/2024 - 4:58:48 PM
     *
     * @static
     * @template [T=Action]
     * @param {T} action
     * @returns {(p: P) => boolean}
     */
    static filterAction<T = Action>(action: T) {
        return (p: P) => p[3] === action;
    }

    static filterIndex(from: number, to: number) {
        return (p: P) => from <= p[0] && p[0] <= to;
    }

    static secondsNotMoving(trace: TraceArray, includeAuto: boolean): number {
        let t: TraceArray = trace.slice(); // clone
        // auto = 0-65
        t = includeAuto
            ? t.filter(Trace.filterIndex(0, 600))
            : t.filter(Trace.filterIndex(65, 600));

        let notMoving = 0; // in quarter seconds

        for (let i = 0; i < t.length - 1; i++) {
            const [, x1, y1] = t[i];
            const [, x2, y2] = t[i + 1];
            const dx = (x2 - x1) * 54;
            const dy = (y2 - y1) * 27;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 0.1) {
                notMoving++;
            }
        }

        return notMoving * 4;
    }

    static get velocity() {
        return {
            map: (trace: TraceArray, normalize = false) => {
                return trace
                    .map((p1, i, a) => {
                        if (i === a.length - 1) return null;

                        const [, x1, y1] = p1;
                        const [, x2, y2] = a[i + 1];

                        const dx = (x2 - x1) * (normalize ? 1 : 54);
                        const dy = (y2 - y1) * (normalize ? 1 : 27);

                        const distance = Math.sqrt(dx * dx + dy * dy);

                        return distance * 4;
                    })
                    .filter(p => p !== null) as number[];
            },
            histogram: (trace: TraceArray) => {
                const m = Trace.velocity.map(trace);
                const NUM_BUCKETS = 20;
                const sorted = m.sort((a, b) => a - b);
                const max = sorted[sorted.length - 1];

                const buckets: number[] = new Array(NUM_BUCKETS).fill(0);
                const bucketSize = max / NUM_BUCKETS;

                for (const v of m) {
                    const bucket = Math.floor(v / bucketSize);
                    buckets[bucket]++;
                }

                return buckets;
            },
            average: (trace: TraceArray) => {
                const m = Trace.velocity.map(trace);
                return (
                    m
                        // .filter(v => v < 20) // remove outliers. Robots generally cannot go above 20fps
                        .reduce((a, b) => a + b, 0) / m.length
                );
            }
        };
    }

    /**
     * Description placeholder
     * @date 1/25/2024 - 4:58:48 PM
     *
     * @static
     * @readonly
     * @type {{ compress: (str: string | number) => string; decompress: (str: string) => string; encode: (trace: {}) => {}; decode: (trace: {}) => any; }}
     */
    static get old() {
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:"<>?`~[]\';./=\\,';

        const parse = (str: string): [number, number, number] => {
            return [
                +str.slice(0, 2) / 100,
                +str.slice(2, 4) / 100,
                +str.slice(4, 10) / 1000
            ];
        };

        return {
            compress: (str: string | number) => {
                let num = +str;
                const base = chars.length;
                let result = '';
                while (num > 0) {
                    result = chars[num % base] + result;
                    num = Math.floor(num / base);
                }
                return result;
            },
            decompress: (str: string) => {
                const base = chars.length;
                let num = 0;
                for (let i = 0; i < str.length; i++) {
                    num +=
                        chars.indexOf(str[i]) *
                        Math.pow(base, str.length - i - 1);
                }
                str = num.toString();

                return new Array(110 - str.length).fill('0').join('') + str;
            },
            encode: (
                trace: [string | number, string | number, string | number][]
            ): string[] => {
                return trace.map(p => p.map(Trace.old.compress).join(' '));
            },
            decode: (trace: string[]) => {
                return trace.map(Trace.old.decompress);
            }
        };
    }

    static get score() {
        return {
            get yearBreakdown() {
                return {
                    2024: {
                        auto: {
                            spk: 5,
                            amp: 2,
                            mobility: 2
                        },
                        teleop: {
                            spk: 2,
                            lob: 0,
                            amp: 1,
                            clb: 3,
                            park: 1,
                            trp: 5
                        }
                    },
                    2025: {
                        auto: {
                            cl1: 3,
                            cl2: 4,
                            cl3: 6,
                            cl4: 7,
                            brg: 4,
                            prc: 6,
                            mobility: 3
                        },
                        teleop: {
                            cl1: 2,
                            cl2: 3,
                            cl3: 4,
                            cl4: 5,
                            brg: 4,
                            prc: 6,
                            shc: 6,
                            dpc: 12,
                            park: 2
                        }
                    }
                } as const;
            },
            parse2024: (trace: TraceArray, alliance: 'red' | 'blue') => {
                const { auto, teleop } = Trace.score.yearBreakdown[2024];

                const score = {
                    auto: {
                        spk: 0,
                        amp: 0,
                        mobility: 0,
                        lob: 0,
                        total: 0
                    },
                    teleop: {
                        spk: 0,
                        amp: 0,
                        trp: 0,
                        lob: 0,
                        total: 0
                    },
                    endgame: {
                        clb: 0,
                        park: 0,
                        total: 0
                    },
                    total: 0
                };

                const autoZone = all2024.autoZone[alliance];

                for (const p of trace) {
                    if (p[0] <= 65) {
                        if (p[3] === 'spk') score.auto.spk += auto.spk;
                        if (p[3] === 'amp') score.auto.amp += auto.amp;
                        if (!isInside([p[1], p[2]], autoZone))
                            score.auto.mobility = auto.mobility;
                    } else {
                        if (p[3] === 'lob') score.teleop.lob++;
                        if (p[3] === 'spk') score.teleop.spk += teleop.spk;
                        if (p[3] === 'amp') score.teleop.amp += teleop.amp;
                        if (p[3] === 'clb') score.endgame.clb += teleop.clb;
                        if (p[3] === 'trp') score.teleop.trp += teleop.trp;
                    }
                }

                const parkZone = all2024.stages[alliance];

                const noClimb = trace.every(p => p[3] !== 'clb');
                if (
                    noClimb &&
                    trace.length &&
                    isInside(
                        [
                            trace[trace.length - 1][1],
                            trace[trace.length - 1][2]
                        ],
                        parkZone
                    )
                )
                    score.endgame.park = teleop.park;

                score.auto.total =
                    score.auto.spk + score.auto.amp + score.auto.mobility;
                score.teleop.total =
                    score.teleop.spk + score.teleop.amp + score.teleop.trp;
                score.endgame.total = score.endgame.clb + score.endgame.park;
                score.total =
                    score.auto.total + score.teleop.total + score.endgame.total;

                return score;
            },
            parse2025: (trace: TraceArray, alliance: 'red' | 'blue') => {
                const { auto, teleop } = Trace.score.yearBreakdown[2025];

                const score = {
                    auto: {
                        cl1: 0,
                        cl2: 0,
                        cl3: 0,
                        cl4: 0,
                        brg: 0,
                        prc: 0,
                        mobility: 0,
                        total: 0
                    },
                    teleop: {
                        cl1: 0,
                        cl2: 0,
                        cl3: 0,
                        cl4: 0,
                        brg: 0,
                        prc: 0,
                        shc: 0,
                        dpc: 0,
                        park: 0,
                        total: 0
                    },
                    endgame: {
                        shc: 0,
                        dpc: 0,
                        park: 0,
                        total: 0
                    },
                    total: 0
                };

                const autoZone = all2025.zones[alliance];

                for (const p of trace) {
                    if (p[0] <= 65) {
                        if (p[3] === 'cl1') score.auto.cl1 += auto.cl1;
                        if (p[3] === 'cl2') score.auto.cl2 += auto.cl2;
                        if (p[3] === 'cl3') score.auto.cl3 += auto.cl3;
                        if (p[3] === 'cl4') score.auto.cl4 += auto.cl4;
                        if (p[3] === 'brg') score.auto.brg += auto.brg;
                        if (p[3] === 'prc') score.auto.prc += auto.prc;
                        if (!isInside([p[1], p[2]], autoZone))
                            score.auto.mobility = auto.mobility;
                    } else {
                        if (p[3] === 'cl1') score.teleop.cl1 += teleop.cl1;
                        if (p[3] === 'cl2') score.teleop.cl2 += teleop.cl2;
                        if (p[3] === 'cl3') score.teleop.cl3 += teleop.cl3;
                        if (p[3] === 'cl4') score.teleop.cl4 += teleop.cl4;
                        if (p[3] === 'brg') score.teleop.brg += teleop.brg;
                        if (p[3] === 'prc') score.teleop.prc += teleop.prc;
                        if (p[3] === 'shc') score.teleop.shc += teleop.shc;
                        if (p[3] === 'dpc') score.teleop.dpc += teleop.dpc;
                    }
                }

                const parkZone = all2025.barges[alliance];

                const noClimb = trace.every(p => p[3] !== 'clb');

                if (
                    noClimb &&
                    trace.length &&
                    isInside(
                        [
                            trace[trace.length - 1][1],
                            trace[trace.length - 1][2]
                        ],
                        parkZone
                    )
                )
                    score.teleop.park = teleop.park;

                score.auto.total = Object.values(score.auto).reduce(
                    (a, b) => a + b
                );

                score.teleop.total = Object.values(score.teleop).reduce(
                    (a, b) => a + b
                );

                // score.endgame.total = score.endgame.clb + score.endgame.park;

                score.total = score.auto.total + score.teleop.total;

                return score;
            }
        };
    }

    static get yearInfo() {
        return {
            2024: {
                getAlliance: (trace: TraceArray) => {
                    if (!trace || !trace.length) return 'red'; // default to red
                    const initPoint: Point2D = [trace[0][1], trace[0][2]];
                    if (isInside(initPoint, all2024.zones.red)) {
                        return 'red';
                    } else {
                        return 'blue';
                    }
                },
                climbTimes: (trace: TraceArray) => {
                    const alliance = Trace.yearInfo[2024].getAlliance(trace);
                    const stage = all2024.stages[alliance];

                    const times: number[] = [];

                    let time = 0;
                    for (const p of trace) {
                        if (isInside([p[1], p[2]], stage)) {
                            time++;
                        } else {
                            time = 0;
                        }

                        if (['clb', 'trp'].includes(p[3] as Action2024)) {
                            times.push(time);
                            time = 0;
                        }
                    }

                    return times;
                },
                mustGroundPick: (trace: TraceArray) => {
                    return (
                        trace.filter(Trace.filterAction('spk')).length >
                        trace.filter(Trace.filterAction('src')).length + 1
                    );
                },
                summarize: (
                    trace: { trace: TraceArray; alliance: 'red' | 'blue' }[]
                ): {
                    title: string;
                    labels: string[];
                    data: number[];
                }[] => {
                    const traceData = trace.map(t =>
                        Trace.score.parse2024(t.trace, t.alliance)
                    );
                    return [
                        {
                            title: 'Auto Points',
                            labels: [
                                'Speaker',
                                // 'Amp',
                                'Mobility'
                            ],
                            data: [
                                traceData.map(t => t.auto.spk),
                                // traceData.map(t => t.auto.amp),
                                traceData.map(t => t.auto.mobility)
                            ].map($Math.average)
                        },
                        {
                            title: 'Teleop Points',
                            labels: ['Speaker', 'Amp', 'Trap', 'Total'],
                            data: [
                                traceData.map(t => t.teleop.spk),
                                traceData.map(t => t.teleop.amp),
                                traceData.map(t => t.teleop.trp),
                                traceData.map(t => t.teleop.total)
                            ].map($Math.average)
                        },
                        {
                            title: 'Total Lobs',
                            labels: ['Speaker', 'Lob'],
                            data: [traceData.map(t => t.teleop.lob)].map(
                                $Math.average
                            )
                        },
                        {
                            title: 'Endgame Points',
                            labels: ['Climb', 'Park', 'Total'],
                            data: [
                                traceData.map(t => t.endgame.clb),
                                traceData.map(t => t.endgame.park),
                                traceData.map(t => t.endgame.total)
                            ].map($Math.average)
                        },
                        {
                            title: 'Total Points',
                            labels: ['Total'],
                            data: [traceData.map(t => t.total)].map(
                                $Math.average
                            )
                        },
                        {
                            title: 'Average Velocity',
                            labels: ['Velocity'],
                            data: [
                                Trace.velocity.average(
                                    trace.flatMap(p => p.trace)
                                )
                            ]
                        },
                        {
                            title: 'Seconds Not Moving',
                            labels: ['Seconds'],
                            data: [
                                Trace.secondsNotMoving(
                                    trace.flatMap(p => p.trace),
                                    false
                                )
                            ]
                        }
                    ];
                }
            },
            2025: {
                getAlliance: (trace: TraceArray) => {
                    if (!trace || !trace.length) return 'red'; // default to red
                    const initPoint: Point2D = [trace[0][1], trace[0][2]];
                    if (isInside(initPoint, all2024.zones.red)) {
                        return 'red';
                    } else {
                        return 'blue';
                    }
                },
                climbTimes: (trace: TraceArray) => {
                    const alliance = Trace.yearInfo[2024].getAlliance(trace);
                    const stage = all2024.stages[alliance];

                    const times: number[] = [];

                    let time = 0;
                    for (const p of trace) {
                        if (isInside([p[1], p[2]], stage)) {
                            time++;
                        } else {
                            time = 0;
                        }

                        if (['shc', 'dpc'].includes(p[3] as Action2024)) {
                            times.push(time);
                            time = 0;
                        }
                    }

                    return times;
                },
                summarize: (
                    trace: { trace: TraceArray; alliance: 'red' | 'blue' }[]
                ): {
                    title: string;
                    labels: string[];
                    data: number[];
                }[] => {
                    const traceData = trace.map(t =>
                        Trace.score.parse2025(t.trace, t.alliance)
                    );
                    return [
                        {
                            title: 'Auto Points',
                            labels: ['Coral', 'Algae', 'Mobility', 'Total'],
                            data: [
                                traceData.map(
                                    t =>
                                        t.auto.cl1 +
                                        t.auto.cl2 +
                                        t.auto.cl3 +
                                        t.auto.cl4
                                ),
                                traceData.map(t => t.auto.brg + t.auto.prc),
                                traceData.map(t => t.auto.mobility),
                                traceData.map(t => t.auto.total)
                            ].map($Math.average)
                        },
                        {
                            title: 'Teleop Points',
                            labels: [
                                'Coral',
                                'Algae',
                                'Shallow Climb',
                                'Deep Climb',
                                'Park',
                                'Total'
                            ],
                            data: [
                                traceData.map(
                                    t =>
                                        t.teleop.cl1 +
                                        t.teleop.cl2 +
                                        t.teleop.cl3 +
                                        t.teleop.cl4
                                ),
                                traceData.map(t => t.teleop.brg + t.teleop.prc),
                                traceData.map(t => t.teleop.shc),
                                traceData.map(t => t.teleop.dpc),
                                traceData.map(t => t.teleop.park),
                                traceData.map(t => t.teleop.total)
                            ].map($Math.average)
                        },
                        {
                            title: 'Total Points',
                            labels: ['Total'],
                            data: [traceData.map(t => t.total)].map(
                                $Math.average
                            )
                        },
                        {
                            title: 'Average Velocity',
                            labels: ['Velocity'],
                            data: [
                                Trace.velocity.average(
                                    trace.flatMap(p => p.trace)
                                )
                            ]
                        },
                        {
                            title: 'Seconds Not Moving',
                            labels: ['Seconds'],
                            data: [
                                Trace.secondsNotMoving(
                                    trace.flatMap(p => p.trace),
                                    false
                                )
                            ]
                        }
                    ];
                }
            }
        } as const;
    }

    static builtYears = [2024, 2025];
}

export type Match = {
    checks: string[];
    comments: {
        [key: string]: string;
    };
    matchNumber: number;
    teamNumber: number;
    compLevel: 'pr' | 'qm' | 'qf' | 'sf' | 'f';
    eventKey: string;
    scout: string;
    date: number;
    group: -1 | 0 | 1 | 2 | 3 | 4 | 5 | null;
    trace: TraceArray;
    preScouting: boolean;
};

export const validateObj = {
    checks: (v: unknown) =>
        Array.isArray(v) && v.every(v => typeof v === 'string'),
    comments: (v: unknown) =>
        typeof v === 'object' &&
        Object.values(v as object).every(v => typeof v === 'string'),
    matchNumber: 'number',
    teamNumber: 'number',
    compLevel: ['pr', 'qm', 'qf', 'sf', 'f'],
    eventKey: 'string',
    scout: 'string',
    date: 'number',
    group: (d: number | null) => d === null || (d >= -1 && d <= 5),
    preScouting: 'boolean'
};
