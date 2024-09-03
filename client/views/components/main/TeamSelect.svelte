<script lang="ts">
  import { FIRSTTeam } from '../../../models/FIRST/team';
  import { FIRSTEvent } from '../../../models/FIRST/event';
  import Select from '../bootstrap/Select.svelte';
  import { createEventDispatcher } from 'svelte';

  let options: string[] = [];
  let values: string[] = [];
  let value: string | undefined;
  export let selected: FIRSTTeam | undefined = undefined;

  FIRSTEvent.on('select', async (event: FIRSTEvent) => {
    const result = await event.getTeams();
    if (result.isOk()) {
      const teams = result.value;
      values = teams.map(t => t.number.toString());
      options = teams.map(t => `${t.tba.team_number.toString()} | ${t.name}`);
    } else {
      options = [];
      values = [];
    }
  });

  const dispatch = createEventDispatcher();

  const handleChange = async (e: CustomEvent) => {
    const { detail: teamNumber } = e;
    const result = await FIRSTEvent.current?.getTeams();
    if (!result || result.isErr()) return;
    const teams = result.value;
    const team = teams.find(t => t.tba.team_number === +teamNumber);
    if (team) {
      dispatch('change', team);
      selected = team;
    }
  };
</script>

<Select
  bind:options
  bind:value
  bind:values
  on:change="{handleChange}" />
