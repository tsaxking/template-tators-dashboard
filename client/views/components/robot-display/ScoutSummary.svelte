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

        const accounts = resolveAll(
            await Promise.all(scouting.value.map(s => s.getScout()))
        );

        if (accounts.isErr()) return console.error(accounts.error);

        for (const m of scouting.value) {
            let s = m.scoutId || 'Unknown';
            const a = accounts.value.find(a => !!a && a.id === s);
            if (!a) continue;
            s = a.name || s;
        }
        console.clear();
        console.log({ scouts, scouting, accounts });

        scouts = scouts;
    }
};

$: fns.getTeam(team);
</script>

<table class="table table-hover table-striped">
    <tbody>
        {#each Object.keys(scouts) as scout}
            <tr>
                <td>{scout}</td>
                <td>{scouts[scout]}</td>
            </tr>
        {/each}
    </tbody>
</table>
