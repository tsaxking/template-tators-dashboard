import { TBA } from '../server/utilities/tba/tba.ts';
import { TBATeam } from '../shared/submodules/tatorscout-calculations/tba.ts';



const buildTable = async (eventKey: string) => {
    const teams = await TBA.get<TBATeam[]>(`/event/${eventKey}/teams`);

    if (teams.isErr()) throw teams.error;
    if (!teams.value) throw new Error('No teams found');

    return await Promise.all(teams.value.map(t => buildTeamRow(t.team_number, eventKey)));

}

const buildTeamRow = async (teamNumber: number, eventKey: string) => {}