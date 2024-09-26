<script lang="ts">
import { dateString, dateTime } from './../../../../shared/clock';
import { FIRSTEvent } from './../../../models/FIRST/event';
import { FIRSTMatch } from './../../../models/FIRST/match';
import { onMount } from 'svelte';
import RobotCard from '../../components/strategy/RobotCard.svelte';
import { Color } from '../../../submodules/colors/color';
import { FIRSTTeam } from '../../../models/FIRST/team';
import { Ok } from '../../../../shared/check';
import { fade } from 'svelte/transition';
import Countdown from '../../components/bootstrap/Countdown.svelte';
import { TBA } from '../../../utilities/tba';
import { type TBAMatch } from '../../../../shared/submodules/tatorscout-calculations/tba';
import { socket } from '../../../utilities/socket';

interface MatchScouting {
    teams: { team: number; scouted: boolean }[];
    match?: FIRSTMatch;
}

const dateTimeSeconds = dateString('MM/DD/YYYY hh:mm:ss AM');

let matchScouting: MatchScouting[] = [];
let selectedMatch = 0;
let closestMatchIndex = 0;
let redTeams: FIRSTTeam[] = [];
let blueTeams: FIRSTTeam[] = [];
let minutes = 0;
let closestMatch: FIRSTMatch | undefined;
let loading = true;
let matchtime: string;
let currentTime = Date.now();

const updateMatchScouting = async (e: FIRSTEvent) => {
    loading = true;
    const [statusRes, matchesRes] = await Promise.all([
        e.getStatus(),
        e.getMatches()
    ]);

    loading = false;

    if (statusRes.isErr()) return console.error(statusRes.error);
    if (matchesRes.isErr()) return console.error(matchesRes.error);

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

    selectedMatch = updateClosestMatch(Date.now() / 1000);
    loading = false;
};

const updateClosestMatch = (now: number) => {
    closestMatchIndex = matchScouting.reduce((closest, current, index) => {
        if (!current.match) return closest;
        const currentDiff = Math.abs(current.match.tba.predicted_time - now);
        const closestDiff = Math.abs(
            matchScouting[closest]?.match?.tba.predicted_time ?? 0 - now
        );
        return currentDiff < closestDiff ? index : closest;
    }, 0);
    console.log('closest match now set to', closestMatchIndex);
    return closestMatchIndex;
};

onMount(() => {
    FIRSTEvent.on('select', updateMatchScouting);
    if (FIRSTEvent.current) updateMatchScouting(FIRSTEvent.current);

    socket.on('update-matches', () => {
        if (FIRSTEvent.current) updateMatchScouting(FIRSTEvent.current);
    });

    const intervalId = setInterval(() => {
        selectedMatch = updateClosestMatch(Date.now() / 1000);
    }, 60000);

    return () => {
        FIRSTEvent.off('select', updateMatchScouting);
        socket.off('update-matches', updateMatchScouting);
        clearInterval(intervalId);
    };
});

const fetchTeamsData = async (match: FIRSTMatch) => {
    const teamsResult = await match.getTeams();
    if (teamsResult.isErr()) {
        console.error(teamsResult.error);
        return [];
    }
    return teamsResult.value.filter(Boolean);
};

setInterval(() => {
    currentTime = Date.now();
}, 1000);

const updateTeams = async (match: FIRSTMatch) => {
    const teams = await fetchTeamsData(match);
    redTeams = teams.slice(0, 3);
    blueTeams = teams.slice(3, 6);
};

$: {
    const match = matchScouting[selectedMatch]?.match;
    if (match) {
        updateTeams(match);
    }

    const selectedMatchTime = match?.tba.predicted_time || 0;
    closestMatch = matchScouting[closestMatchIndex]?.match;
    minutes = Math.floor((selectedMatchTime * 1000 - Date.now()) / 60000);
    matchtime = dateTime(Number(closestMatch?.tba.predicted_time) * 1000);
}
</script>

<div
    class="vh-display vw-100 container-fluid position-relative no-scroll no-select"
