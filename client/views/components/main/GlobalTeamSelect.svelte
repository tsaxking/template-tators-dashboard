<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { FIRSTEvent } from '../../../models/FIRST/event';
import Select from '../bootstrap/Select.svelte';

let options: string[] = [];
let values: string[] = [];
let value: string | undefined = FIRSTTeam.current?.number.toString();
let event: FIRSTEvent | undefined = FIRSTEvent.current;

const setOptions = async (event: FIRSTEvent | undefined) => {
    if (!event) {
        options = [];
        values = [];
        return;
    }
    const res = await event.getTeams();
    if (res.isOk()) {
        const teams = res.value;
        values = teams.map(t => t.number.toString());
        options = teams.map(t => `${t.number.toString()} | ${t.name}`);
    } else {
        values = [];
        options = [];
    }
};
const handleChange = async (e: CustomEvent) => {
    const { detail: teamNumber } = e;
    const res = await FIRSTEvent.current?.getTeams();
    if (!res) return;
    if (res.isErr()) return;
    const teams = res.value;
    const team = teams.find(t => t.number === +teamNumber);
    if (team) team.select();
    else console.error(`Team ${teamNumber} not found`);
};

FIRSTTeam.on('select', (team: FIRSTTeam | undefined) => {
    if (!team) return (value = undefined);
    value = team.number.toString();
});

$: {
    setOptions(event);
}

FIRSTEvent.on('select', e => {
    event = e;
});
</script>

<Select bind:options bind:value bind:values on:change="{handleChange}" />
