<script lang="ts">
    import { FIRSTTeam } from '../../../models/FIRST/team';
    import { MatchScouting } from '../../../models/FIRST/match-scouting';
    import MatchViewer from './MatchViewer.svelte';

    export let team: FIRSTTeam | undefined = undefined;
    export let matches: MatchScouting[] = [];
    export let preScouting: boolean = false;

    const getTeam = async (t?: FIRSTTeam) => {
        if (!t) return;
        matches = [];
        const matchesRes = preScouting
            ? await t.getPreScouting()
            : await t.getMatchScouting();
        if (matchesRes.isOk()) {
            matches = matchesRes.value
                .filter(m => m.preScouting === preScouting)
                .sort((a, b) => a.matchNumber - b.matchNumber)
                .filter(
                    (m, i, a) =>
                        a.findIndex(
                            _m =>
                                _m.matchNumber === m.matchNumber &&
                                    m.compLevel === _m.compLevel
                        ) === i
                )
                .reverse();
        }
    };

    $: getTeam(team);
</script>

<div class="d-flex scroll-x">
    {#if !!team}
        {#each matches as match (match.id)}
            <div class="mx-5">
                <MatchViewer
                    {match}
                    {team} />
            </div>
        {/each}
    {/if}
</div>
