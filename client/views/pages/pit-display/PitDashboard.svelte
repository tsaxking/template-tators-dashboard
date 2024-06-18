<script lang="ts">
import { dateTime } from './../../../../shared/clock';
import { match } from './../../../../shared/match';
import { FIRSTEvent } from './../../../models/FIRST/event';
import { FIRSTMatch } from './../../../models/FIRST/match';
import { onMount } from 'svelte';
import RobotCard from './RobotCard.svelte';

let matchScouting: {
    teams: {
        team: number;
        scouted: boolean;
    }[];
    match?: FIRSTMatch;
}[] = [];

let selectedMatchTime: number = 0; // Initialize with default time

onMount(() => {
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

        // Calculate the difference in time
        const matchTime = match.tba.predicted_time;
        const diff = Math.abs(matchTime - time);

        // Update closest match if this one is closer
        if (diff < closestDiff) {
            closestDiff = diff;
            closestMatch = match;
        }
    });

    return closestMatch;
}

let red1 = 1;
let red2 = 2;
let red3 = 3;

let blue1 = 4;
let blue2 = 5;
let blue3 = 6;

let minutes = 0;

function fetchTeamsData(match: FIRSTMatch) {
    const teams = match.getTeams();
    return teams.then(teamsResult => {
        if (teamsResult.isErr()) {
            console.error(teamsResult.error);
            return [];
        }
        return teamsResult.value.map(team => team?.tba.team_number);
    });
}

$: {
    if (closestMatch) {
        fetchTeamsData(closestMatch).then(teams => {
            teams.forEach(team => {
                console.log(team);
            });
        });
    }
}

$: closestMatch = findClosestMatch(selectedMatchTime);
$: matchnum = closestMatch?.number || 0;
$: minutes = Math.floor((selectedMatchTime * 1000 - Date.now()) / 60000);
$: console.log(selectedMatchTime * 1000, dateTime(selectedMatchTime * 1000));
$: matchtime = dateTime(Number(closestMatch?.tba.predicted_time) * 1000);
</script>

<div class="vh-display vw-100 container-fluid position-relative">
    <div class="row h-100">
        <div class="col-md-6 bg-danger">
            <div
                class="d-flex flex-column h-100 justify-content-between align-items-start p-3"
            >
                <RobotCard robot="{red1}" {matchnum} />
                <RobotCard robot="{red2}" {matchnum} />
                <RobotCard robot="{red3}" {matchnum} />
            </div>
        </div>
        <div class="col-md-6 bg-primary">
            <div
                class="d-flex flex-column h-100 justify-content-between align-items-end p-3"
            >
                <RobotCard robot="{blue1}" {matchnum} />
                <RobotCard robot="{blue2}" {matchnum} />
                <RobotCard robot="{blue3}" {matchnum} />
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
                Match {matchnum} is in {minutes} minutes at
            </h4>
            <p class="display-1 text-black" style="font-size:400%">
                {matchtime}
            </p>
            <select bind:value="{selectedMatchTime}">
                {#each matchScouting as { match }}
                    {#if match}
                        <option value="{match.tba.predicted_time}"
                            >{match.compLevel} {match.number}</option
                        >
                    {/if}
                {/each}
            </select>
        </div>
    </div>
</div>

<style>
.vh-display {
    height: calc(100vh - 58px);
}

.bg-gray-light {
    background-color: rgba(200, 200, 200, 0.7);
}
</style>
