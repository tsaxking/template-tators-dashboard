<script lang="ts">
    import { years } from '../../../models/FIRST/model-builder';
    import { FIRSTYear } from '../../../models/FIRST/year';
    import Select from '../bootstrap/Select.svelte';

    export let allYears: string[] = years.map(y => y.year.toString());

    FIRSTYear.on('create', (year) => {
        allYears = [...allYears, year];
    });

    FIRSTYear.on('delete', (year: FIRSTYear) => {
        allYears = allYears.filter(y => y !== year.year.toString());
    });

    let value = '';

    FIRSTYear.on('select', (year: FIRSTYear) => {
        value = year.year.toString();
    });

    const handleChange = (e: any) => {
        const { detail: year } = e;
        FIRSTYear.select(+year);
    }
</script>

<Select bind:options={allYears} bind:value on:change={handleChange}></Select>