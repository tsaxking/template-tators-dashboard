<script lang="ts">
    import { FIRSTTeam } from "../../../models/FIRST/team";
    import { FIRSTEvent } from "../../../models/FIRST/event";
    import Select from '../bootstrap/Select.svelte';

    let options: string[] = [];
    let value: string | undefined = FIRSTTeam.current?.tba.team_number.toString();

    FIRSTTeam.on('select', (team: FIRSTTeam) => {
        value = team.tba.team_number.toString();
    });

    FIRSTEvent.on('select', async (event: FIRSTEvent) => {
        const teams = await event.getTeams();
        options = teams.map(t => t.tba.team_number.toString());
    });

    const handleChange = async (e: any) => {
        const { detail: teamNumber } = e;
        const team = (await FIRSTEvent.current.getTeams()).find(t => t.tba.team_number === +teamNumber);
        if (team) team.select();
        else console.error(`Team ${teamNumber} not found`);
    };

</script>

<Select bind:options bind:value on:change={handleChange} />