<script lang="ts">
  import { capitalize, fromCamelCase } from '../../../../shared/text';
  import { checkRanks, rankColor } from '../../../models/FIRST/match-scouting';
  import { FIRSTTeam } from '../../../models/FIRST/team';

  export let team: FIRSTTeam | undefined = undefined;
  let checks: {
    [key: string]: {
      color: string;
      number: number;
    };
  } = {};

  const fns = {
    get: async (team?: FIRSTTeam) => {
      checks = {};
      if (!team) return;
      const scouting = await team.getMatchScouting();

      if (scouting.isOk()) {
        const allChecks = scouting.value.map(s => s.checks).flat();

        for (const str of allChecks) {
          if (checks[str]) {
            checks[str].number++;
          } else {
            checks[str] = {
              color: rankColor[checkRanks[str]].toString('rgb'),
              number: 1
            };
          }
        }
      }
    }
  };

  $: fns.get(team);
</script>

<ul class="list-group">
  {#each Object.keys(checks) as key}
    {#if checks[key].number > 0}
      <li class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span style:color="{checks[key].color}">
          {capitalize(fromCamelCase(key))}
        </span>
        <span
          style:color="{checks[key].color}"
          class=""
        >{checks[key].number}</span
        >
      </li>
    {/if}
  {/each}
</ul>
