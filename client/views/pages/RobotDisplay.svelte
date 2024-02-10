<script lang="ts">
import RobotSelect from '../components/main/GlobalTeamSelect.svelte';
import { FIRSTTeam } from '../../models/FIRST/team';
import TeamMatchTable from '../components/robot-display/TeamMatchTable.svelte';

let team: FIRSTTeam;

FIRSTTeam.on('select', (t: FIRSTTeam) => (team = t));
</script>

<div class="container">
    <div class="row mb-3">
        <div class="col-md-6">
            <RobotSelect></RobotSelect>
        </div>
        <div class="col-md-6">
            {#if team}
                {team.number} | {team.name}
            {/if}
        </div>
    </div>
    <hr>
    <div class="row">
        <div class="col-md-6">
            <TeamMatchTable {team} />
        </div>
    </div>
</div>