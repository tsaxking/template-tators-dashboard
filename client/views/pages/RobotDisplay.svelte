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

    export let loading: boolean;

    let team: FIRSTTeam | undefined = undefined;

    let traces: TraceArray[] = [];

    const getTeam = async (t?: FIRSTTeam) => {
        team = t;
        if (!t) {
            traces = [];
            loading = false;
            return;
        }
        traces = [];
        const scouting = await t.getMatchScouting();
        if (scouting.isOk()) {
            traces = scouting.value.map(s => s.trace);
        }
        loading = false;
    };

    onMount(() => {
        FIRSTTeam.on('select', getTeam);
        getTeam(FIRSTTeam.current);
        return () => {
            FIRSTTeam.off('select', getTeam);
            team = undefined;
            loading = true;
        };
    });

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
            <RobotSelect />
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
        <DashboardCard
            id="tba-summary"
            expandable="{true}"
            title="Summary">
            <TbaSummary {team} />
        </DashboardCard>
        <DashboardCard
            id="team-comment-summary"
            expandable="{true}"
            scroll="{true}"
            title="Comments"
        >
            <TeamCommentSummary {team} />
        </DashboardCard>
        <DashboardCard
            id="team-pictures"
            scroll="{true}"
            title="Pictures">
            <TeamPictures
                {team}
                upload="{true}" />
        </DashboardCard>
        <DashboardCard
            id="horizontal-match-viewer"
            expandable="{true}"
            scroll="{true}"
            title="Match Viewer"
        >
            <HorizontalMatchViewer
                preScouting="{false}"
                {team} />
        </DashboardCard>
        <DashboardCard
            id="event-summary-chart"
            expandable="{true}"
            scroll="{true}"
            title="Event Summary"
        >
            <EventSummaryChart {team} />
        </DashboardCard>
        <DashboardCard
            id="matches-summary-chart"
            expandable="{true}"
            scroll="{true}"
            title="Matches Summary"
        >
            <MatchesSummaryChart {team} />
        </DashboardCard>
        <DashboardCard
            id="team-progress"
            expandable="{true}"
            title="Progress">
            <Progress {team} />
        </DashboardCard>
        <DashboardCard
            id="team-match-table"
            expandable="{true}"
            scroll="{true}"
            title="Matches"
        >
            <TeamMatchTable {team} />
        </DashboardCard>
        <DashboardCard
            id="action-heatmap"
            expandable="{true}"
            title="Action Heatmap"
        >
            <ActionHeatmap {team} />
        </DashboardCard>
        <DashboardCard
            id="velocity-histogram"
            expandable="{true}"
            title="Velocity Histogram"
        >
            <VelocityHistogram {traces} />
        </DashboardCard>
        <PitScouting {team} />
        <DashboardCard
            id="checks-summary"
            expandable="{true}"
            scroll="{true}"
            title="Checks Summary"
        >
            <ChecksSummary {team} />
        </DashboardCard>
        <DashboardCard
            id="practice-matches"
            expandable="{true}"
            scroll="{true}"
            title="Practice Matches"
        >
            <PracticeMatches {team} />
        </DashboardCard>
        <DashboardCard
            id="scout-summary"
            expandable="{true}"
            scroll="{true}"
            title="Scouts Summary"
        >
            <ScoutSummary {team} />
        </DashboardCard>
        <DashboardCard
            id="horizontal-match-viewer"
            expandable="{true}"
            scroll="{true}"
            title="Pre Scouting"
        >
            <HorizontalMatchViewer
                preScouting="{true}"
                {team} />
        </DashboardCard>
    </div>
</div>
