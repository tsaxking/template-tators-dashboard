<script lang="ts">
import { onMount } from 'svelte';
import { FIRSTWhiteboard } from '../../../models/FIRST/whiteboard';
import { type Pens } from '../../../models/whiteboard/board-state';

export let whiteboard: FIRSTWhiteboard;
export let year: number;

let name = whiteboard.name;

let currentPen: keyof Pens = 'black';

let canvasEl: HTMLCanvasElement;

const changePen = (pen: keyof Pens) => {
    whiteboard.board.currentProperties.color = pen;
    currentPen = pen;
};

onMount(() => {
    const ctx = canvasEl.getContext('2d');
    if (!ctx) throw new Error('Could not get 2d context');
    const canvas = whiteboard.buildCanvas(ctx, year);
    if (whiteboard.board.states.length === 0) {
        whiteboard.board.clear();
    } else {
        whiteboard.board.getState()?.setListeners();
    }
    canvas.adaptable = true;
    canvas.animate();
});
</script>

<div class="container-fluid">
    <div class="row mb-3">
        <div
            style="
        width: 100vw;
        height: 100vh;
        position: relative;
    "
        >
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
                on:scroll|preventDefault
                on:select|preventDefault
                on:selectstart|preventDefault
            ></canvas>




            <div class="d-flex" style="position: absolute; top: 10; left: 10;">
                <!-- Pens -->
                <div class="btn-group" role="group">
                    <button
                        class="btn"
                        class:btn-outline-dark="{currentPen !== 'black'}"
                        class:btn-dark="{currentPen === 'black'}"
                        on:click="{() => changePen('black')}"
                    >
                        <i class="material-icons"> brush </i>
                    </button>
                    <button
                        class="btn"
                        class:btn-outline-danger="{currentPen !== 'red'}"
                        class:btn-danger="{currentPen === 'red'}"
                        on:click="{() => changePen('red')}"
                    >
                        <i class="material-icons"> brush </i>
                    </button>
                    <button
                        class="btn btn-primary"
                        class:btn-outline-primary="{currentPen !== 'blue'}"
                        class:btn-primary="{currentPen === 'blue'}"
                        on:click="{() => changePen('blue')}"
                    >
                        <i class="material-icons"> brush </i>
                    </button>
                </div>

                <!-- Functions -->
                <div class="btn-group" role="group">
                    <button
                        class="btn btn-warning"
                        on:click="{() => whiteboard.board.prev()}"
                    >
                        <i class="material-icons"> undo </i>
                    </button>
                    <button
                        class="btn btn-warning"
                        on:click="{() => whiteboard.board.next()}"
                    >
                        <i class="material-icons"> redo </i>
                    </button>
                </div>

                <!-- Save/clear -->
                <div class="btn-group" role="group">
                    <button
                        class="btn btn-success"
                        on:click="{() =>
                            whiteboard.update({
                                name
                            })}"
                    >
                        <i class="material-icons"> save </i>
                    </button>

                    <button
                        class="btn btn-danger"
                        on:click="{() => whiteboard.board.clear()}"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
