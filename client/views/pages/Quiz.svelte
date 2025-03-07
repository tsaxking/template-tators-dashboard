<script lang="ts">
import { onMount } from 'svelte';
import { Random } from '../../../shared/math';
import { FIRSTEvent } from '../../models/FIRST/event';
import { FIRSTTeam } from '../../models/FIRST/team';
import { alert } from '../../utilities/notifications';

export let loading: boolean;

// deal with this later
let difficulty: 'easy' | 'medium' | 'hard' = 'easy';

let numIncorrect = 0;
let type: 'number' | 'name' = 'number';

let event: FIRSTEvent | null = null;
let teams: FIRSTTeam[] = [];
let isPlaying = false;

const getTeams = async (event: FIRSTEvent | null) => {
    if (!event) return (teams = []);

    const res = await event.getTeams();
    if (res.isErr()) return console.error(res.error);

    teams = Random.shuffle(res.value);
};
const play = () => {
    isPlaying = true;
    chooseTeam();
};
const chooseTeam = async () => {
    const availableTeams = teams.filter(t => !chosen.includes(t));

    if (availableTeams.length === 0) {
        // handle end here
        const numTeams = teams.length;

        await alert(
            `Finished! You missed only ${numIncorrect} out of ${numTeams} teams!`
        );

        numIncorrect = 0;
        chosen = [];
        getTeams(event);
        currentTeam = undefined;
        return (isPlaying = false);
    }

    number = undefined;
    number = undefined;
    teams = availableTeams;
    type = Random.choose(['number', 'name']);
    currentTeam = Random.choose(teams);
};
const next = async (success: boolean) => {
    if (!currentTeam) return;
    if (success) chosen.push(currentTeam);

    await alert(
        success
            ? 'Correct!'
            : 'Incorrect! The correct answer was ' +
                  currentTeam.name +
                  ' | ' +
                  currentTeam.number
    );

    chooseTeam();
};

let chosen: FIRSTTeam[] = [];
let currentTeam: FIRSTTeam | undefined;

FIRSTEvent.on('select', getTeams);

let name: string | undefined;
let number: string | undefined;

onMount(() => {
    if (FIRSTEvent.current) {
        event = FIRSTEvent.current;
        getTeams(event).then(() => {
            loading = false;
        });
    }

    return () => {
        loading = true;
    };
});
</script>

{#if isPlaying}
    {#if type === 'number'}
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h1>What is the team number of {currentTeam?.name}?</h1>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <select
                        id="teamNumber"
                        name="teamNumber"
                        class="form-control"
                        bind:value="{number}"
                    >
                        <option disabled selected value="default"
                            >Please select a value</option
                        >
                        {#each teams.sort((a, b) => a.number - b.number) as team}
                            <option value="{team.number}">{team.number}</option>
                        {/each}
                    </select>
                </div>
                <div class="col">
                    <button
                        class="btn btn-success"
                        on:click="{e => {
                            next(Number(number) === currentTeam?.number);
                        }}">Submit</button
                    >
                </div>
            </div>
        </div>
    {:else}
        <div class="container">
            <div class="row">
                <div class="col">
                    <h1>What is the team name of {currentTeam?.number}?</h1>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <select
                        id="teamName"
                        name="teamName"
                        class="form-select"
                        bind:value="{name}"
                    >
                        <option disabled selected value="default"
                            >Please select a value</option
                        >
                        {#each teams.sort( (a, b) => a.name.localeCompare(b.name) ) as team}
                            <option value="{team.name}">{team.name}</option>
                        {/each}
                    </select>
                </div>
                <div class="col">
                    <button
                        class="btn btn-success"
                        on:click="{e => {
                            next(name === currentTeam?.name);
                        }}">Submit</button
                    >
                </div>
            </div>
        </div>
    {/if}
{:else}
    <div class="container">
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-middle">
                    <button
                        class="btn btn-success"
                        disabled="{!teams.length}"
                        on:click="{play}">Play!</button
                    >
                </div>
            </div>
        </div>
    </div>
{/if}
