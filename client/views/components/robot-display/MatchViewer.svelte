<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';

export let team: FIRSTTeam | undefined = undefined;
</script>

<p>{team?.tba.team_number}</p>
