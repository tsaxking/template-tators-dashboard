<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import TeamSelect from './TeamSelect.svelte';
import { createEventDispatcher } from 'svelte';

export let teams: [
    FIRSTTeam | undefined,
    FIRSTTeam | undefined,
    FIRSTTeam | undefined
] = [undefined, undefined, undefined];

const dispatch = createEventDispatcher();

const handleChange = () => dispatch('change', teams);
</script>

<TeamSelect
    on:change="{({ detail }) => {
        teams[0] = detail;
        handleChange();
    }}"
/>
<TeamSelect
    on:change="{({ detail }) => {
        teams[1] = detail;
        handleChange();
    }}"
/>
<TeamSelect
    on:change="{({ detail }) => {
        teams[2] = detail;
        handleChange();
    }}"
/>
