<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { resolveAll } from '../../../../shared/check';

export let team: FIRSTTeam | undefined = undefined;
let scouts: {
    [key: string]: number;
} = {};

const fns = {
    getTeam: async (team: FIRSTTeam | undefined) => {
        scouts = {};
        if (!team) return;

        const scouting = await team.getMatchScouting();
        if (scouting.isErr()) return console.error(scouting.error);

        for (const m of scouting.value) {
            if (!scouts[m.scoutName]) scouts[m.scoutName] = 0;
            scouts[m.scoutName]++;
        }

        scouts = scouts;
    }
};

$: fns.getTeam(team);
</script>

<table class="table table-hover table-striped">
    <tbody>
        {#each Object.keys(scouts).sort() as scout}
            <tr>
                <td>{scout}</td>
                <td>{scouts[scout]}</td>
            </tr>
        {/each}
    </tbody>
</table>
