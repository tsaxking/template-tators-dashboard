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
    alliance: 'blue' | 'red' = 'blue',
    canvas: Canvas,
    trace: TraceArray = [];

const icons = {
    spk: new Icon('speaker'),
    amp: new Icon('campaign'),
    src: new Icon('back_hand'),
    clb: new Icon('dry_cleaning'),
    trp: new Icon('place_item')
};

onMount(() => {
    const ctx = canvasEl.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    canvas = new Canvas(ctx);
    canvas.ratio = 2;
    canvas.adaptable = true;
});

const fns = {
    getAlliance: (team: FIRSTTeam, match: FIRSTMatch) => {},
    animate: (trace: TraceArray) => {
        if (!canvas) return;
        canvas.clearDrawables();

        const img = new Img(
            `/public/pictures/${FIRSTEvent.current.tba.year}field.png`
        );
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
                const a = icons[action]?.clone();
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

        canvas.add(img, container);

        canvas.animate();

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
    },
    getTrace: async (team: FIRSTTeam) => {
        if (!team) return;
        const res = await team.getMatchScouting();
        if (res.isOk()) {
            const matches = res.value;
            const m = matches.find(
                m =>
                    m.matchNumber === match.number &&
                    m.compLevel === match.compLevel
            );
            if (m) {
                trace = m.trace;
                fns.animate(trace);
            }
        }
    }
};

$: {
    fns.getTrace(team);
}
</script>

<div class="w-100 aspect-ratio-2x1">
    <canvas id="canvas" bind:this="{canvasEl}"></canvas>
</div>
<div id="slider"></div>
<hr class="bg-light" />
<ScoreBreakdown {trace} />
