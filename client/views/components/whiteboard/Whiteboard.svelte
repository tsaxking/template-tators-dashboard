<script lang="ts">
import { onMount } from 'svelte';
import { FIRSTWhiteboard } from '../../../models/FIRST/whiteboard';
import { Canvas } from '../../../models/canvas/canvas';

export let whiteboard: FIRSTWhiteboard;
export let year: number;

let name = whiteboard.name;
let currentPen = 'black';
let canvasEl: HTMLCanvasElement;
let currentCanvas: Canvas | undefined;

$: changeWhiteboard(whiteboard);

const changePen = (pen: string) => {
    whiteboard.board.setColor(pen);
    currentPen = pen;
};

const changeWhiteboard = (whiteboard: FIRSTWhiteboard) => {
    if (currentCanvas) currentCanvas.animating = false;
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) throw new Error('Could not get 2d context');

    const canvas = whiteboard.buildCanvas(ctx, year);

    canvas.width = 1000;
    canvas.height = 500;
    if (whiteboard.board.states.length === 0) {
        whiteboard.board.clear();
    } else {
        whiteboard.board.getCurrentState()?.setListeners();
    }
    canvas.adaptable = true;
    canvas.animate();
    currentCanvas = canvas;
};

onMount(() => {
    if (whiteboard) changeWhiteboard(whiteboard);
});
</script>

<div class="container-fluid">
    <div class="row mb-3">
        <div style:width="100vw" style:position="relative" style:height="50vw">
            <canvas
                bind:this="{canvasEl}"
                on:click|preventDefault
                on:mousedown|preventDefault
                on:mouseup|preventDefault
                on:mousemove|preventDefault
                on:touchstart|preventDefault
                on:touchmove|preventDefault
                on:contextmenu|preventDefault
                on:wheel|preventDefault
                on:keydown|preventDefault
                on:keyup|preventDefault
                on:keypress|preventDefault
                on:blur|preventDefault
                on:focus|preventDefault
                on:resize|preventDefault
                on:select|preventDefault
                on:selectstart|preventDefault
            ></canvas>

            <div
                style:position="absolute"
                style:top="10"
                style:left="10"
                class="d-flex"
            >
                <!-- Pens -->
                <div class="btn-group" role="group">
                    <button
                        class="btn"
                        class:btn-dark="{currentPen === 'black'}"
                        class:btn-outline-dark="{currentPen !== 'black'}"
                        type="button"
                        on:click="{() => changePen('black')}"
                    >
                        <i class="material-icons"> brush </i>
                    </button>
                    <button
                        class="btn"
                        class:btn-danger="{currentPen === 'red'}"
                        class:btn-outline-danger="{currentPen !== 'red'}"
                        type="button"
                        on:click="{() => changePen('red')}"
                    >
                        <i class="material-icons"> brush </i>
                    </button>
                    <button
                        class="btn btn-primary"
                        class:btn-outline-primary="{currentPen !== 'blue'}"
                        class:btn-primary="{currentPen === 'blue'}"
                        type="button"
                        on:click="{() => changePen('blue')}"
                    >
                        <i class="material-icons"> brush </i>
                    </button>
                </div>

                <!-- Functions -->
                <div class="btn-group" role="group">
                    <button
                        class="btn btn-warning"
                        type="button"
                        on:click="{() => whiteboard.board.prev()}"
                    >
                        <i class="material-icons"> undo </i>
                    </button>
                    <button
                        class="btn btn-warning"
                        type="button"
                        on:click="{() => whiteboard.board.next()}"
                    >
                        <i class="material-icons"> redo </i>
                    </button>
                </div>

                <!-- Save/clear -->
                <div class="btn-group" role="group">
                    <button
                        class="btn btn-success"
                        type="button"
                        on:click="{() =>
                            whiteboard.update({
                                name
                            })}"
                    >
                        <i class="material-icons"> save </i>
                    </button>

                    <button
                        class="btn btn-danger"
                        type="button"
                        on:click="{() => whiteboard.board.clear()}"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
