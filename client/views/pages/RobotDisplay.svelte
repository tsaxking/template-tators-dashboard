<script lang="ts">
import RobotSelect from '../components/main/GlobalTeamSelect.svelte';
import { FIRSTTeam } from '../../models/FIRST/team';
import TeamMatchTable from '../components/robot-display/TeamMatchTable.svelte';
import TbaSummary from '../components/robot-display/TBASummary.svelte';
import TeamPictures from '../components/robot-display/TeamPictures.svelte';
import VelocityHistogram from '../components/robot-display/VelocityHistogram.svelte';
import { type TraceArray } from '../../../shared/submodules/tatorscout-calculations/trace';
import PitScouting from '../components/robot-display/PitScouting.svelte';

import DashboardCard from '../components/main/DashboardCard.svelte';
import EventSummaryChart from '../components/robot-display/EventSummaryChart.svelte';
import MatchesSummaryChart from '../components/robot-display/MatchesSummaryChart.svelte';
import ActionHeatmap from '../components/robot-display/ActionHeatmap.svelte';
import TeamCommentSummary from '../components/robot-display/TeamCommentSummary.svelte';
import { MatchScouting } from '../../models/FIRST/match-scouting';
import ChecksSummary from '../components/robot-display/ChecksSummary.svelte';

let team: FIRSTTeam;

FIRSTTeam.on('select', (t: FIRSTTeam) => (team = t));

let traces: TraceArray[] = [];

const fns = {
    getTeam: async (t: FIRSTTeam) => {
        if (!t) return;
        const scouting = await t.getMatchScouting();
        if (scouting.isOk()) {
            traces = scouting.value.map(s => s.trace);
        }
    }
};

$: fns.getTeam(team);

FIRSTTeam.on('select', (t: FIRSTTeam) => (team = t));

MatchScouting.on('new', (m) => {
    if (m.team === team.number) {
        fns.getTeam(team);
    }
});
</script>

<div class="container-fluid">
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
        <DashboardCard title="Summary" scroll="{true}">
            <TbaSummary {team} />
        </DashboardCard>
        <DashboardCard title="Comments" scroll="{true}">
            <TeamCommentSummary {team} />
        </DashboardCard>
        <DashboardCard title="Pictures" scroll="{true}">
            <TeamPictures {team} upload="{true}" />
        </DashboardCard>
        <DashboardCard title="Event Summary" scroll="{true}">
            <EventSummaryChart {team} />
        </DashboardCard>
        <DashboardCard title="Matches Summary" scroll="{true}">
            <MatchesSummaryChart {team} />
        </DashboardCard>
        <DashboardCard title="Matches" scroll="{true}">
            <TeamMatchTable {team} />
        </DashboardCard>
        <DashboardCard title="Action Heatmap">
            <ActionHeatmap {team} />
        </DashboardCard>
        <DashboardCard title="Velocity Histogram">
            <VelocityHistogram {traces} />
        </DashboardCard>
        <DashboardCard title="Pit Scouting" scroll="{true}">
            <PitScouting {team} />
        </DashboardCard>
        <DashboardCard title="Checks Summary" scroll="{true}">
            <ChecksSummary {team} />
        </DashboardCard>
    </div>
</div>
