<script lang="ts">
import RobotSelect from '../components/main/GlobalTeamSelect.svelte';
import { FIRSTTeam } from '../../models/FIRST/team';
import TeamMatchTable from '../components/robot-display/TeamMatchTable.svelte';
import TbaSummary from '../components/robot-display/TBASummary.svelte';
import TeamPictures from '../components/robot-display/TeamPictures.svelte';
import VelocityHistogram from '../components/robot-display/VelocityHistogram.svelte';
import { type TraceArray } from '../../../shared/submodules/tatorscout-calculations/trace';

let team: FIRSTTeam;

FIRSTTeam.on('select', (t: FIRSTTeam) => (team = t));

let traces: TraceArray[] = [];

const fns = {
    getTeam: async (t: FIRSTTeam) => {
        const scouting = await t.getMatchScouting();
        if (scouting.isOk()) {
            traces = scouting.value.map(s => s.trace);
        }
    }
};

$: fns.getTeam(team);
</script>

<div class="container">
    <div class="row mb-3">
        <div class="col-md-6">
            <RobotSelect></RobotSelect>
        </div>
        <div class="col-md-6">
            <h3>
                {#if team}
                    {team.number} | {team.name}
                {/if}
            </h3>
        </div>
    </div>
    <hr />
    <div class="row">
        <div class="col-md-6 col-lg-4">
            <TeamMatchTable {team} />
        </div>
        <div class="col-md-6 col-lg-4">
            <TbaSummary {team} />
        </div>
        <div class="col-md-6 col-lg-4">
            <TeamPictures {team} upload="{true}" />
        </div>
        <div class="col-md-6 col-lg-4">
            <VelocityHistogram {traces} />
        </div>
    </div>
</div>
