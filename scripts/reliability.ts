import { attemptAsync } from '../shared/check';
import { DB } from '../server/utilities/databases';
import { TraceArray } from '../shared/submodules/tatorscout-calculations/trace';
import { TBA } from '../server/utilities/tba/tba';
import { TBATeam } from '../shared/submodules/tatorscout-calculations/tba';

const getMatchScouting = async (teamNumber: number, eventKey: string) => {
    return attemptAsync(async () => {
        const res = await DB.all('match-scouting/from-team', {
            eventKey,
            team: teamNumber
        });

        if (res.isErr()) throw res.error;

        return res.value
            .map(m => {
                return {
                    ...m,
                    trace: JSON.parse(m.trace) as TraceArray
                };
            })
            .reverse()
            .filter((s, i, a) => {
                return (
                    a.findIndex(s2 => s2.matchNumber === s.matchNumber) === i
                );
            });
    });
};

const main = async () => {
    const teams = await TBA.get<TBATeam[]>('/event/2024gal/teams');
    if (teams.isErr()) throw teams.error;
    if (teams === null) throw new Error('No teams');

    const teamNumbers = (teams.value || []).map(t => t.team_number);
};
