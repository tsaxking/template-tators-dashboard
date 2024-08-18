<script lang="ts">
import { onMount } from 'svelte';
import { FIRSTEvent } from '../../../models/FIRST/event';
import { FIRSTTeam } from '../../../models/FIRST/team';
import Select from '../bootstrap/Select.svelte';

let value = '';
let options: string[] = [];

const teamSelect = (team: FIRSTTeam | undefined) => {
    if (!team) return;
    value = team.tba.team_number.toString();
};

const update = async (teams: FIRSTTeam[]) => {
    options = teams.map(t => t.tba.team_number.toString());
};

const eventSelect = async (event: FIRSTEvent) => {
    const teams = await event.getTeams();
    if (teams.isOk()) {
        update(teams.value);
    } else {
        options = [];
    }

    event.on('update-teams', update);
};

const handleChange = async (e: any) => {
    const { detail: teamNumber } = e;
    const res = await FIRSTEvent.current?.getTeams();
    if (res && res.isOk()) {
        const teams = res.value;
        const team = teams.find(t => t.tba.team_number === +teamNumber);
        if (team) {
            team.select();
        } else {
            console.error(`Team ${teamNumber} not found`);
        }
    } else {
        console.error(`Teams not found`);
    }
};

onMount(() => {
    FIRSTTeam.on('select', teamSelect);
    FIRSTEvent.on('select', eventSelect);
    return () => {
        FIRSTTeam.off('select', teamSelect);
        FIRSTEvent.off('select', eventSelect);
    };
});
</script>

<Select bind:options bind:value on:change="{handleChange}"></Select>
