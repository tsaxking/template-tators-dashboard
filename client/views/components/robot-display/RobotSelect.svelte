<script lang="ts">
import { FIRSTEvent } from '../../../models/FIRST/event';
import { FIRSTTeam } from '../../../models/FIRST/team';
import Select from '../bootstrap/Select.svelte';

let value = '';
let options: string[] = [];

FIRSTTeam.on('select', (team: FIRSTTeam) => {
    value = team.tba.team_number.toString();
    team = team;
});

const update = async (teams: FIRSTTeam[]) => {
    options = teams.map(t => t.tba.team_number.toString());
};

FIRSTEvent.on('select', async (event: FIRSTEvent) => {
    update(await event.getTeams());

    event.on('update-teams', update);
});

const handleChange = async (e: any) => {
    const { detail: teamNumber } = e;
    const teams = await FIRSTEvent.current?.getTeams();
    if (teams) {
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
</script>

<Select bind:options bind:value on:change="{handleChange}"></Select>
