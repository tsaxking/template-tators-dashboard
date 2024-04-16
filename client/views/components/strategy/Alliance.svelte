<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { TBA } from '../../../utilities/tba';
import { Trace } from '../../../../shared/submodules/tatorscout-calculations/trace';
import {
    type TBAMatch,
    teamsFromMatch
} from '../../../../shared/submodules/tatorscout-calculations/tba';
import { FIRSTEvent } from '../../../models/FIRST/event';
import Select from '../bootstrap/Select.svelte';
import TeamSelect from '../main/TeamSelect.svelte';
import { match } from 'assert';
import { attemptAsync } from '../../../../shared/check';
export let team1: FIRSTTeam | undefined = undefined;
export let team2: FIRSTTeam | undefined = undefined;
export let team3: FIRSTTeam | undefined = undefined;
export let color: 'blue' | 'red' = 'blue';

const fns = {
    getMatchData: async (team: FIRSTTeam | undefined) => {
        return attemptAsync(async () => {
            if (!team) throw new Error('Team is undefined');

            const matchScouting = await team.getMatchScouting();
            if (matchScouting.isErr()) throw matchScouting.error;
            const matchData = matchScouting.value;
            let avgAuto = 0;
            let avgTele = 0;
            let avgEnd = 0;
            const event = FIRSTEvent.current;
            const myTeam = FIRSTTeam.current;
            if (!event) throw new Error('Event is undefined');
            if (!myTeam) throw new Error('My team is undefined');

            const res = await event.getMatches();
            if (res.isErr()) throw res.error;

            const matches = res.value;
            const data = await Promise.all(
                matches.map(async m => {
                    const teams = await m.getTeams();
                    if (teams.isErr()) throw teams.error;
                    const [r1, r2, r3] = teams.value;

                    let alliance: 'red' | 'blue';
                    if ([r1, r2, r3].includes(myTeam)) {
                        alliance = 'red';
                    } else {
                        alliance = 'blue';
                    }

                    return {
                        match: m,
                        alliance,
                        trace:
                            matchData.find(
                                s =>
                                    s.matchNumber === m.number &&
                                    s.compLevel === m.compLevel
                            )?.trace || []
                    };
                })
            );

            return data.map(d => Trace.score.parse2024(d.trace, d.alliance));
        });
    },
    getAllianceData: async (...teams: (FIRSTTeam | undefined)[]) => {
        const data = await Promise.all(teams.map(fns.getMatchData));
    }
};

$: fns.getAllianceData(team1, team2, team3);
//pull matches, match# + comp level, pull alliance
</script>

<div class="card bg-{color === 'red' ? 'danger' : 'primary'} text-white">
    <div class="card-header">
        <div class="d-flex">
            <TeamSelect bind:selected="{team1}"></TeamSelect>
            <TeamSelect bind:selected="{team2}"></TeamSelect>
            <TeamSelect bind:selected="{team3}"></TeamSelect>
        </div>
    </div>
    <div class="card-body"></div>
</div>
