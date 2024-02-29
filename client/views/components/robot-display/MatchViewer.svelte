<script lang="ts">
//import {P, Trace, Action, TraceArray} from '../../../../shared/submodules/tatorscout-calculations/trace';
import { onMount } from 'svelte';
import { Canvas } from '../../../models/canvas/canvas';
import ScoreBreakdown from './ScoreBreakdown.svelte';
import type { TraceArray } from '../../../../shared/submodules/tatorscout-calculations/trace';
import { Container } from '../../../models/canvas/container';
import { Circle } from '../../../models/canvas/circle';
import { Path } from '../../../models/canvas/path';
import { SVG } from '../../../models/canvas/svg';
import { Icon } from '../../../models/canvas/material-icons';
import { Img } from '../../../models/canvas/image';
import { FIRSTTeam } from '../../../models/FIRST/team';
import { FIRSTMatch } from '../../../models/FIRST/match';
import { Color } from '../../../submodules/colors/color';
import { FIRSTEvent } from '../../../models/FIRST/event';
import { TeamComment } from '../../../models/FIRST/team-comments';
import CommentViewer from './CommentViewer.svelte';
import { fromCamelCase, capitalize } from '../../../../shared/text';
import type { BootstrapColor } from '../../../submodules/colors/color';

export let team: FIRSTTeam;
export let match: FIRSTMatch;

let canvasEl: HTMLCanvasElement,
    alliance: 'blue' | 'red' = 'blue',
    canvas: Canvas,
    trace: TraceArray = [],
    checks: string[] = [],
    comments: TeamComment[] = [],
    scout: string;

const icons = {
    // spk: new Icon('speaker'),
    // amp: new Icon('campaign'),
    // src: new Icon('back_hand'),
    // clb: new Icon('dry_cleaning'),
    // trp: new Icon('place_item')
    spk: new Img('/public/pictures/icons/spk.png'),
    amp: new Img('/public/pictures/icons/amp.png'),
    src: new Img('/public/pictures/icons/src.png'),
    clb: new Img('/public/pictures/icons/clb.png'),
    trp: new Img('/public/pictures/icons/trp.png'),
};

const colors: {
    [key: string]: BootstrapColor;
} = {
    autoMobility: 'success',
    parked: 'success',
    playedDefense: 'primary',
    tippy: 'warning',
    easilyDefended: 'warning',
    robotDied: 'danger',
    problemsDriving: 'danger',
    groundPicks: 'info'
};

onMount(() => {
    const ctx = canvasEl.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    canvas = new Canvas(ctx);
    canvas.ratio = 2;
    canvas.adaptable = true;

    fns.getTrace(team);
});

let stop = () => {};

const fns = {
    getAlliance: (team: FIRSTTeam, match: FIRSTMatch) => {},
    animate: (trace: TraceArray) => {
        if (!canvas) return;
        canvas.clearDrawables();
        stop();

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

        stop = canvas.animate();

        setTimeout(() => {
            jQuery('#match-slider').slider({
                range: true,
                min: 0,
                max: trace.length - 1,
                values: [from, to],
                slide: (_, ui) => {
                    const [from, to] = ui.values;
                    filter(from, to);
                }
            });
        }, 200);
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
                checks = m.checks;
                scout = m.scoutName;
                comments = m.comments;
            }
        }
    }
};

$: {
    fns.getTrace(team);
}
</script>

<div class="container-fluid">
    <div class="row mb-3">
        <h5 class="text-center">
            Trace
        </h5>
        <div class="w-100 aspect-ratio-2x1 mb-2">
            <canvas id="canvas" bind:this="{canvasEl}"></canvas>
        </div>
        <div id="match-slider"></div>
        <hr class="m-2" />
    </div>
    <div class="row mb-3">
        <h5 class="text-center">
            Score Breakdown
        </h5>
        <ScoreBreakdown {trace} />
        <hr class="m-2" />
    </div>
    <div class="row mb-3">
        <h5 class="text-center">
            Comments
        </h5>
        <CommentViewer {comments} {team} canAdd={false} />
    </div>
    <div class="row mb-3">
        <h5 class="text-center">
            Checks
        </h5>
        <ul class="list-group">
            {#each checks as check}
                <li class="list-group-item text-{colors[check]}">{capitalize(fromCamelCase(check))}</li>
            {/each}
        </ul>
    </div>
</div>