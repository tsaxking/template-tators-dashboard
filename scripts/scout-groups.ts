import { TBA } from '../server/utilities/tba/tba';
import {
    TBAMatch,
    TBATeam
} from '../shared/submodules/tatorscout-calculations/tba';
import {
    generateScoutGroups,
    testAssignments
} from '../shared/submodules/tatorscout-calculations/scout-groups';
import { saveJSON } from '../server/utilities/files';
import { error, log } from '../server/utilities/terminal-logging';

(async () => {
    const [, , key] = process.argv;

    const regex = /^([0-9]{4}[a-z]{3,4})$/i;

    log('Generating scouting assignments for:', key);

    if (!regex.test(key)) {
        throw new Error(
            'Invalid event key (failed regex: ' +
                regex.toString() +
                ') It must be in the format: 2023cabl'
        );
    }

    const [matchesRes, teamsRes] = await Promise.all([
        TBA.get<TBAMatch[]>(`/event/${key}/matches`),
        TBA.get<TBATeam[]>(`/event/${key}/teams`)
    ]);

    if (matchesRes.isErr() || teamsRes.isErr()) {
        throw new Error('Failed to fetch matches or teams');
    }

    const matches = matchesRes.value;
    const teams = teamsRes.value;

    // const str = JSON.stringify({
    //     matches,
    //     teams
    // }, null, 2);

    // saveJSONSync(`${key}-scout-groups`, str);

    if (!matches || !teams) throw new Error('Failed to fetch matches or teams');

    const assignment = generateScoutGroups(teams, matches);

    const result = testAssignments(assignment);
    if (result.status !== 'ok') {
        error(result);
        throw new Error('Failed to generate scout groups');
    }

    if (process.argv.includes('--save')) {
        saveJSON(
            `${key}-scout.assignment`,
            JSON.stringify(assignment, null, 2)
        );
    } else log('Generated assignment:', assignment);
})();
