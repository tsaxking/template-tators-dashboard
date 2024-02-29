<script lang="ts">
import {
    Trace,
    type TraceArray
} from '../../../../shared/submodules/tatorscout-calculations/trace';
import { Bar } from 'svelte-chartjs';

export let traces: TraceArray[];

let data: any;

const fns = {
    updateVelocityMap: (traces: TraceArray[]) => {
        if (!traces) return;
        const all = traces
            // .map(Trace.expand)
            .map(t => {
                return t.filter((p, i, a) => {
                    const last = a.findLastIndex(v => !!v[3]);
                    return i < last;
                });
            })
            .map(m => Trace.velocity.map(m))
            .flat()
            .sort((a, b) => a - b);
        const max = 20;

        const m: number[] = Array.from({ length: max });

        for (let i = 0; i < m.length; i++) {
            m[i] = all.filter(v => Math.floor(v) === i).length;
        }

        m.shift(); // delete 0

        data = {
            labels: Array.from({ length: max }).map((_, i) => i + 1 + ' fps'),
            datasets: [
                {
                    label: 'Velocity',
                    data: m,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        };
    }
};

$: fns.updateVelocityMap(traces);
</script>

<Bar
    bind:data
    options="{{
        maintainAspectRatio: false,
        indexAxis: 'x',
        scales: {
            y: {
                beginAtZero: true,
                max: 20
            }
        }
    }}"
/>
