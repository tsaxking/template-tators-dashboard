<script lang="ts">
import { FIRSTEvent } from '../../../models/FIRST/event';
import { FIRSTMatch } from '../../../models/FIRST/match';
import { Strategy } from '../../../models/FIRST/strategy';
import { onMount } from 'svelte';
import { prompt } from '../../../utilities/notifications';
// move ../Strategy.svelte into this director
// Use that Strategy.svelte in pit and main dashboard, so you don't have to write the code twice
// Move RobotCard into view/components/strategy
// Utilize the components folder and separate the components into their own files
// Build a countdown timer component in /view/components/bootstrap then gimme the code

let matches: FIRSTMatch[] = [];
let strategies: Strategy[] = [];
let strategy: Strategy | undefined;

const getMatches = async (event: FIRSTEvent) => {
    const res = await event.getMatches();
    if (res.isErr()) {
        console.error(res.error);
        return;
    }

    matches = res.value;
};

const newStrategy = async () => {
    let name = await prompt('Strategy Name');
    if (!name) return;
    // use prompt to get the strategy name
    // use Strategy.new();
};

const getStrategies = async (match: FIRSTMatch) => {
    const res = await match.getStrategies();
    if (res.isErr()) {
        console.error(res.error);
        return;
    }

    strategies = res.value;
};

onMount(() => {
    FIRSTEvent.on('select', getMatches);
    if (FIRSTEvent.current) getMatches(FIRSTEvent.current);

    return () => {
        FIRSTEvent.off('select', getMatches);
    };
});
</script>

<!-- {#if strategy}
    <Whiteboard {strategy} />
{/if} -->

<button on:click="{newStrategy}">button</button>
