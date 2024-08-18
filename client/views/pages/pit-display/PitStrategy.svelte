<script lang="ts">
import { dateTime } from './../../../../shared/clock';
import { FIRSTEvent } from './../../../models/FIRST/event';
import { FIRSTMatch } from './../../../models/FIRST/match';
import { onMount } from 'svelte';
import { FIRSTTeam } from '../../../models/FIRST/team';
import { Ok } from '../../../../shared/check';
import { fade } from 'svelte/transition';
import { Whiteboard } from '../../../models/FIRST/whiteboard';
import { prompt } from '../../../utilities/notifications';

interface MatchScouting {
    teams: { team: number; scouted: boolean }[];
    match?: FIRSTMatch;
}

const rbt = '../../../../public/pictures/icons/rbt.png';

let matchScouting: MatchScouting[] = [];
let selectedMatch = 0;
let redTeams: FIRSTTeam[] = [];
let blueTeams: FIRSTTeam[] = [];
let minutes = 0;
let closestMatch: FIRSTMatch | undefined;
let loading = true;
let matchtime: string;

const strategyArr = [
    { id: 0, name: 'Strategy 1' },
    { id: 1, name: 'Strategy 2' },
    { id: 2, name: 'Strategy 3' }
];

let selectedStrategy = 0;

const updateMatchScouting = async (e: FIRSTEvent) => {
    loading = true;
    const [statusRes, matchesRes] = await Promise.all([
        e.getStatus(),
        e.getMatches()
    ]);

    if (statusRes.isErr() || matchesRes.isErr()) {
        console.error(
            (statusRes as Ok<any>).value.error ||
                (matchesRes as Ok<any>).value.error
        );
        loading = false;
        return;
    }

    const { matches } = statusRes.value;
    matchScouting = await Promise.all(
        matchesRes.value.map(async m => {
            const match = matches.find(
                _m => _m.match === m.number && _m.compLevel === m.compLevel
            );
            if (!match) return { teams: [] };

            const unScouted = match.teams;
            const teamsResult = await m.getTeams();
            if (teamsResult.isErr()) return { teams: [] };

            return {
                teams: teamsResult.value.filter(Boolean).map(t => ({
                    team: t.number,
                    scouted: !unScouted.includes(t.number)
                })),
                match: m
            };
        })
    );

    loading = false;
};

const fetchTeamsData = async (match: FIRSTMatch) => {
    const teamsResult = await match.getTeams();
    if (teamsResult.isErr()) {
        console.error(teamsResult.error);
        return [];
    }
    return teamsResult.value.filter(Boolean);
};

onMount(() => {
    FIRSTEvent.on('select', updateMatchScouting);
    if (FIRSTEvent.current) updateMatchScouting(FIRSTEvent.current);

    return () => {
        FIRSTEvent.off('select', updateMatchScouting);
    };
});

$: {
    const match = matchScouting[selectedMatch]?.match;
    if (match) {
        (async () => {
            const teams = await fetchTeamsData(match);
            redTeams = teams.slice(0, 3);
            blueTeams = teams.slice(3, 6);
        })();
    }

    const selectedMatchTime =
        matchScouting[selectedMatch]?.match?.tba.predicted_time || 0;
    closestMatch = matchScouting.reduce(
        (closest, { match }) => {
            if (!match) return closest;
            const matchTime = match.tba.predicted_time;
            const diff = Math.abs(matchTime - selectedMatchTime);
            return diff < (closest?.diff || Infinity)
                ? { match, diff }
                : closest;
        },
        { match: undefined, diff: Infinity } as {
            match?: FIRSTMatch;
            diff: number;
        }
    ).match;

    minutes = Math.floor((selectedMatchTime * 1000 - Date.now()) / 60000);
    matchtime = dateTime(Number(closestMatch?.tba.predicted_time) * 1000);
}



const createWhiteboard = async () => {
    const name = await prompt('Enter whiteboard name');
    if (!name) return;
    // will need this to change
    const wb = await Whiteboard.new(name, strategy);
    if (wb.isErr()) return console.error(wb.error);
};
</script>

{#if loading}
    <div class="loading" transition:fade>
        <div class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p>Loading teams</p>
        </div>new
    </div>
{:else}
    <div class="container-fluid vh-100">
        <!-- Control bar -->
        <div class="row mb-3">
            <div class="col-md-3">
                <select bind:value="{selectedMatch}" class="form-select">
                    {#each matchScouting as { match }, index}
                        {#if match}
                            <option value="{index}">
                                {match.compLevel === 'qm'
                                    ? 'Qualifier'
                                    : match.compLevel === 'sf'
                                      ? 'Semifinal'
                                      : 'Final'}
                                {match.number}
                            </option>
                        {/if}
                    {/each}
                </select>
            </div>
            <div class="col-md-3">
                <select bind:value="{selectedStrategy}" class="form-select">
                    {#each strategyArr as { id, name }}
                        <option value="{id}">{name}</option>
                    {/each}
                </select>
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
                            <ul class="">
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
                            <ul class="">
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



    <button class="btn btn-primary" on:click={createWhiteboard}>
        Create Whiteboard
    </button>
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
