<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { onMount } from 'svelte';
import { Canvas } from '../../../models/canvas/canvas';
import { Circle } from '../../../models/canvas/circle';
import { generateTrace } from '../../../../shared/dummy-data';
import { Img } from '../../../models/canvas/image';

export let team: FIRSTTeam;

let canvas: HTMLCanvasElement;
const fns = {
    generate: async (team: FIRSTTeam) => {
        if (!team) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const scouting = await team.getMatchScouting();

        if (scouting.isOk()) {
            const matchesRes = await team.event.getMatches();
            if (matchesRes.isErr()) return console.error(matchesRes.error);
            const matches = matchesRes.value;

            // const traceArray = generateTrace(10).filter((p => !!p[3])); // used only for development
            const traceArray = scouting.value.map((m) => {
                const match = matches.find((match) => match.number === m.matchNumber && match.compLevel === m.compLevel);
                // if on red alliance, do x = 1 - x

                // not doing .indexOf because I don't know if the caches are the same, they likely are but I don't want to assume
                let trace = m.trace.slice();
                if (match && match.teams.findIndex(t => t.number === team.number) > 2) {
                    // we don't want to modify the original trace, so we make a copy
                    trace = m.trace.map(p => [p[0], 1 - p[1], p[2], p[3]]);
                }
                return {
                    ...m,
                    trace
                };
            }).map(m => m.trace).flat().filter((p => !!p[3]));
        
            const c = new Canvas(ctx);
            c.ratio = 2;
            c.adaptable = true;

            c.add(
                new Img('/public/pictures/2024field.png', {
                    x: 0,
                    y: 0,
                    width: 1,
                    height: 1
                }),
                ...traceArray.map(t => {
                    return new Circle([t[1], t[2]], .01);
                })
            );

            c.animate();
        } else {
            return console.error(scouting.error);
        }
    }
};

onMount(() => fns.generate(team));

$: fns.generate(team);
</script>

<canvas bind:this="{canvas}"></canvas>
