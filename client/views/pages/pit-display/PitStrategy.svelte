<script lang="ts">
import { FIRSTEvent } from './../../../models/FIRST/event';
import { FIRSTMatch } from './../../../models/FIRST/match';
import { Strategy } from '../../../models/FIRST/strategy';
import { onMount } from 'svelte';
import { fade } from 'svelte/transition';
import { prompt } from '../../../utilities/notifications';
import { FIRSTTeam } from '../../../models/FIRST/team';

let loading: boolean = true;

let matches: FIRSTMatch[] = [];
let match: FIRSTMatch | undefined;
let strategies: Strategy[] = [];
let strategy: Strategy | undefined;
let blueTeams: FIRSTTeam[] = [];
let redTeams: FIRSTTeam[] = [];

const getMatches = async (event: FIRSTEvent) => {
    const res = await event.getMatches();
    if (res.isErr()) {
        console.error(res.error);
        return;
    }

    matches = res.value;
    if (matches.length > 0) {
        match = matches[0]; // Set the first match as the default selected
        await updateTeams();
        await getStrategies(match);
    }
    loading = false;
};

const updateTeams = async () => {
    if (!match) return;
    const teamsResult = await match.getTeams();
    if (teamsResult.isErr()) {
        console.error(teamsResult.error);
        return;
    }
    const teams = teamsResult.value.filter(Boolean);
    redTeams = teams.slice(0, 3);
    blueTeams = teams.slice(3, 6);
};

const newStrategy = async () => {
    let name = await prompt('Strategy Name');
    if (!name) return;

    const res = await Strategy.new({
        name,
        matchId: undefined,
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

onMount(() => {
    const handleSelectEvent = async (event: FIRSTEvent) => {
        await getMatches(event);
    };

    FIRSTEvent.on('select', handleSelectEvent);

    if (FIRSTEvent.current) {
        getMatches(FIRSTEvent.current);
    }

    return () => {
        FIRSTEvent.off('select', handleSelectEvent);
    };
});
</script>

{#if loading}
    <div class="loading" transition:fade>
        <div class="text-center">
            <div class="spinner-border" role="status">
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
                    bind:value="{match}"
                    class="form-select"
                    on:change="{updateTeams}"
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
                <select bind:value="{strategy}" class="form-select">
                    {#each strategies as strat}
                        <option value="{strat}">{strat.name}</option>
                    {/each}
                </select>
            </div>
            <div class="col-md-3">
                <button on:click="{newStrategy}" class="btn btn-primary"
                    >New Strategy</button
                >
            </div>
        </div>

        <!-- Teams -->
        <div class="row mb-3 mx-1 h-auto">
            <div class="col-md-6 bg-danger border rounded">
                <div class="d-flex flex-column h-100 p-3">
                    {#each redTeams as team}
                        <div
                            class="row align-items-center bg-gray-light rounded mb-2"
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
                    {#each blueTeams as team}
                        <div
                            class="row align-items-center bg-gray-light rounded mb-2"
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

        <!-- Checks placeholder -->
        <div class="row mb-3 mx-1">
            <div class="col-md-12 border rounded border-light-subtle p-3">
                <h1>Checks</h1>
                <p>
                    I don't actually remember why this is here, but it is on my
                    whiteboard for design. Same as above.
                </p>
            </div>
        </div>

        <!-- Checks -->
        <div class="row mb-3 mx-1">
            <div class="col-md-6 bg-dark border rounded p-3">
                <div class="d-flex flex-column">
                    {#each redTeams as team}
                        <div class="bg-gray-light rounded mb-2 p-3">
                            <h5 class="m-0">{team.number} {team.name}</h5>
                            <ul>
                                <li>Test</li>
                                <li>Test</li>
                                <li>Test</li>
                            </ul>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="col-md-6 bg-dark border rounded p-3">
                <div class="d-flex flex-column">
                    {#each blueTeams as team}
                        <div class="bg-gray-light rounded mb-2 p-3">
                            <h5 class="m-0">{team.number} {team.name}</h5>
                            <ul>
                                <li>Test</li>
                                <li>Test</li>
                                <li>Test</li>
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
