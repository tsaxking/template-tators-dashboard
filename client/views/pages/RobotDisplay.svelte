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
import PracticeMatches from '../components/robot-display/PracticeMatches.svelte';
import HorizontalMatchViewer from '../components/robot-display/HorizontalMatchViewer.svelte';
import ScoutSummary from '../components/robot-display/ScoutSummary.svelte';
import { onMount } from 'svelte';
import Progress from '../components/robot-display/Progress.svelte';

let team: FIRSTTeam | undefined = undefined;

FIRSTTeam.on('select', t => (team = t));

let traces: TraceArray[] = [];

const fns = {
    getTeam: async (t?: FIRSTTeam) => {
        console.log('Loading: ', t);
        if (!t) return (traces = []);
        traces = [];
        const scouting = await t.getMatchScouting();
        if (scouting.isOk()) {
            traces = scouting.value.map(s => s.trace);
        }
    }
};

$: fns.getTeam(team);
onMount(() => (team = team));

MatchScouting.on('new', m => {
    if (!team) return (traces = []);
    if (m.team === team.number) {
        team = team; // reset view
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
        <DashboardCard title="Summary" expandable="{true}">
            <TbaSummary {team} />
        </DashboardCard>
        <DashboardCard title="Comments" scroll="{true}" expandable="{true}">
            <TeamCommentSummary {team} />
        </DashboardCard>
        <DashboardCard title="Pictures" scroll="{true}">
            <TeamPictures {team} upload="{true}" />
        </DashboardCard>
        <DashboardCard title="Match Viewer" expandable="{true}" scroll="{true}">
            <HorizontalMatchViewer {team} preScouting="{false}" />
        </DashboardCard>
        <DashboardCard
            title="Event Summary"
            scroll="{true}"
            expandable="{true}"
        >
            <EventSummaryChart {team} />
        </DashboardCard>
        <DashboardCard
            title="Matches Summary"
            scroll="{true}"
            expandable="{true}"
        >
            <MatchesSummaryChart {team} />
        </DashboardCard>
        <DashboardCard title="Progress" expandable="{true}">
            <Progress {team} />
        </DashboardCard>
        <DashboardCard title="Matches" scroll="{true}" expandable="{true}">
            <TeamMatchTable {team} />
        </DashboardCard>
        <DashboardCard title="Action Heatmap" expandable="{true}">
            <ActionHeatmap {team} />
        </DashboardCard>
        <DashboardCard title="Velocity Histogram" expandable="{true}">
            <VelocityHistogram {traces} />
        </DashboardCard>
        <PitScouting {team} />
        <DashboardCard
            title="Checks Summary"
            scroll="{true}"
            expandable="{true}"
        >
            <ChecksSummary {team} />
        </DashboardCard>
        <DashboardCard
            title="Practice Matches"
            scroll="{true}"
            expandable="{true}"
        >
            <PracticeMatches {team} />
        </DashboardCard>
        <DashboardCard
            title="Scouts Summary"
            scroll="{true}"
            expandable="{true}"
        >
            <ScoutSummary {team} />
        </DashboardCard>
        <DashboardCard title="Pre Scouting" scroll="{true}" expandable="{true}">
            <HorizontalMatchViewer {team} preScouting="{true}" />
        </DashboardCard>
    </div>
</div>
