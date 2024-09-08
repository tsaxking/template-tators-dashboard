<script lang="ts">
import { FIRSTEvent } from '../../../models/FIRST/event';
import { type MatchInterface } from '../../../models/FIRST/interfaces/match';
import { FIRSTMatch } from '../../../models/FIRST/match';
import { Strategy } from '../../../models/FIRST/strategy';
import Select from '../bootstrap/Select.svelte';
import { createEventDispatcher, onMount } from 'svelte';

const d = createEventDispatcher();

export let match: MatchInterface;

let strategies: Strategy[] = [];

$: getStrategies(match);

const getStrategies = async (match: MatchInterface) => {
    const res = await match.getStrategies();
    if (res.isErr()) {
        return console.error(res.error);
    }

    strategies = res.value;
};

let options: string[] = [];
let value: string | undefined = strategies[0]?.name;

$: options = strategies.map(s => s.name);
$: value = strategies[0]?.name;

if (strategies[0]) d('select', strategies[0]);

const handleChange = async (e: CustomEvent) => {
    const { detail: strategyName } = e;
    const strategy = strategies.find(s => s.name === strategyName);
    if (strategy) d('select', strategy);
};

onMount(() => {});
</script>

<Select bind:options bind:value on:change="{handleChange}" />