>
    <div class="row h-100">
        <div class="col-md-6 bg-danger">
            <div
                class="d-flex flex-column h-100 justify-content-between align-items-start p-3"
            >
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
                    {#each redTeams as team}
                        <RobotCard alignment="end" {team} />
                    {/each}
                {/if}
            </div>
        </div>
        <div class="col-md-6 bg-primary">
            <div
                class="d-flex flex-column h-100 justify-content-between align-items-end p-3"
            >
                {#if loading}
                    <div class="text-center text-white">Loading...</div>
                {:else}
                    {#each blueTeams as team}
                        <RobotCard alignment="start" {team} />
                    {/each}
                {/if}
            </div>
        </div>
    </div>

    <div
        style:top="calc(1%)"
        class="container h-auto w-auto bg-gray-light rounded position-absolute start-50 translate-middle-x z-3"
    >
        <div
            class="d-flex flex-column justify-content-center align-items-center h-100"
        >
            <div class="d-flex align-items-center">
                <p style:font-size="200%" class="display-1 text-black">
                    {dateTimeSeconds(currentTime)}
                </p>
            </div>
        </div>
    </div>

    <!-- Dark gray square overlay for match info -->
    <div
        class="container h-50 w-25 bg-gray-light rounded position-absolute top-50 start-50 translate-middle z-3"
    >
        <div
            class="d-flex flex-column justify-content-center align-items-center h-100 my-2"
        >
            <h4 class="text-black">
                Match {selectedMatch + 1} is in
            </h4>
            <div class="text-black">
                {#if closestMatch?.tba.predicted_time}
                    {#if closestMatch.tba.predicted_time > Date.now()}
                        <Countdown
                            onFinish="{() => {}}"
                            targetTime="{closestMatch.tba.predicted_time}"
                        />
                    {:else}
                        <h3>Now</h3>
                    {/if}
                {:else}
                    <h3>No time available</h3>
                {/if}
            </div>
            <h4 class="text-black">at</h4>
            <div class="d-flex align-items-center mb-3">
                <p
                    style:font-size="400%"
                    class="display-1 text-black text-center"
                >
                    {matchtime}
                </p>
            </div>
            <div class="d-flex w-100">
                <button
                    class="btn btn-primary me-2"
                    on:click="{() =>
                        (selectedMatch = Math.max(0, selectedMatch - 1))}"
                    >-</button
                >
                <select class="form-select" bind:value="{selectedMatch}">
                    {#each matchScouting as { match }, index}
                        {#if match}
                            <option value="{index}">
                                {#if match.compLevel === 'qm'}
                                    Qualifier
                                {:else if match.compLevel === 'sf'}
                                    Semifinal
                                {:else if match.compLevel === 'f'}
                                    Final
                                {/if}
                                {match.number}
                            </option>
                        {/if}
                    {/each}
                </select>
                <button
                    class="btn btn-primary ms-2"
                    on:click="{() =>
                        (selectedMatch = Math.min(
                            matchScouting.length - 1,
                            selectedMatch + 1
                        ))}">+</button
                >
            </div>
            <button
                class="btn btn-secondary mt-2 w-100"
                on:click="{() => {
                    selectedMatch = updateClosestMatch(Date.now() / 1000);
                }}"
            >
                Select Closest Match
            </button>
        </div>
    </div>

    {#if blueTeams.some(team => team.tba.team_number === 2122) || redTeams.some(team => team.tba.team_number === 2122)}
        <div
            style:bottom="calc(10%)"
            class="container h-auto w-auto bg-gray-light rounded position-absolute start-50 translate-middle-x z-3 fs-1"
            transition:fade
        >
            <div
                class="d-flex flex-column justify-content-center align-items-center h-100 text-bold"
            >
                <div class="d-flex align-items-center">
                    {#if blueTeams.some(team => team.tba.team_number === 2122)}
                        <p class="text-primary">YOU ARE: BLUE</p>
                    {:else if redTeams.some(team => team.tba.team_number === 2122)}
                        <p class="text-danger">YOU ARE: RED</p>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
.vh-display {
    height: calc(100vh - var(--topNavbarHeight)) !important;
}
.bg-gray-light {
    background-color: rgba(200, 200, 200, 0.7);
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
