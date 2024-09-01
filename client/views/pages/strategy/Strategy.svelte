<script lang="ts">
import { FIRSTEvent } from '../../../models/FIRST/event';
import { FIRSTMatch } from '../../../models/FIRST/match';
import { Check, Strategy } from '../../../models/FIRST/strategy';
import { onMount } from 'svelte';
import { alert, prompt } from '../../../utilities/notifications';
import { FIRSTAlliance } from '../../../models/FIRST/alliance';
import Alliance from '../../components/strategy/2024Alliance.svelte';
import RobotCard from '../../components/strategy/RobotCard.svelte';
import { type MatchInterface } from '../../../models/FIRST/interfaces/match';
// import { dateString } from '../../../../shared/clock';
// import { Loop } from '../../../../shared/loop';
import { Color } from '../../../submodules/colors/color';
import Checks from '../../components/strategy/Checks.svelte';
import Comment from '../../components/strategy/Comment.svelte';
import MatchSelect from '../../components/main/MatchSelect.svelte';
import StrategySelect from '../../components/strategy/StrategySelect.svelte';

export let loading: boolean;

// move ../Strategy.svelte into this director
// Use that Strategy.svelte in pit and main dashboard, so you don't have to write the code twice
// Move RobotCard into view/components/strategy
// Utilize the components folder and separate the components into their own files
// Build a countdown timer component in /view/components/bootstrap then gimme the code

// const date = dateString('MM/DD/YYYY hh:mm:ss AM');
let matches: FIRSTMatch[] = [];
let strategy: Strategy | undefined;
let red: FIRSTAlliance | undefined;
let blue: FIRSTAlliance | undefined;
let match: MatchInterface | undefined;
let checks: Check[] = [];

let alliance: 'red' | 'blue' | undefined;

$: alliance = red?.hasTeam(2122)
    ? 'red'
    : blue?.hasTeam(2122)
      ? 'blue'
      : undefined;

const colors = {
    red: Color.fromBootstrap('danger').toString(),
    blue: Color.fromBootstrap('primary').toString(),
    redFaded: Color.fromBootstrap('danger').setAlpha(0.5).toString(),
    blueFaded: Color.fromBootstrap('primary').setAlpha(0.5).toString()
};
// let currentTime = date();

const getMatches = async (event: FIRSTEvent) => {
    const res = await event.getMatches();
    if (res.isErr()) {
        return console.error(res.error);
    }

    matches = res.value;
};

const newStrategy = async () => {
    if (!match)
        return alert(
            'Match not selected! You cannot make a new strategy without selecting a match.'
        );
    let name = await prompt('Strategy Name');
    if (!name) return;
    // use prompt to get the strategy name
    // use Strategy.new();
    const info = await match.getInfo();
    if (info.isErr()) {
        return console.error(info.error);
    }

    const isMatch = match instanceof FIRSTMatch;

    Strategy.new({
        matchId: isMatch ? info.value.id : undefined,
        customMatchId: isMatch ? undefined : info.value.id,
        name,
    });
};

const onMatchSelect = async (m: MatchInterface) => {
    match = m;
    red = undefined;
    blue = undefined;
    const alliances = await match.getAlliances();

    if (alliances.isErr()) {
        return console.error(alliances.error);
    }

    const { red: r, blue: b } = alliances.value;
    red = r;
    blue = b;

    const strategies = await m.getStrategies();
    if (strategies.isErr()) return console.error(strategies.error);

    strategy = strategies.value[0];
};

const onStrategySelect = async (s: Strategy) => {
    if (!match) return console.error('Strategy: match not selected');
    strategy = s;
    s.select();

    const c = await s.getChecks();
    if (c.isErr()) {
        return console.error(c.error);
    }

    console.log('CHECKS', { c });

    checks = c.value;
};

onMount(() => {
    loading = false;
    FIRSTEvent.on('select', getMatches);
    if (FIRSTEvent.current) getMatches(FIRSTEvent.current);

    return () => {
        FIRSTEvent.off('select', getMatches);
    };
});
</script>

<button type="button" class="btn btn-primary" on:click="{newStrategy}">New Strategy</button>
<MatchSelect
    on:select="{({ detail }) => onMatchSelect(detail)}"
/>
{#if match}
    <StrategySelect {match} on:select="{({ detail }) => onStrategySelect(detail)}" />
{/if}

<div class="container-fluid">
    {#if match && red && blue}
        <div class="row">
            <div class="col-md-12">
                <div
                    class="d-flex flex-column justify-content-center align-items-center h-100"
                    style="background-color: {alliance === 'red'
                        ? colors.red
                        : colors.redFaded}"
                >
                    <div class="d-flex align-items-center">
                        <h2 class="display-1 text-black">
                            Match: {match.compLevel}{match.number}
                        </h2>
                        <!-- <p class="display-1 text-black" style="font-size: 200%;">
                            {currentTime}
                        </p> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-6">
                <div
                    class="d-flex flex-column h-100 justify-content-between align-items-start p-3"
                    style="background-color: {alliance === 'blue'
                        ? colors.blue
                        : colors.blueFaded}"
                >
                    {#each red.teams as team}
                        {#if team}
                            <RobotCard alignment="end" {team} />
                        {/if}
                    {/each}
                </div>
            </div>
            <div class="col-md-6 bg-primary">
                <div
                    class="d-flex flex-column h-100 justify-content-between align-items-end p-3"
                >
                    {#each blue.teams as team}
                        {#if team}
                            <RobotCard alignment="end" {team} />
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-6 bg-danger">
                <h1>Red Alliance</h1>
                <Alliance bind:alliance="{red}" />
            </div>
            <div class="col-md-6 bg-primary">
                <h1>Blue Alliance</h1>
                <Alliance bind:alliance="{blue}" />
            </div>
        </div>
        {#if strategy}
            <div class="row mb-3">
                <Comment {strategy} />
            </div>
            <div class="row mb-3">
                <!-- Checks -->
                <div class="col-md-6">
                    <Checks checks="{checks[0]}" />
                    <Checks checks="{checks[1]}" />
                    <Checks checks="{checks[2]}" />
                </div>
                <div class="col-md-6">
                    <Checks checks="{checks[3]}" />
                    <Checks checks="{checks[4]}" />
                    <Checks checks="{checks[5]}" />
                </div>
            </div>
        {:else} 
            <p>No strategy selected</p>
        {/if}

        <!-- {#if strategy}
            <Whiteboard {strategy} />
        {/if} -->
    {:else}
        <p>No match selected</p>
    {/if}
</div>
