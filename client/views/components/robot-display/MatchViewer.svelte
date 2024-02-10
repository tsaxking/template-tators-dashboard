<script lang="ts">
//import {P, Trace, Action, TraceArray} from '../../../../shared/submodules/tatorscout-calculations/trace';
import { onMount } from 'svelte';
import { Canvas } from '../../../models/canvas/canvas';
import ScoreBreakdown from './ScoreBreakdown.svelte';
import type { TraceArray } from '../../../../shared/submodules/tatorscout-calculations/trace';
import { Img } from '../../../models/canvas/image';
import { Container } from '../../../models/canvas/container';
import { Circle } from '../../../models/canvas/circle';
import { Path } from '../../../models/canvas/path';
import { SVG } from '../../../models/canvas/svg';
import { Icon } from '../../../models/canvas/material-icons';
import { FIRSTTeam } from '../../../models/FIRST/team';
import { FIRSTMatch } from '../../../models/FIRST/match';
import { Color } from '../../../submodules/colors/color';
import { FIRSTEvent } from '../../../models/FIRST/event';

export let team: FIRSTTeam;
export let match: FIRSTMatch;

let canvasEl: HTMLCanvasElement,
    trace: TraceArray = [],
    alliance: 'blue' | 'red' = 'blue';

onMount(() => {
    const ctx = canvasEl.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    const c = new Canvas(ctx);
    c.width = canvasEl.parentElement?.clientWidth || 0;
    c.height = c.width / 2;

    const img = new Img(`/public/pictures/${FIRSTEvent.current.tba.year}field.png`);
    img.options.height = 1;
    img.options.width = 1;
    img.options.x = 0;
    img.options.y = 0;

    const container = new Container();
    container.children = trace.map((p, i, a) => {
        const [_i, x, y, action] = p;

        const color = Color.fromName(alliance).toString('rgba');

        if (action) {
            const size = 0.03;
            const cir = new Circle([x, y], size);
            cir.$properties.fill = {
                color: color
            };
            const a = this.icons[action]?.clone();
            if (a instanceof SVG) {
                a.center = [x, y];
                if (!a.$properties.text) a.$properties.text = {};
                a.$properties.text!.height = size;
                a.$properties.text!.width = size;
                a.$properties.text!.color =
                    Color.fromBootstrap('light').toString('rgba');
            }
            if (a instanceof Icon) {
                a.x = x;
                a.y = y;
                a.size = size;
                a.color = Color.fromBootstrap('light').toString('rgba');
            }
            const cont = new Container(cir, a || null);
            return cont;
        }
        if (a[i - 1]) {
            const p = new Path([
                [a[i - 1][1], a[i - 1][2]],
                [x, y]
            ]);
            p.$properties.line = {
                color: color,
                width: 1
            };
            return p;
        } else {
            return null;
        }
    });

    const from = 0;
    const to = trace.length - 1;

    const filter = (from: number, to: number) => {
        container.filter((_, i) => i >= from && i <= to);
    };

    filter(from, to);

    c.add(img, container);

    c.animate();

    // slider
    jQuery('#slider').slider({
        range: true,
        min: 0,
        max: trace.length - 1,
        values: [from, to],
        slide: (_, ui) => {
            const [from, to] = ui.values;
            filter(from, to);
        }
    });
});

const fns = {
    getTrace(team: FIRSTTeam, match: FIRSTMatch) {},
    getAlliance(team: FIRSTTeam, match: FIRSTMatch) {}
};

$: {
    // TODO: Implement fns.getTrace and fns.getAlliance
    // trace = fns.getTrace(team, match);
    // alliance = fns.getAlliance(team, match);
}
</script>

<canvas id="canvas" bind:this="{canvasEl}"></canvas>
<div id="slider"></div>
<ScoreBreakdown {trace} />
