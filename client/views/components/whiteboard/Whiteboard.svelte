<script lang="ts">
  import { FIRSTTeam } from '../../../models/FIRST/team';
  import { FIRSTWhiteboard } from '../../../models/FIRST/whiteboard';
  import ButtonGroup from '../bootstrap/ButtonGroup.svelte';
  import Button from '../bootstrap/Button.svelte';
  import { FIRSTMatch } from '../../../models/FIRST/match';

  let board: FIRSTWhiteboard;
  const ctx = document
    .querySelector('canvas')
    .getContext('2d') as CanvasRenderingContext2D;

  FIRSTMatch.on('select', async (m: FIRSTMatch) => {
    const wb = await m.getWhiteboard();
    board = new FIRSTWhiteboard(wb, ctx);
  });

  board.on('update', state => {});
</script>

<ButtonGroup />
<canvas
  id="whiteboard"
  height="500"
  width="1000" />
