<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { MatchScouting } from '../../../models/FIRST/match-scouting';
import MatchViewer from './MatchViewer.svelte';

export let team: FIRSTTeam | undefined = undefined;
export let matches: MatchScouting[] = [];

const fns = {
    getTeam: async (t?: FIRSTTeam) => {
        if (!t) return;
        const matchesRes = await t.getMatchScouting();
        if (matchesRes.isOk()) {
            matches = matchesRes.value;
        }
    }
};

$: fns.getTeam(team);
</script>

<div class="d-flex scroll-x">
    {#if !!team}
        {#each matches as match}
            <div class="mx-5">
                <MatchViewer {team} {match} />
            </div>
        {/each}
    {/if}
</div>
