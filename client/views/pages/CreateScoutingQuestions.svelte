<script lang="ts">
import { FIRSTEvent } from '../../models/FIRST/event';
import NavTabs from '../components/bootstrap/NavTabs.svelte';
import CreateScoutingSections from '../components/scouting/CreateScoutingSections.svelte';

let event: FIRSTEvent;

FIRSTEvent.on('select', (e: FIRSTEvent) => (event = e));

type Type = {
    name: string;
    groups: string[];
    questions: string[];
};

let types: Type[] = [];

const save = (type: Type) => () => {
    console.log(type);
};

let active: string = '';
</script>

<div class="container-fluid">
    <div class="row mb-3">
        <NavTabs
            tabs="{types.map(t => t.name)}"
            bind:active
            on:change="{e => (active = e.detail)}"
        ></NavTabs>
    </div>
    {#each types as type}
        {#if type.name === active}
            <div class="row">
                <!-- <CreateScoutingSections name={type.name} eventKey={event?.tba.key} bind:groups={type.groups} bind:questions={type.questions} on:save={save(type)}></CreateScoutingSections> -->
            </div>
        {/if}
    {/each}
</div>
