<script lang="ts">
    import RobotSelect from "../components/robot-display/RobotSelect.svelte";
    import MatchViewer from "../components/robot-display/MatchViewer.svelte";
    import { FIRSTTeam } from '../../models/FIRST/team';

    let currentTeam: FIRSTTeam;

    FIRSTTeam.on('select', (t: FIRSTTeam) => currentTeam = t);

</script>

<!-- Select the robot here, this will trigger FIRSTTeam:select -->
<RobotSelect></RobotSelect>


<!-- Basic info for team view. Pictures, team name, pit location, etc. -->



<!-- View all matches, filter, search, etc. -->
<MatchViewer></MatchViewer>



<!-- Scouting, comments, etc -->