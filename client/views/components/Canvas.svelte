<script lang="ts">
    import { onMount } from "svelte";
    import { Canvas } from '../../models/canvas/canvas';

    let canvas: HTMLCanvasElement;

    onMount(() => {
        const ctx = canvas.getContext("2d");
        const c = new Canvas(ctx);
    });
</script>


<canvas id="canvas" bind:this={canvas}></canvas>