<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { onMount } from 'svelte';
import { Canvas } from '../../../models/canvas/canvas';
import { Circle } from '../../../models/canvas/circle';
import { Container } from '../../../models/canvas/container';
import { generateTrace } from '../../../../shared/dummy-data';
import { Img } from '../../../models/canvas/image';
import { type Action, type TraceArray, actions } from '../../../../shared/submodules/tatorscout-calculations/trace';
import { BootstrapColor, Color } from '../../../submodules/colors/color';
import { capitalize } from '../../../../shared/text';

const colors: BootstrapColor[] = [
    'info',
    'light',
    'success',
    'danger',
    'warning',
    'primary'
];

export let team: FIRSTTeam;

let checks: {
    key: string;
    action: string;
    enabled: boolean;
    color: BootstrapColor
}[] = [];

let canvas: HTMLCanvasElement;
let c: Canvas;
const container = new Container();
let traceArray: TraceArray = [];

// stored globally so we don't have to keep requesting it
const img = new Img(
    '/public/pictures/2024field.png',
    {
        x: 0,
        y: 0,
        width: 1,
        height: 1
    }
);

const fns = {
    generate: async (team: FIRSTTeam) => {
        if (!team) return;
            

        checks = Object
        .keys(actions[team.event.year])
        // .keys(actions[2024]) // for development
        .map((k, i) => ({
            key: k,
            action: actions[team.event.year][k],
            enabled: true,
            color: colors[i % colors.length] // loop through the colors
        }));


        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const scouting = await team.getMatchScouting();
        if (!c) c = new Canvas(ctx);
        c.clearDrawables();

        if (scouting.isOk()) {
            // traceArray = generateTrace(10).filter((p => !!p[3])); // used only for development
            
            const matchesRes = await team.event.getMatches();
            if (matchesRes.isErr()) return console.error(matchesRes.error);
            const matches = matchesRes.value;

            traceArray = scouting.value
                .map(m => {
                    const match = matches.find(
                        match =>
                            match.number === m.matchNumber &&
                            match.compLevel === m.compLevel
                    );
                    // if on red alliance, do x = 1 - x

                    // not doing .indexOf because I don't know if the caches are the same, they likely are but I don't want to assume
                    let trace = m.trace.slice();
                    if (
                        match &&
                        match.teams.findIndex(t => t.number === team.number) > 2
                    ) {
                        // we don't want to modify the original trace, so we make a copy
                        trace = m.trace.map(p => [p[0], 1 - p[1], p[2], p[3]]);
                    }
                    return {
                        ...m,
                        trace
                    };
                })
                .map(m => m.trace)
                .flat()
                .filter(p => !!p[3]);

            c.ratio = 2;
            c.adaptable = true;


            container.children = traceArray.map(t => {
                    const c = new Circle([t[1], t[2]], 0.02);
                    const action = t[3] as Action;
                    console.log({action});
                    const found = checks.find(c => c.key === action);
                    console.log({found});
                    c.properties.fill.color = Color.fromBootstrap(found.color || 'dark').toString('rgb');
                    c.properties.line.color = 'transparent';
                    return c;
                });

            c.add(
                img,
                container
            );

            c.animate();
        } else {
            return console.error(scouting.error);
        }
    },
    filter: (trace: TraceArray) => {
        container.filter((c, i) => checks.find(c => c.key === trace[i][3])?.enabled ?? true);
    }
};

onMount(() => fns.generate(team));

$: fns.generate(team);
$: fns.filter(traceArray);
</script>
<div class="container-fluid">
    <div class="row mb-1">
        <div class="btn-group" role="group" aria-label="Select actions">
            {#each checks as check}
                <input type="checkbox" name="action-{check.key}" id="action-{check.key}" class="btn-check" autocomplete="off" checked="{check.enabled}" on:change="{(e) => {
                    checks = checks.map(c => c.key === check.key ? {...c, enabled: e.currentTarget.checked} : c);
                    fns.filter(traceArray);
                }}">
                <label for="action-{check.key}" class="btn btn-outline-{check.color}">
                    {capitalize(check.action)}
                </label>
            {/each}
        </div>
    </div>
    <div class="row" style="height: 300px;">
        <canvas bind:this="{canvas}"></canvas>
    </div>
</div>



