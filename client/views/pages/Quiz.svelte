<script lang="ts">
import { Random } from "../../../shared/math";
import { FIRSTEvent } from "../../models/FIRST/event";
import { FIRSTTeam } from "../../models/FIRST/team";
import { alert } from "../../utilities/notifications";

// deal with this later
let difficulty: 'easy' | 'medium' | 'hard' = 'easy';

let numIncorrect = 0;
let type: 'number' | 'name' = 'number';

let event: FIRSTEvent | undefined = undefined;
let teams: FIRSTTeam[] = [];
let isPlaying = false;

    const fns = {
        getTeams: async (event: FIRSTEvent | undefined) => {
            if (!event) return teams = [];

            const res = await event.getTeams();
            if (res.isErr()) return console.error(res.error);

            
            teams = Random.shuffle(res.value);
        },
        play: () => {
            isPlaying = true;
            fns.chooseTeam();
        },
        chooseTeam: async () => {
            const availableTeams = teams.filter(t => !chosen.includes(t));

            if (availableTeams.length === 0) {
                // handle end here
                const numTeams = teams.length;
                
                await alert(
                    `Finished! You missed only ${numIncorrect} out of ${numTeams} teams!`,
                );

                numIncorrect = 0;
                chosen = [];
                fns.getTeams(event);
                currentTeam = undefined;
                return isPlaying = false;
            }

            teams = Random.shuffle(availableTeams);
            type = Random.choose(['number', 'name']);
            currentTeam = Random.choose(availableTeams);
        },
        next: async (success: boolean) => {
            if (!currentTeam) return;
            if (success) chosen.push(currentTeam);

            await alert(
                success ? 'Correct!' : 'Incorrect! The correct answer was ' + currentTeam.name + ' | ' + currentTeam.number,
            );

            fns.chooseTeam();
        }
    }

    $: fns.getTeams(event);

    let chosen: FIRSTTeam[] = [];
    let currentTeam: FIRSTTeam | undefined;

    FIRSTEvent.on('select', (e) => event = e);


    let name: string | undefined;
    let number: string | undefined;
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
                    <select name="teamNumber" id="teamNumber" class="form-control" bind:value={number}>
                        <option value="default" disabled selected>Please select a value</option>
                        {#each teams as team}
                            <option value={team.number}>{team.number}</option>
                        {/each}
                    </select>
                </div>
                <div class="col">
                    <button class="btn btn-success" on:click={(e) => {
                        fns.next(Number(number) === currentTeam?.number);
                    }}>Submit</button>
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
                    <select name="teamName" id="teamName" class="form-select" bind:value={name}>
                        <option value="default" disabled selected>Please select a value</option>
                        {#each teams as team}
                            <option value={team.name}>{team.name}</option>
                        {/each}
                    </select>
                </div>
                <div class="col">
                    <button class="btn btn-success" on:click={(e) => {
                        fns.next(name === currentTeam?.name);
                    }}>Submit</button>
                </div>
            </div>
        </div>
    {/if}
{:else}
    <div class="container">
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-middle">
                    <button class="btn btn-success" on:click={fns.play}>Play!</button>
                </div>
            </div>
        </div>
    </div>
{/if}