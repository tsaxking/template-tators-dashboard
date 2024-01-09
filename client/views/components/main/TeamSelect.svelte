<script lang="ts">
    import { FIRSTTeam } from "../../../models/FIRST/team";
    import { FIRSTEvent } from "../../../models/FIRST/event";
    import Select from '../bootstrap/Select.svelte';
    import { createEventDispatcher } from "svelte";

    let options: string[] = [];
    let value: string | undefined;
    export let selected: FIRSTTeam | undefined = undefined;

    FIRSTEvent.on('select', async (event: FIRSTEvent) => {
        const teams = await event.getTeams();
        options = teams.map(t => t.tba.team_number.toString());
    });

    const dispatch = createEventDispatcher();

    const handleChange = async (e: any) => {
        const { detail: teamNumber } = e;
        const team = (await FIRSTEvent.current.getTeams()).find(t => t.tba.team_number === +teamNumber);
        if (team) {
            dispatch('change', team);
            selected = team;
        }
    };

</script>

<Select bind:options bind:value on:change={handleChange} />