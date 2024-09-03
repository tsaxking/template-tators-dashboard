<script lang="ts">
  import { FIRSTEvent } from './../../../models/FIRST/event';
  import { FIRSTMatch } from './../../../models/FIRST/match';
  import { Strategy } from '../../../models/FIRST/strategy';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { alert, prompt } from '../../../utilities/notifications';
  import { FIRSTTeam } from '../../../models/FIRST/team';

  let loading: boolean = true;

  let matches: FIRSTMatch[] = [];
  let match: FIRSTMatch | undefined;
  let strategies: Strategy[] = [];
  let strategy: Strategy | undefined;
  let blueTeams: { team: FIRSTTeam; checks: boolean[] }[] = [];
  let redTeams: { team: FIRSTTeam; checks: boolean[] }[] = [];

  let checks = ['Check 1', 'Check 2', 'Check 3', 'Check 4', 'Check 5'];

  const getMatches = async (event: FIRSTEvent) => {
    const res = await event.getMatches();
    if (res.isErr()) {
      console.error(res.error);
      return;
    }

    matches = res.value;
    if (matches.length > 0) {
      match = matches.find(m => m.hasTeam(2122)); // Set the first match as the default selected
      if (!match) match = matches[0]; // this should never happen
      await Promise.all([updateTeams(match), getStrategies(match)]);
    }
    loading = false;
  };

  const updateTeams = async (match: FIRSTMatch | undefined) => {
    if (!match) return;
    const teamsResult = await match.getTeams();
    if (teamsResult.isErr()) {
      console.error(teamsResult.error);
      return;
    }
    const teams = teamsResult.value.filter(Boolean);
    redTeams = teams
      .slice(0, 3)
      .map(team => ({ team, checks: checks.map(() => false) }));
    blueTeams = teams
      .slice(3, 6)
      .map(team => ({ team, checks: checks.map(() => false) }));
  };

  const newStrategy = async () => {
    if (!match) return alert('No match selected');
    let name = await prompt('Strategy Name');
    if (!name) return;

    const info = await match.getInfo();
    if (info.isErr()) return console.error(info.error);

    Strategy.new({
      name,
      matchId: info.value.id,
      customMatchId: undefined,
      comment: '',
      checks: ''
    });
  };

  const getStrategies = async (match: FIRSTMatch) => {
    const res = await match.getStrategies();
    if (res.isErr()) {
      console.error(res.error);
      return;
    }

    strategies = res.value;
  };

  // Add a new check
  const addCheck = async () => {
    const newCheck = await prompt('Enter the name of the new check:');
    if (newCheck && !checks.includes(newCheck)) {
      checks = [...checks, newCheck];
      redTeams = redTeams.map(team => ({
        ...team,
        checks: [...team.checks, false]
      }));
      blueTeams = blueTeams.map(team => ({
        ...team,
        checks: [...team.checks, false]
      }));
    }
  };

  // Remove an existing check
  const removeCheck = async (checkToRemove: string) => {
    const index = checks.indexOf(checkToRemove);
    if (index > -1) {
      checks = checks.filter(check => check !== checkToRemove);
      redTeams = redTeams.map(team => ({
        ...team,
        checks: team.checks.filter((_, i) => i !== index)
      }));
      blueTeams = blueTeams.map(team => ({
        ...team,
        checks: team.checks.filter((_, i) => i !== index)
      }));
    }
  };

  onMount(() => {
    FIRSTEvent.on('select', getMatches);

    if (FIRSTEvent.current) {
      getMatches(FIRSTEvent.current);
    }

    return () => {
      FIRSTEvent.off('select', getMatches);
    };
  });
</script>

