import { TBA } from '../server/utilities/tba/tba.ts';
import { TBAMatch } from '../shared/tba.ts';


const matches = await TBA.get<TBAMatch[]>('/event/2012utwv/matches');

if (!matches) {
    console.log('No matches found');
    Deno.exit(0);
}

console.log(matches);

const [m] = matches;


const getType = (data: any): any => {
    let tsStr = '';
    if (data === null) {
        return 'null';
    }

    if (Array.isArray(data)) {
        return '(' + getType(data[0]) + ')[]';
    }

    if (typeof data === 'object') {
        for (const [key, value] of Object.entries(data)) {
            tsStr += `${key}: ${getType(value)};`;
        }

        return `{${tsStr}}`;
    }

    return typeof data;
}

const ts = getType(m);
console.log(ts + ';');