import { TBA } from '../server/utilities/tba/tba';
import { TBAMatch } from '../shared/submodules/tatorscout-calculations/tba';

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
};

(async () => {
    const [eventKey] = process.argv.slice(2);

    const matches = await TBA.get<TBAMatch[]>(`/event/${eventKey}/matches`);

    if (matches.isErr() || !matches.value) {
        console.log('No matches found');
        process.exit(0);
    }

    console.log(matches);

    const [m] = matches.value;

    console.log(m);

    const ts = getType(m);
    console.log(ts + ';');

    process.exit(0);
})();