{#if loading}
  <div
    class="loading"
    transition:fade>
    <div class="text-center">
      <div
        class="spinner-border"
        role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Loading teams</p>
    </div>
  </div>
{:else}
  <div class="container-fluid vh-100">
    <!-- Control bar -->
    <div class="row mb-3">
      <div class="col-md-3">
        <select
          class="form-select"
          bind:value="{match}"
          on:change="{() => updateTeams(match)}"
        >
          {#each matches as match}
            <option value="{match}">
              {match.compLevel === 'qm'
                ? 'Qualifier'
                : match.compLevel === 'sf'
                ? 'Semifinal'
                : 'Final'}
              {match.number}
            </option>
          {/each}
        </select>
      </div>
      <div class="col-md-3">
        <select
          class="form-select"
          bind:value="{strategy}">
          {#each strategies as strat}
            <option value="{strat}">{strat.name}</option>
          {/each}
        </select>
      </div>
      <div class="col-md-3">
        <button
          class="btn btn-primary"
          on:click="{newStrategy}"
        >New Strategy</button
        >
      </div>
    </div>

    <!-- Teams -->
    <div class="row mb-3 mx-1 h-auto">
      <div class="col-md-6 bg-danger border rounded">
        <div class="d-flex flex-column h-100 p-3">
          {#each redTeams as { team, checks }}
            <div class="row align-items-center bg-gray-light rounded mb-2"
            >
              <div class="col">
                <h3>{team.name}</h3>
                <p>{team.number}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <div class="col-md-6 bg-primary border rounded">
        <div class="d-flex flex-column h-100 p-3">
          {#each blueTeams as { team, checks }}
            <div class="row align-items-center bg-gray-light rounded mb-2"
            >
              <div class="col">
                <h3>{team.name}</h3>
                <p>{team.number}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Add/Remove Checks Section -->
    <div class="row mb-3 mx-1">
      <div class="col-md-12 border rounded border-light-subtle p-3">
        <h1>Manage Checks</h1>
        <p>Add or remove possible checks for each team.</p>
        <button
          class="btn btn-success"
          on:click="{addCheck}"
        >Add Check</button
        >
        <div class="mt-3">
          {#each checks as check}
            <div class="d-flex align-items-center mb-2">
              <span class="me-auto">{check}</span>
              <button
                class="btn btn-danger btn-sm"
                on:click="{() => removeCheck(check)}"
              >Remove</button
              >
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Checks -->
    <div class="row mb-3 mx-1">
      <div class="col-md-6 bg-dark border rounded p-3">
        <div class="d-flex flex-column">
          {#each redTeams as { team, checks: teamChecks }}
            <div class="bg-gray-light rounded mb-2 p-3">
              <h5 class="m-0">{team.number} {team.name}</h5>
              <ul>
                {#each teamChecks as checked, index}
                  <li>
                    <input
                      type="checkbox"
                      bind:checked="{teamChecks[index]}"
                      on:click="{() =>
                        console.log(
                          checks[index],
                          teamChecks[index],
                          team.number
                        )}"
                    />
                    <label>{checks[index]}</label>
                  </li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>
      </div>

      <div class="col-md-6 bg-dark border rounded p-3">
        <div class="d-flex flex-column">
          {#each blueTeams as { team, checks: teamChecks }}
            <div class="bg-gray-light rounded mb-2 p-3">
              <h5 class="m-0">{team.number} {team.name}</h5>
              <ul>
                {#each teamChecks as checked, index}
                  <li>
                    <input
                      type="checkbox"
                      bind:checked="{teamChecks[index]}"
                      on:click="{() =>
                        console.log(
                          checks[index],
                          teamChecks[index],
                          team.number
                        )}"
                    />
                    <label>{checks[index]}</label>
                  </li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
.bg-gray-light {
    background-color: rgba(200, 200, 200, 0.3);
}

.loading {
    position: fixed;
    top: var(--topNavbarHeight);
    left: 0;
    width: 100%;
    height: calc(100vh - var(--topNavbarHeight)) !important;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(33, 37, 41, 1);
    color: #fff;
    z-index: 9999;
}
</style>
