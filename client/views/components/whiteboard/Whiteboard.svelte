<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { WhiteboardCache } from '../../../models/FIRST/whiteboard';
import ButtonGroup from '../bootstrap/ButtonGroup.svelte';
import Button from '../bootstrap/Button.svelte';
import { FIRSTMatch } from '../../../models/FIRST/match';

let board: WhiteboardCache;
const ctx = document
    .querySelector('canvas')
    .getContext('2d') as CanvasRenderingContext2D;

FIRSTMatch.on('select', async (m: FIRSTMatch) => {
    const wb = await m.getWhiteboard();
    board = new WhiteboardCache(wb, ctx);
});

board.on('update', state => {});
</script>

<ButtonGroup></ButtonGroup>
<canvas id="whiteboard" width="1000" height="500"></canvas>
