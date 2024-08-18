<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { FIRSTEvent } from '../../../models/FIRST/event';
import Select from '../bootstrap/Select.svelte';
import { createEventDispatcher, onMount } from 'svelte';

let options: string[] = [];
let values: string[] = [];
let value: string | undefined;
export let selected: FIRSTTeam | undefined = undefined;

const eventSelect = async (event: FIRSTEvent) => {
    const result = await event.getTeams();
    if (result.isOk()) {
        const teams = result.value;
        values = teams.map(t => t.number.toString());
        options = teams.map(t => `${t.tba.team_number.toString()} | ${t.name}`);
    } else {
        options = [];
        values = [];
    }
};

const d = createEventDispatcher();

const handleChange = async (e: any) => {
    const { detail: teamNumber } = e;
    const result = await FIRSTEvent.current?.getTeams();
    if (!result || result.isErr()) return;
    const teams = result.value;
    const team = teams.find(t => t.tba.team_number === +teamNumber);
    if (team) {
        d('change', team);
        selected = team;
    }
};

onMount(() => {
    FIRSTEvent.on('select', eventSelect);
    return () => {
        FIRSTEvent.off('select', eventSelect);
    };
});
</script>

<Select bind:options bind:value bind:values on:change="{handleChange}" />
