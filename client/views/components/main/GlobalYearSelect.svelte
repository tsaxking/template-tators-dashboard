<script lang="ts">
  import { years } from '../../../models/FIRST/model-builder';
  import { FIRSTYear } from '../../../models/FIRST/year';
  import Select from '../bootstrap/Select.svelte';

  export let allYears: string[] = years.map(y => y.year.toString());

  let value = '';

  FIRSTYear.on('select', (year: FIRSTYear) => {
    value = year.year.toString();
  });

  const handleChange = (e: CustomEvent) => {
    const { detail: year } = e;
    FIRSTYear.select(+year);
  };
</script>

<Select
  bind:options="{allYears}"
  bind:value
  on:change="{handleChange}" />
