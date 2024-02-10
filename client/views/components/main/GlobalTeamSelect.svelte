<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { FIRSTEvent } from '../../../models/FIRST/event';
import Select from '../bootstrap/Select.svelte';

let options: string[] = [];
let value: string | undefined = FIRSTTeam.current?.number.toString();
let event: FIRSTEvent | undefined = FIRSTEvent.current;

const fns = {
    setOptions: async (event: FIRSTEvent) => {
        if (!event) return (options = []);
        const res = await event.getTeams();
        if (res.isOk()) {
            const teams = res.value;
            options = teams.map(t => t.number.toString());
        } else {
            options = [];
        }
    },
    handleChange: async (e: any) => {
        const { detail: teamNumber } = e;
        const res = await FIRSTEvent.current.getTeams();
        if (res.isErr()) return;
        const teams = res.value;
        const team = teams.find(t => t.tba.team_number === +teamNumber);
        if (team) team.select();
        else console.error(`Team ${teamNumber} not found`);
    }
};

FIRSTTeam.on('select', (team: FIRSTTeam | undefined) => {
    if (!team) return (value = undefined);
    value = team.number.toString();
});

$: {
    fns.setOptions(event);
}

FIRSTEvent.on('select', e => {
    event = e;
    value = undefined;
});
</script>

<Select bind:options bind:value on:change="{fns.handleChange}" />
