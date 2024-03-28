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
export let team1: FIRSTTeam | undefined = undefined;
export let team2: FIRSTTeam | undefined = undefined;
export let team3: FIRSTTeam | undefined = undefined;
import { $Math as M } from '../../../../shared/math';

let bBot1 = {
    avgAuto: 0,
    avgTele: 0,
    avgEnd: 0
};
let bBot2 = {
    avgAuto: 0,
    avgTele: 0,
    avgEnd: 0
};
let bBot3 = {
    avgAuto: 0,
    avgTele: 0,
    avgEnd: 0
};

const fns = {
    getMatchData: async (team: FIRSTTeam) => {
        const matchScouting = await team.getMatchScouting();
        if (matchScouting.isOk()) {
            const matchData = matchScouting.value;
            let avgAuto = 0;
            let avgTele = 0;
            let avgEnd = 0;
            const event = FIRSTEvent.current;
            const myTeam = FIRSTTeam.current;
            if (!event) return;
            if (!myTeam) return;

            const res = await event.getMatches();
            if (res.isErr()) return console.log(res.error);

            const matches = res.value;
            const data = await Promise.all(
                matches.map(async m => {
                    const teams = await m.getTeams();
                    if (teams.isErr()) throw teams.error;
                    const [r1, r2, r3,] = teams.value;
                    
                    let alliance: 'red' | 'blue';
                    if ([r1, r2, r3,].includes(myTeam)) {
                        alliance = 'red';
                    } else {
                        alliance = 'blue';
                    }

                    return {
                        match: m,
                        alliance,
                        trace: matchData.find(s => s.matchNumber === m.number && s.compLevel === m.compLevel)?.trace || [],
                    }
                })
            );

            for (const match of data) {
                const score = Trace.score.parse2024(match.trace, match.alliance);
                avgAuto += score.auto.total;
                avgTele += score.teleop.total;
                avgEnd += score.endgame.total;
            }

            avgAuto /= matchData.length;
            avgTele /= matchData.length;
            avgEnd /= matchData.length;
            return { avgAuto, avgTele, avgEnd };
        }
    },
    getAllianceData: async (...teams: (FIRSTTeam | undefined)[]) => {
        const data = await Promise.all(
            teams.filter(Boolean).map(fns.getMatchData)
        );

        const [d1, d2, d3] = data;
        if (d1) bBot1 = d1;
        else {
            bBot1 = {
                avgAuto: 0,
                avgTele: 0,
                avgEnd: 0
            };
        }
        if (d2) bBot2 = d2;
        else {
            bBot2 = {
                avgAuto: 0,
                avgTele: 0,
                avgEnd: 0
            };
        }
        if (d3) bBot3 = d3;
        else {
            bBot3 = {
                avgAuto: 0,
                avgTele: 0,
                avgEnd: 0
            };
        }
    }
};

$: fns.getAllianceData(team1, team2, team3);
//pull matches, match# + comp level, pull alliance
</script>

<TeamSelect bind:selected="{team1}"></TeamSelect>
<TeamSelect bind:selected="{team2}"></TeamSelect>
<TeamSelect bind:selected="{team3}"></TeamSelect>

<div class="card" style="width: 18rem;">
    div class="card-body">
    <h5 class="card-title">Alliance Summary</h5>
    <p class="card-text">
        Average auto score: {bBot1.avgAuto + bBot2.avgAuto + bBot3.avgAuto}
    </p>
    <p class="card-text">
        Average tele score: {bBot1.avgTele + bBot2.avgTele + bBot3.avgTele}
    </p>
    <p class="card-text">
        Average endgame score: {bBot1.avgEnd + bBot2.avgEnd + bBot3.avgEnd}
    </p>
    <p class="card-text"></p>
</div>
