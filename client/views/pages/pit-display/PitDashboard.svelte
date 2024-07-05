<script lang="ts">
import { dateTime } from './../../../../shared/clock';
import { FIRSTEvent } from './../../../models/FIRST/event';
import { FIRSTMatch } from './../../../models/FIRST/match';
import { onMount } from 'svelte';
import RobotCard from './RobotCard.svelte';
import { Color } from '../../../submodules/colors/color';
import { FIRSTTeam } from '../../../models/FIRST/team';

let matchScouting: {
    teams: {
        team: number;
        scouted: boolean;
    }[];
    match?: FIRSTMatch;
}[] = [];

let selectedMatch: number = 0;
let redTeams: number[] = [0, 0, 0];
let blueTeams: number[] = [0, 0, 0];

let minutes = 0;
let closestMatch: FIRSTMatch | undefined;

$: selectedMatchTime =
    matchScouting[selectedMatch]?.match?.tba.predicted_time || 0;

onMount(async () => {
    const fn = async (e: FIRSTEvent) => {
        const [statusRes, matchesRes] = await Promise.all([
            e.getStatus(),
            e.getMatches()
        ]);
        if (statusRes.isErr()) return console.error(statusRes.error);
        if (matchesRes.isErr()) return console.error(matchesRes.error);

        const { matches } = statusRes.value;

        matchScouting = await Promise.all(
            matchesRes.value.map(async m => {
                const match = matches.find(
                    _m => _m.match === m.number && _m.compLevel === m.compLevel
                );
                if (!match) {
                    return {
                        teams: []
                    };
                }
                const unScouted = match.teams;
                const teams = await m.getTeams();

                if (teams.isErr()) {
                    return {
                        teams: []
                    };
                }

                return {
                    teams: teams.value.filter(Boolean).map(t => ({
                        team: t.number,
                        scouted: !unScouted.includes(t.number)
                    })),
                    match: m
                };
            })
        );
    };

    FIRSTEvent.on('select', fn);

    if (FIRSTEvent.current) {
        fn(FIRSTEvent.current);
    }

    return () => {
        FIRSTEvent.off('select', fn);
    };
});

function findClosestMatch(time: number) {
    let closestMatch: FIRSTMatch | undefined;
    let closestDiff = Infinity;

    matchScouting.forEach(({ match }) => {
        if (!match) return;

        const matchTime = match.tba.predicted_time;
        const diff = Math.abs(matchTime - time);

        if (diff < closestDiff) {
            closestDiff = diff;
            closestMatch = match;
        }
    });

    return closestMatch;
}

async function fetchTeamsData(match: FIRSTMatch) {
    const teamsResult = await match.getTeams();
    if (teamsResult.isErr()) {
        console.error(teamsResult.error);
        return [];
    }
    return teamsResult.value.filter(Boolean).map(team => team.tba.team_number);
}

$: (async () => {
    let teams: FIRSTTeam[] = [];
    const match = matchScouting[selectedMatch]?.match;
    if (match) {
        const teamsResult = await match.getTeams();
        if (teamsResult.isErr()) {
            console.error(teamsResult.error);
        } else {
            teams = teamsResult.value.filter(Boolean) as FIRSTTeam[];
        }
    }
    for (let i = 0; i < teams.length; i++) {
        if (i % 2 === 0) {
            redTeams[i / 2] = teams[i].tba.team_number;
        } else {
            blueTeams[Math.floor(i / 2)] = teams[i].tba.team_number;
        }
    }
})();

$: {
    if (closestMatch) {
        fetchTeamsData(closestMatch).then(teams => {
            for (let i = 0; i < teams.length; i++) {
                if (i < 3) {
                    redTeams[i] = teams[i];
                } else {
                    blueTeams[i - 3] = teams[i];
                }
            }
        });
    }
}

$: closestMatch = findClosestMatch(selectedMatchTime);
$: minutes = Math.floor((selectedMatchTime * 1000 - Date.now()) / 60000);
$: console.log(selectedMatchTime * 1000, dateTime(selectedMatchTime * 1000));
$: matchtime = dateTime(Number(closestMatch?.tba.predicted_time) * 1000);
</script>

<div
    class="vh-display vw-100 container-fluid position-relative no-scroll no-select"
>
    <div class="row h-100">
        <div class="col-md-6 bg-danger">
            <div
                class="d-flex flex-column h-100 justify-content-between align-items-start p-3"
            >
                <RobotCard
                    alignment="end"
                    robot="{redTeams[0]}"
                    {selectedMatch}
                />
                <RobotCard
                    alignment="end"
                    robot="{redTeams[1]}"
                    {selectedMatch}
                />
                <RobotCard
                    alignment="end"
                    robot="{redTeams[2]}"
                    {selectedMatch}
                />
            </div>
        </div>
        <div class="col-md-6 bg-primary">
            <div
                class="d-flex flex-column h-100 justify-content-between align-items-end p-3"
            >
                <RobotCard
                    alignment="start"
                    robot="{blueTeams[0]}"
                    {selectedMatch}
                />
                <RobotCard
                    alignment="start"
                    robot="{blueTeams[1]}"
                    {selectedMatch}
                />
                <RobotCard
                    alignment="start"
                    robot="{blueTeams[2]}"
                    {selectedMatch}
                />
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
                    on:click="{() => {
                        if (selectedMatch > 0) {
                            selectedMatch -= 1;
                        }
                    }}">-</button
                >
                <select bind:value="{selectedMatch}" class="form-select">
                    {#each matchScouting as { match }, index}
                        {#if match}
                            <option value="{index}">
                                {match.compLevel}
                                {match.number}
                            </option>
                        {/if}
                    {/each}
                </select>
                <button
                    class="btn btn-primary ms-2"
                    on:click="{() => {
                        if (matchScouting.length - 1 !== selectedMatch) {
                            selectedMatch += 1;
                        }
                    }}">+</button
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
</style>
