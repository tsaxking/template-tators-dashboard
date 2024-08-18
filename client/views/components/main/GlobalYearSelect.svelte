<script lang="ts">
import { onMount } from 'svelte';
import { years } from '../../../models/FIRST/model-builder';
import { FIRSTYear } from '../../../models/FIRST/year';
import Select from '../bootstrap/Select.svelte';

export let allYears: string[] = years.map(y => y.year.toString());

let value = '';

const yearSelect = (year: FIRSTYear) => {
    value = year.year.toString();
};

const handleChange = (e: any) => {
    const { detail: year } = e;
    FIRSTYear.select(+year);
};

onMount(() => {
    FIRSTYear.on('select', yearSelect);
    return () => {
        FIRSTYear.off('select', yearSelect);
    };
});
</script>

<Select bind:options="{allYears}" bind:value on:change="{handleChange}"
></Select>
