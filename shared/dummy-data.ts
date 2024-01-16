import { $Math, Random } from './math.ts';
import {
    Point,
    Point2D,
} from './submodules/calculations/src/linear-algebra/point.ts';
import {
    Action,
    P,
    Trace,
} from './submodules/tatorscout-calculations/trace.ts';

const chars = 'abcdefghijklmnopqrstuvwxyz';
const char = (num: number) =>
    new Array(num)
        .fill('')
        .map((_) => chars[Math.floor(Math.random() * chars.length)])
        .join('');
const num = (num: number) =>
    +new Array(num)
        .fill(0)
        .map((_) => Math.floor(Math.random() * 10))
        .join('');

export const createEvent = () => {
    const year = num(4);
    const chars = char(4);
    const key = year + chars;

    return {
        key,
        flipX: false,
        flipY: false,
    };
};

export const createTeam = (eventKey: string) => {
    return {
        number: num(5),
        eventKey,
        watchPriority: 0,
    };
};

export const createMatch = (
    eventKey: string,
    i: number,
    compLevel: 'pr' | 'qm' | 'qf' | 'sf' | 'f',
) => {
    if (i < 1) throw new Error('i must be greater than 0');
    const id = Random.uuid();
    return {
        id,
        eventKey,
        matchNumber: i,
        compLevel,
    };
};

export const createMatchScouting = (
    team: number,
    matchId: string,
    scoutId: string,
) => {
    return {
        id: Random.uuid() as string,
        matchId,
        team,
        scoutId,
        scoutGroup: String(Random.choose([0, 1, 2, 3, 4, 5, 6])),
        trace: JSON.stringify(generateTrace()),
        preScouting: false,
        time: String(Date.now()),
    };
};

const initPoints: Point2D[] = [
    [0.25, 0.3],
    [0.5, 0.3],
    [0.75, 0.3],
    [0.25, 0.7],
    [0.5, 0.7],
    [0.75, 0.7],
];

const actions: Action[] = ['spk', 'amp', 'src', 'trp', 'clb'];

export const generateTrace = () => {
    class Tick {
        public pos: Point2D | undefined;
        public action: Action | undefined;

        constructor(
            public readonly index: number,
            public readonly robot: Robot,
        ) {}

        simplify(): P {
            const simple: [number, number, number, Action | 0] = [
                this.index,
                -1,
                -1,
                0,
            ];

            if (this.pos) {
                simple[1] = $Math.roundTo(4, this.pos[0]);
                simple[2] = $Math.roundTo(4, this.pos[1]);
            }

            if (this.action) simple[3] = this.action;

            return simple;
        }

        get prev(): Tick {
            return this.robot.ticks[this.index - 1];
        }

        get next(): Tick {
            return this.robot.ticks[this.index + 1];
        }
    }

    class Robot {
        public ticks: Tick[] = new Array(150 * 4)
            .fill(null)
            .map((_, i) => new Tick(i, this));
        public pos = Random.choose(initPoints);
        public readonly vel = Random.between(3, 15);
        public currentTick = this.ticks[0];

        move(tick: Tick) {
            if (tick.prev?.pos && Random.between(0, 100) < 5) {
                this.pos = tick.prev.pos;
                return tick;
            }

            const dir: Point2D = Random.choose(
                new Array(8).fill(0).map((_, i) => {
                    const angle = i * 45;
                    const x = Math.cos(angle);
                    const y = Math.sin(angle);
                    return [x, y];
                }),
            );

            const v = new Point(dir[0] * 27, dir[1] * 54);
            v.scale(Random.between(0, this.vel));
            v.x = v.x / 27;
            v.y = v.y / 54;

            let p = new Point(this.pos[0], this.pos[1]);
            p = p.add(v);

            tick.pos = [p.x, p.y];
            if (tick.pos[0] < 0) tick.pos[0] = -tick.pos[0];
            if (tick.pos[1] < 0) tick.pos[1] = -tick.pos[1];

            if (tick.pos[0] > 1) tick.pos[0] = 2 - tick.pos[0];
            if (tick.pos[1] > 1) tick.pos[1] = 2 - tick.pos[1];

            if (Random.between(0, 100) < 5) {
                tick.action = Random.choose(actions);
            }

            return tick;
        }

        generate() {
            return this.ticks.map((t) => this.move(t)).map((t) => t.simplify());
        }
    }

    return new Robot().generate().filter(Trace.filterPipe);
};
