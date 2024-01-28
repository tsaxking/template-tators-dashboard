<script type="text/typescript">
  //import {P, Trace, Action, TraceArray} from '../../../shared/submodules/tatorscout-calculations/trace'; 
  import { generateTrace } from '../../../shared/dummy-data';
  import { onMount } from "svelte";
  import {Path} from '../../models/canvas/path'
  import { Canvas } from '../../models/canvas/canvas'; 
  import {Circle} from '../../models/canvas/circle';
  import { Container } from '../../models/canvas/container';
  import ScoreBreakdown from './ScoreBreakdown.svelte';

  let canvasEl: HTMLCanvasElement;
  let trace = generateTrace();

  onMount(() => {
      const ctx = canvasEl.getContext("2d");
      const canvas = new Canvas(ctx);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const t = trace.map(p => {
        if(p[3]){
          //If action, make big circle there
          return new Circle([p[1], p[2]], 10)
        }
        return new Circle([p[1], p[2]], 2);
      });
      const container = new Container(...t);
      canvas.add(container);
      canvas.animate();
      const filter = (from: number, to: number) => container.filter((_, i) => i >= from && i <= to);

      const slider = $(create('div', {
        style: {
            height: '10px',
        },
      })).slider({
          range: true,
          min: 0,
          max: 600,
          values: [0, 600],
          slide: function (event, ui) {
              if (!ui?.values) return;
              const [from, to] = ui.values;
              filter(from, to);
          }
      });
      $(document.getElementById("#card")).append(slider);
    });
</script>

<div id="#card" class="card" style="width: 18rem;">
  <div class="card-img-top">
    <canvas id="canvas" bind:this={canvasEl}></canvas>
  </div>
  <ScoreBreakdown {trace}/>
</div>