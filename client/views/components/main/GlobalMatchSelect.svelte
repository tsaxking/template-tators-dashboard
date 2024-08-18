<script lang="ts">
import { onMount } from 'svelte';
import { FIRSTEvent } from '../../../models/FIRST/event';
import { FIRSTMatch } from '../../../models/FIRST/match';
import Select from '../bootstrap/Select.svelte';

let options: string[] = [];
let value: string | undefined = FIRSTMatch.current?.tba.key;

const matchSelect = (match: FIRSTMatch) => {
    value = match.tba.key;
};

const eventSelect = async (event: FIRSTEvent) => {
    const res = await event.getMatches();
    if (res.isOk()) {
        const matches = res.value;
        options = matches.map(m => m.tba.key);
    } else {
        options = [];
    }
};

const handleChange = async (e: any) => {
    const { detail: matchKey } = e;
    const res = await FIRSTEvent.current?.getMatches();
    if (!res || res.isErr()) return;
    const matches = res.value;
    const match = matches.find(m => m.tba.key === matchKey);
    if (match) match.select();
};

onMount(() => {
    FIRSTMatch.on('select', matchSelect);
    FIRSTEvent.on('select', eventSelect);
    return () => {
        FIRSTMatch.off('select', matchSelect);
        FIRSTEvent.off('select', eventSelect);
    };
});
</script>

<Select bind:options bind:value on:change="{handleChange}" />
