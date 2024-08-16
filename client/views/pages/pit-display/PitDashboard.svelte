<script lang="ts">
import { dateTime } from './../../../../shared/clock';
import { FIRSTEvent } from './../../../models/FIRST/event';
import { FIRSTMatch } from './../../../models/FIRST/match';
import { onMount } from 'svelte';
import RobotCard from './RobotCard.svelte';
import { Color } from '../../../submodules/colors/color';
import { FIRSTTeam } from '../../../models/FIRST/team';
import { Ok } from '../../../../shared/check';
import { fade } from 'svelte/transition';

interface MatchScouting {
    teams: { team: number; scouted: boolean }[];
    match?: FIRSTMatch;
}

let matchScouting: MatchScouting[] = [];
let selectedMatch = 0;
let redTeams: FIRSTTeam[] = [];
let blueTeams: FIRSTTeam[] = [];
let minutes = 0;
let closestMatch: FIRSTMatch | undefined;
let loading = true;
let matchtime: string;

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

onMount(() => {
    FIRSTEvent.on('select', updateMatchScouting);
    if (FIRSTEvent.current) updateMatchScouting(FIRSTEvent.current);

    return () => {
        FIRSTEvent.off('select', updateMatchScouting);
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

$: {
    const match = matchScouting[selectedMatch]?.match;
    if (match) {
        const updateTeams = async () => {
            const teams = await fetchTeamsData(match);
            redTeams = teams.slice(0, 3);
            blueTeams = teams.slice(3, 6);
        };
        updateTeams();
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
                        <RobotCard
                            alignment="end"
                            {team}
                            match="{selectedMatch}"
                        />
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
                        <RobotCard
                            alignment="start"
                            {team}
                            match="{selectedMatch}"
                        />
                    {/each}
                {/if}
            </div>
        </div>
    </div>
    <!-- Dark gray square overlay -->
    <div
        class="container h-50 w-25 bg-gray-light rounded position-absolute top-50 start-50 translate-middle z-3"
    >
        <div
            class="d-flex flex-column justify-content-center align-items-center h-100 my-2"
        >
            <h4 class="text-black">
                Match {selectedMatch + 1} is in {minutes} minutes at
            </h4>
            <div class="d-flex align-items-center mb-3">
                <p class="display-1 text-black" style="font-size: 400%;">
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
                <select bind:value="{selectedMatch}" class="form-select">
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
        </div>
    </div>
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
