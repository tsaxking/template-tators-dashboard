<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';

export let team: FIRSTTeam;
</script>

<div class="container-fluid">
    <div class="row">
        <div class="col-6">
            <dl>
                <dt>Team Number</dt>
                <dd>{team?.tba.team_number || ''}</dd>
                <dt>Team Name</dt>
                <dd>{team?.tba.nickname || ''}</dd>
                <dt>Location</dt>
                <dd>
                    {team?.tba.city
                        ? team?.tba.city +
                          ', ' +
                          team?.tba.state_prov +
                          ', ' +
                          team?.tba.country
                        : ''}
                </dd>
                <dt>Website</dt>
                <dd>
                    <a href="{team?.tba.website}" target="_blank"
                        >{team?.tba.website || ''}</a
                    >
                </dd>
            </dl>
        </div>
        <!-- Basic information from pit scouting -->
        <!-- <div class="col-6">
            <dl>
                <dt>Robot Name</dt>
                <dd>{team.robot.name}</dd>
                <dt>Robot Weight</dt>
                <dd>{team.robot.weight} lbs</dd>
                <dt>Robot Height</dt>
                <dd>{team.robot.height} in</dd>
                <dt>Robot Width</dt>
                <dd>{team.robot.width} in</dd>
                <dt>Robot Length</dt>
                <dd>{team.robot.length} in</dd>
            </dl>
        </div> -->
    </div>
</div>
