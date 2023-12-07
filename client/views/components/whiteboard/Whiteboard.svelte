<script lang="ts">
    import { FIRSTTeam } from "../../../models/FIRST/team";
    import { Whiteboard } from "../../../models/whiteboard/whiteboard";

    export let alliances: {
        red: [FIRSTTeam | undefined, FIRSTTeam | undefined, FIRSTTeam | undefined],
        blue: [FIRSTTeam | undefined, FIRSTTeam | undefined, FIRSTTeam | undefined]
    } = {
        red: [undefined, undefined, undefined],
        blue: [undefined, undefined, undefined]
    };

    const canvas = document.getElementById('whiteboard') as HTMLCanvasElement;

    const wb = new Whiteboard(canvas.getContext('2d') as CanvasRenderingContext2D);
</script>


<canvas id="whiteboard" width="1000" height="500"></canvas>