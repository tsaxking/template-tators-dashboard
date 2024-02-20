<script lang="ts">
import RobotSelect from '../components/main/GlobalTeamSelect.svelte';
import { FIRSTTeam } from '../../models/FIRST/team';
import TeamMatchTable from '../components/robot-display/TeamMatchTable.svelte';
import TbaSummary from '../components/robot-display/TBASummary.svelte';
import TeamPictures from '../components/robot-display/TeamPictures.svelte';
import VelocityHistogram from '../components/robot-display/VelocityHistogram.svelte';
import { type TraceArray } from '../../../shared/submodules/tatorscout-calculations/trace';
import PitScouting from '../components/robot-display/PitScouting.svelte';
import { TeamComment } from '../../models/FIRST/team-comments';
import Modal from '../components/bootstrap/Modal.svelte';
import { FIRSTEvent } from '../../models/FIRST/event';

let team: FIRSTTeam;

FIRSTTeam.on('select', (t: FIRSTTeam) => (team = t));

let traces: TraceArray[] = [];
let comments: TeamComment[] = [];

const fns = {
    getTeam: async (t: FIRSTTeam) => {
        if (!t) return;
        const scouting = await t.getMatchScouting();
        if (scouting.isOk()) {
            traces = scouting.value.map(s => s.trace);
        }
    },

    getComments: async () => {
        const res = await TeamComment.fromTeam(team.number, FIRSTEvent.current);
        if (res.isOk()) {
            comments = res.value;
        }
    }
};

$: fns.getTeam(team);

FIRSTTeam.on('select', (t: FIRSTTeam) => (team = t));
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
        <div class="col-md-6">
            <div class="container-fluid">
                <div class="row mb-3">
                    <div class="col">
                        <TeamMatchTable {team} />
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col">
                        <VelocityHistogram {traces} />
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-6 mb-3">
            <div class="container-fluid">
                <div class="row mb-3">
                    <div class="col">
                        <TbaSummary {team} />
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col">
                        <TeamPictures {team} upload="{true}" />
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col">
                        <PitScouting {team} />
                    </div>
                </div>
                <div class="card" style="width: 18rem;">
                    <div class="card-header">Comments</div>
                    <div class="card-body">
                        <ul class="list-group list-group-flush">
                            {#each comments as comment}
                                <li>{comment.comment}</li>
                            {/each}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
