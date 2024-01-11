import { TBA } from '../server/utilities/tba/tba.ts';
import { TBAEvent, TBAMatch } from '../shared/tba.ts';

const allEvents = await TBA.get<TBAEvent[]>('/events/2022');

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
        ((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) /
            7,
    );
};

const weekEvents: TBAEvent[][] = allEvents.reduce(
    (acc: TBAEvent[][], cur: TBAEvent) => {
        const week = getWeekNumber(new Date(cur.start_date));
        if (!acc[week]) acc[week] = [];
        if (acc[week]) acc[week].push(cur);
        return acc;
    },
    [],
).filter(Boolean);

const pullClimbs = (alliance: any) => {
    let climbs = 0;
    climbs += alliance.endgameRobot1 !== 'None' ? 1 : 0;
    climbs += alliance.endgameRobot2 !== 'None' ? 1 : 0;
    climbs += alliance.endgameRobot3 !== 'None' ? 1 : 0;

    return climbs;
};

const climbData = (await Promise.all(weekEvents[2].map(async (e) => {
    const matches = await TBA.get<TBAMatch[]>('/event/' + e.key + '/matches');

    if (!matches) {
        console.error('No matches found for event ' + e.key);
        return;
    }

    const numClimbs = matches.map((m) => {
        return [
            pullClimbs(m.score_breakdown.red),
            pullClimbs(m.score_breakdown.blue),
        ];
    });

    return numClimbs;
}))).filter(Boolean);

console.log(climbData);

const invertArray = (arr: any[][]) => {
    const newArr: any[][] = [];
    for (let i = 0; i < arr[0].length; i++) {
        newArr[i] = [];
        for (let j = 0; j < arr.length; j++) {
            newArr[i][j] = arr[j][i];
        }
    }
    return newArr;
};

const toCSV = (data: any[][]) => {
    let csv = '';
    csv += weekEvents[2].map((e) => {
        return [
            e.name + ' Red',
            e.name + ' Blue',
        ];
    }).flat(Infinity).join(',') + '\n';
    csv += invertArray(data).map((d) => d.join(',')).join('\n');
    return csv;
};

const csv = toCSV(climbData as number[][][]);

Deno.writeTextFileSync('./climb-data.csv', csv);
