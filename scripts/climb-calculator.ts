import { TBA } from '../server/utilities/tba/tba.ts';
import {
    TBAEvent,
    YearTBAMatch,
} from '../shared/submodules/tatorscout-calculations/tba.ts';
import { attempt, attemptAsync } from '../shared/attempt.ts';

// console.log(weekEvents.map((e) => e.length));

// Deno.exit()

const pullClimbs2022 = (
    alliance: YearTBAMatch[2022]['score_breakdown']['red'],
) => {
    let climbs = 0;
    climbs += alliance.endgameRobot1 !== 'None' ? 1 : 0;
    climbs += alliance.endgameRobot2 !== 'None' ? 1 : 0;
    climbs += alliance.endgameRobot3 !== 'None' ? 1 : 0;

    if (isNaN(climbs)) climbs = 0;
    return climbs;
};

const pullClimbs2016 = (
    alliance: YearTBAMatch[2016]['score_breakdown']['red'],
) => {
    let climbs = 0;

    climbs += alliance.towerFaceA === 'Challenged' ? 1 : 0;
    climbs += alliance.towerFaceB === 'Challenged' ? 1 : 0;
    climbs += alliance.towerFaceC === 'Challenged' ? 1 : 0;

    if (isNaN(climbs)) climbs = 0;
    return climbs;
};

const pullClimbs2017 = (
    alliance: YearTBAMatch[2017]['score_breakdown']['red'],
) => {
    let climbs = 0;
    climbs += alliance.touchpadFar === 'ReadyForTakeoff' ? 1 : 0;
    climbs += alliance.touchpadMiddle === 'ReadyForTakeoff' ? 1 : 0;
    climbs += alliance.touchpadNear === 'ReadyForTakeoff' ? 1 : 0;

    if (isNaN(climbs)) climbs = 0;

    return climbs;
};

const pullClimbs2018 = (
    alliance: YearTBAMatch[2018]['score_breakdown']['red'],
) => {
    let climbs = 0;

    climbs = ['Climbing', 'Levitate'].includes(alliance.endgameRobot1) ? 1 : 0;
    climbs += ['Climbing', 'Levitate'].includes(alliance.endgameRobot2) ? 1 : 0;
    climbs += ['Climbing', 'Levitate'].includes(alliance.endgameRobot3) ? 1 : 0;

    if (isNaN(climbs)) climbs = 0;

    return climbs;
};

const weekCount = async <y extends keyof YearTBAMatch>(
    events: TBAEvent[],
    week: number,
    year: y,
) => {
    const climbData = (
        await Promise.all(
            events.map(async (e) => {
                const matches = await TBA.get<YearTBAMatch[y][]>(
                    '/event/' + e.key + '/matches',
                );

                if (!matches) {
                    console.error('No matches found for event ' + e.key);
                    return;
                }

                const numClimbs = matches
                    .map((m) => {
                        if (!m.score_breakdown) return null;

                        switch (year) {
                            case 2022:
                                return [
                                    pullClimbs2022(
                                        m.score_breakdown.red as any,
                                    ),
                                    pullClimbs2022(
                                        m.score_breakdown.blue as any,
                                    ),
                                ];
                            case 2016:
                                return [
                                    pullClimbs2016(
                                        m.score_breakdown.red as any,
                                    ),
                                    pullClimbs2016(
                                        m.score_breakdown.blue as any,
                                    ),
                                ];
                            case 2017:
                                return [
                                    pullClimbs2017(
                                        m.score_breakdown.red as any,
                                    ),
                                    pullClimbs2017(
                                        m.score_breakdown.blue as any,
                                    ),
                                ];
                            case 2018:
                                return [
                                    pullClimbs2018(
                                        m.score_breakdown.red as any,
                                    ),
                                    pullClimbs2018(
                                        m.score_breakdown.blue as any,
                                    ),
                                ];
                            default:
                                return null;
                        }
                    })
                    .filter(Boolean);

                return numClimbs;
            }),
        )
    ).filter(Boolean) as number[][][];

    const numClimbed = climbData.reduce((acc, cur) => {
        return (
            acc +
            cur.reduce((acc, cur) => {
                return (
                    acc +
                    cur.reduce((acc, cur) => {
                        if (cur > 1) return acc + 1;
                        return acc;
                    }, 0)
                );
            }, 0)
        );
    }, 0);

    const totalMatches = climbData.reduce((acc, cur) => {
        return (
            acc +
            cur.reduce((a, c) => {
                return a + c.length; // all matches
                // return a + c.filter((c) => c > 0).length; // only matches with climbs
            }, 0)
        );
    }, 0);

    console.log(
        `${year} | Week ${week}: ${
            Math.round(
                (100 * numClimbed) / totalMatches,
            )
        }%`,
    );
};

const test = async <y extends keyof YearTBAMatch>(year: y) => {
    const allEvents = await TBA.get<TBAEvent[]>(`/events/${year}`);
    if (!allEvents) throw new Error('No events found');

    // sort by date
    allEvents.sort((a: any, b: any) => {
        const aDate = new Date(a.start_date);
        const bDate = new Date(b.start_date);
        return aDate.getTime() - bDate.getTime();
    });

    const getWeekNumber = (date: Date) => {
        const onejan = new Date(date.getFullYear(), 0, 1);
        return Math.ceil(
            ((date.getTime() - onejan.getTime()) / 86400000 +
                onejan.getDay() +
                1) /
                7,
        );
    };

    const weekEvents: TBAEvent[][] = allEvents
        .reduce((acc: TBAEvent[][], cur: TBAEvent) => {
            const week = getWeekNumber(new Date(cur.start_date));
            if (!acc[week]) acc[week] = [];
            if (acc[week]) acc[week].push(cur);
            return acc;
        }, [])
        .filter(Boolean);

    for (let i = 1; i < 9; i++) {
        const events = weekEvents[i + 1];

        await attemptAsync(weekCount, events, i, year);
    }
};

await attemptAsync(test, 2016);
console.log('---');
await attemptAsync(test, 2017);
console.log('---');
await attemptAsync(test, 2018);
console.log('---');
await attemptAsync(test, 2022);

// console.log(climbData);

// const invertArray = (arr: any[][]) => {
//     const newArr: any[][] = [];
//     for (let i = 0; i < arr[0].length; i++) {
//         newArr[i] = [];
//         for (let j = 0; j < arr.length; j++) {
//             newArr[i][j] = arr[j][i];
//         }
//     }
//     return newArr;
// };

// const toCSV = (data: any[][]) => {
//     let csv = '';
//     csv += events.map((e) => {
//         return [
//             e.name + ' Red',
//             e.name + ' Blue',
//         ];
//     }).flat(Infinity).join(',') + '\n';
//     csv += invertArray(data).map((d) => d.join(',')).join('\n');
//     return csv;
// };

// const csv = toCSV(climbData as number[][][]);

// Deno.writeTextFileSync('./climb-data.csv', csv);
