<script lang="ts">
import RobotSelect from '../components/robot-display/RobotSelect.svelte';
import MatchViewer from '../components/robot-display/MatchViewer.svelte';
import { FIRSTTeam } from '../../models/FIRST/team';
import RobotBasics from '../components/robot-display/RobotBasics.svelte';
import Summary from '../components/robot-display/Summary.svelte';

let team: FIRSTTeam;

FIRSTTeam.on('select', (t: FIRSTTeam) => (team = t));
</script>

<!-- Select the robot here, this will trigger FIRSTTeam:select -->
<RobotSelect></RobotSelect>

<RobotBasics bind:team />
<Summary bind:team />

<!-- Basic info for team view. Pictures, team name, pit location, etc. -->

<!-- View all matches, filter, search, etc. -->
<MatchViewer bind:team />

<!-- Scouting, comments, etc -->
