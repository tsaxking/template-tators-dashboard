<script lang="ts">
    import { type MatchInterface } from '../../../models/FIRST/interfaces/match';
    import { Strategy } from '../../../models/FIRST/strategy';
    import Select from '../bootstrap/Select.svelte';
    import { onMount, createEventDispatcher } from 'svelte';

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
    let values: string[] = [];
    let value: string;

    $: options = strategies.map(s => s.name);
    $: values = strategies.map(s => s.id);

    const handleChange = async (e: CustomEvent) => {
        const { detail: strategyId } = e;
        const s = strategies.find(s => s.id === strategyId);
        value = strategyId;
        d('select', s);
    };

    const onNewSelect = async (s: Strategy) => {
        const info = await match.getInfo();
        if (info.isErr()) return console.error(info.error);
        if (info.value.id !== s.matchId && info.value.id !== s.customMatchId)
            return;
        strategies = [s, ...strategies];
    };

    onMount(() => {
        Strategy.on('new', onNewSelect);
        return () => {
            Strategy.off('new', onNewSelect);
        };
    });
</script>

<Select
    defaultValue="Select a strategy"
    bind:options
    bind:value
    bind:values
    on:change="{handleChange}"
/>
