<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { resolveAll } from '../../../../shared/check';

export let team: FIRSTTeam | undefined = undefined;
let scouts: { name: string; number: number }[] = [];

const fns = {
    getTeam: async (team: FIRSTTeam | undefined) => {
        scouts = [];
        if (!team) return;

        const scouting = await team.getMatchScouting();
        if (scouting.isErr()) return console.error(scouting.error);

        const _scouts: { [name: string]: number } = {};

        for (const m of scouting.value) {
            if (!_scouts[m.scoutName]) _scouts[m.scoutName] = 0;
            _scouts[m.scoutName]++;
        }

        for (const name in _scouts) {
            scouts.push({ name, number: _scouts[name] });
        }

        scouts = scouts.sort((a, b) => b.number - a.number);
    }
};

$: fns.getTeam(team);
</script>

<table class="table table-hover table-striped">
    <tbody>
        {#each scouts as scout}
            <tr>
                <td>{scout.name}</td>
                <td>{scout.number}</td>
            </tr>
        {/each}
    </tbody>
</table>
