import { TBA } from '../server/utilities/tba/tba.ts';
import { TBAMatch, TBATeam } from '../shared/tba.ts';
import {
    generateScoutGroups,
    testAssignments,
} from '../shared/scout-groups.ts';
import { saveJSON } from '../server/utilities/files.ts';
import { error, log } from '../server/utilities/terminal-logging.ts';

const [key] = Deno.args;

const regex = /^([0-9]{4}[a-z]{3,4})$/i;

log('Generating scouting assignments for:', key);

if (!regex.test(key)) {
    throw new Error(
        'Invalid event key (failed regex: ' + regex.toString() +
            ') It must be in the format: 2023cabl',
    );
}

const matches = await TBA.get<TBAMatch[]>(`/event/${key}/matches`);
const teams = await TBA.get<TBATeam[]>(`/event/${key}/teams`);

if (!matches || !teams) throw new Error('Failed to fetch matches or teams');

const assignment = generateScoutGroups(teams, matches);

const result = testAssignments(assignment);
if (result.status !== 'ok') {
    error(result);
    throw new Error('Failed to generate scout groups');
}

if (Deno.args.includes('--save')) {
    saveJSON(`${key}-scout.assignment`, JSON.stringify(assignment, null, 2));
} else log('Generated assignment:', assignment);
