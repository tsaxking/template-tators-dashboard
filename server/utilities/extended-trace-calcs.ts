import { all as all2024 } from '../../shared/submodules/tatorscout-calculations/2024-areas.ts';
import { TraceArray, Trace, Action2024 } from '../../shared/submodules/tatorscout-calculations/trace.ts';
import { isInside } from '../../shared/submodules/calculations/src/polygon.ts';
import { Point2D } from '../../shared/submodules/calculations/src/linear-algebra/point.ts';

export const parse2024 = (trace: TraceArray) => {
    const { auto, teleop } = Trace.score.yearBreakdown[2024];

    const score = {
        auto: {
            spk: 0,
            amp: 0,
            mobility: 0,
            total: 0
        },
        teleop: {
            spk: 0,
            amp: 0,
            trp: 0,
            total: 0
        },
        endgame: {
            clb: 0,
            park: 0,
            total: 0
        },
        total: 0
    };

    const alliance = yearInfo[2024].getAlliance(trace);

    const autoZone = all2024.autoZone[alliance];

    for (const p of trace) {
        if (p[0] <= 65) {
            if (p[3] === 'spk') score.auto.spk += auto.spk;
            if (p[3] === 'amp') score.auto.amp += auto.amp;
            if (!isInside([p[1], p[2]], autoZone))
                score.auto.mobility = auto.mobility;
        } else {
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
}

export const yearInfo = {
    2024: {
        getAlliance: (trace: TraceArray) => {
            const initPoint: Point2D = [trace[0][1], trace[0][2]];
            if (isInside(initPoint, all2024.zones.red)) {
                return 'red';
            } else {
                return 'blue';
            }
        },
        climbTimes: (trace: TraceArray) => {
            const alliance = yearInfo[2024].getAlliance(trace);
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
        }
    }
}