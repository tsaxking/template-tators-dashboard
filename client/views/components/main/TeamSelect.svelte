<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { FIRSTEvent } from '../../../models/FIRST/event';
import Select from '../bootstrap/Select.svelte';
import { createEventDispatcher } from 'svelte';

let options: string[] = [];
let value: string | undefined;
export let selected: FIRSTTeam | undefined = undefined;

FIRSTEvent.on('select', async (event: FIRSTEvent) => {
    const result = await event.getTeams();
    if (result.isOk()) {
        const teams = result.value;
        options = teams.map(t => t.tba.team_number.toString());
    } else {
        options = [];
    }
});

const dispatch = createEventDispatcher();

const handleChange = async (e: any) => {
    const { detail: teamNumber } = e;
    const result = await FIRSTEvent.current.getTeams();
    if (result.isErr()) return;
    const teams = result.value;
    const team = teams.find(
        t => t.tba.team_number === +teamNumber
    );
    if (team) {
        dispatch('change', team);
        selected = team;
    }
};
</script>

<Select bind:options bind:value on:change="{handleChange}" />
