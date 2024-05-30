<script lang="ts">
//import {P, Trace, Action, TraceArray} from '../../../../shared/submodules/tatorscout-calculations/trace';
import { onMount } from 'svelte';
import { Canvas } from '../../../models/canvas/canvas';
import ScoreBreakdown from './ScoreBreakdown.svelte';
import {
    type TraceArray,
    Trace,
    actions
} from '../../../../shared/submodules/tatorscout-calculations/trace';
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
import { MatchScouting } from '../../../models/FIRST/match-scouting';
import { Random } from '../../../../shared/math';
import MatchVideos from './MatchVideos.svelte';

const id = Random.uuid();

export let team: FIRSTTeam;
export let match: MatchScouting;
export let firstMatch: FIRSTMatch | undefined = undefined;

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
    trp: new Img('/public/pictures/icons/trp.png')
};

const actionColors = {
    // 2024
    spk: Color.fromBootstrap('success'),
    amp: Color.fromBootstrap('primary'),
    src: Color.fromBootstrap('warning'),
    clb: Color.fromBootstrap('danger'),
    trp: Color.fromBootstrap('info'),

    // 2023
    cbe: Color.fromBootstrap('success'),
    cne: Color.fromBootstrap('primary'),
    bal: Color.fromBootstrap('warning'),
    pck: Color.fromBootstrap('danger')
};

const sectionColors: {
    [key: string]: Color;
} = {
    auto: Color.fromName('blue'),
    teleop: Color.fromName('grey'),
    endgame: Color.fromName('red')
};

let keys: {
    action: keyof typeof actions;
    color: Color;
    textColor: Color;
}[] = [];

const checkColors: {
    [key: string]: BootstrapColor;
} = {
    autoMobility: 'success',
    parked: 'success',
    playedDefense: 'primary',
    tippy: 'warning',
    easilyDefended: 'warning',
    robotDied: 'danger',
    problemsDriving: 'danger',
    groundPicks: 'primary'
};

onMount(() => {
    const ctx = canvasEl.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    canvas = new Canvas(ctx);
    canvas.ratio = 2;
    canvas.adaptable = true;

    fns.getTrace(match);

    return () => {
        canvas.clearDrawables();
        stop();
    };
});

let stop = () => {};

const fns = {
    getAlliance: (team: FIRSTTeam, match: FIRSTMatch) => {},
    animate: (trace: TraceArray) => {
        if (!canvas) return;
        canvas.clearDrawables();
        stop();

        const img = new Img(`/public/pictures/${team.event.tba.year}field.png`);
        img.options.height = 1;
        img.options.width = 1;
        img.options.x = 0;
        img.options.y = 0;

        const container = new Container();
        container.children = trace.map((p, i, a) => {
            const [_i, x, y, action] = p;

            if (action) {
                let color = actionColors[action as keyof typeof actionColors];
                if (!color) color = Color.fromName('black');

                const foundKey = keys.find(k => k.action === action);
                if (!foundKey) {
                    keys.push({
                        action: action as keyof typeof actions,
                        color: color.clone(),
                        textColor:
                            color.detectContrast(Color.fromBootstrap('dark')) >
                            color.detectContrast(Color.fromBootstrap('light'))
                                ? Color.fromBootstrap('dark')
                                : Color.fromBootstrap('light')
                    });
                    keys = keys;
                }

                const size = 0.05;
                const cir = new Circle([x, y], size);
                cir.properties.fill = {
                    color: color.toString('rgba')
                };
                cir.properties.line = {
                    color: 'transparent'
                };
                const a = icons[action as keyof typeof icons]?.clone();
                if (a instanceof SVG) {
                    a.center = [x, y];
                    if (!a.properties.text) a.properties.text = {};
                    a.properties.text!.height = size;
                    a.properties.text!.width = size;
                    a.properties.text!.color =
                        Color.fromBootstrap('light').toString('rgba');
                }
                if (a instanceof Icon) {
                    a.x = x;
                    a.y = y;
                    a.size = size;
                    a.color = Color.fromBootstrap('light').toString('rgba');
                }
                if (a instanceof Img) {
                    a.options.x = x - size / 2;
                    a.options.y = y - size;
                    a.options.width = size;
                    a.options.height = size * 2;
                }
                const cont = new Container(cir, a || null);
                return cont;
            }
            if (a[i - 1]) {
                const color = sectionColors[Trace.getSection(p)];
                const path = new Path([
                    [a[i - 1][1], a[i - 1][2]],
                    [x, y]
                ]);
                path.properties.line = {
                    color: color.toString('rgba'),
                    width: 0.5
                };
                return path;
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
            jQuery(`#match-slider-${id}`).slider({
                range: true,
                min: 0,
                max: trace.length - 1,
                values: [from, to],
                slide: (_, ui) => {
                    const [from, to] = ui.values as [number, number];
                    filter(from, to);
                }
            });
        }, 200);
    },
    getTrace: async (m: MatchScouting) => {
        if (!m) return;
        trace = m.trace;
        fns.animate(trace);
        checks = m.checks;
        scout = m.scoutName;
        comments = m.comments;

        const eventMatches = await FIRSTEvent.current?.getMatches();
        if (!eventMatches) return;
        if (eventMatches.isErr()) return console.error(eventMatches.error);
        firstMatch = eventMatches.value.find(
            _m => m.matchNumber === _m.number && m.compLevel === _m.compLevel
        );
    }
};

$: {
    fns.getTrace(match);
}
</script>

<div class="container-fluid">
    <div class="row mb-3">
        <h5>
            {match.matchNumber} | {match.compLevel} | {scout}
        </h5>
    </div>
    <div class="row mb-3">
        <h5 class="text-center">Trace</h5>
        <p>
            {#each keys as key}
                <span
                    class="badge m-1"
                    style="background-color: {key.color.toString(
                        'rgb'
                    )}; color: {key.textColor.toString('rgb')}"
                >
                    {capitalize(actions[key.action])}
                </span>
            {/each}
        </p>
        <div class="w-100 aspect-ratio-2x1 mb-2">
            <canvas id="canvas" bind:this="{canvasEl}"></canvas>
        </div>
        <div id="match-slider-{id}"></div>
        <hr class="m-2" />
    </div>
    <div class="row mb-3">
        <h5 class="text-center">Score Breakdown</h5>
        <ScoreBreakdown {trace} />
        <hr class="m-2" />
    </div>
    <div class="row mb-3">
        <h5 class="text-center">Comments</h5>
        <CommentViewer {comments} {team} canAdd="{false}" />
    </div>
    <div class="row mb-3">
        <h5 class="text-center">Checks</h5>
        <ul class="list-group">
            {#each checks as check}
                <li class="list-group-item text-{checkColors[check]}">
                    {capitalize(fromCamelCase(check))}
                </li>
            {/each}
        </ul>
    </div>
    <div class="row mb-3">
        <MatchVideos bind:match="{firstMatch}" />
    </div>
</div>
