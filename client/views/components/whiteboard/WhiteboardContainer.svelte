<script lang="ts">
import { onMount } from 'svelte';
import { Strategy } from '../../../models/FIRST/strategy';
import { FIRSTWhiteboard } from '../../../models/FIRST/whiteboard';
import { FIRSTYear } from '../../../models/FIRST/year';
import Whiteboard from './Whiteboard.svelte';
import Select from '../bootstrap/Select.svelte';
import { prompt } from '../../../utilities/notifications';
export let strategy: Strategy;
let whiteboards: FIRSTWhiteboard[] = [];
let whiteboard: FIRSTWhiteboard | undefined;
let year: number | undefined;

let options: string[] = [];
let values: string[] = [];

$: options = whiteboards.map(w => w.name);
$: values = whiteboards.map(w => w.id);

const onSelect = (e: CustomEvent) => {
    const { detail: id } = e;
    console.log('Selecting: ', id);
    const wb = whiteboards.find(w => w.id === id);
    console.log('FOUND', wb);
    if (wb) whiteboard = wb;
};

const newWhiteboard = async () => {
    const name = await prompt('Enter a name for the new whiteboard');
    if (!name) return;
    FIRSTWhiteboard.new(name, strategy);
};

const getWhiteboards = async (strategy: Strategy) => {
    const currentYear = FIRSTYear.current;
    if (!currentYear) return console.error('Could not get current year');
    year = currentYear.year;

    const wb = await strategy.getWhiteboards();
    if (wb.isErr()) return console.error(wb.error);
    console.log('WHITEBOARDS', wb.value);
    whiteboards = wb.value;

    const w = whiteboards[0];
    if (w) whiteboard = w;
};

$: getWhiteboards(strategy);
</script>

<div class="container-fluid">
    <div class="row mb-3">
        <div class="col-md-6">
            <Select {options} {values} on:change="{onSelect}" />
        </div>
        <div class="col-md-6">
            <button
                type="button"
                class="btn btn-primary w-100"
                on:click="{newWhiteboard}">New Whiteboard</button
            >
        </div>
    </div>
    {#if whiteboard && year}
        <div class="row mb-3">
            <Whiteboard bind:whiteboard={whiteboard} {year} />
        </div>
    {/if}
</div>
