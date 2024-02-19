<script lang="ts">
import {
    Trace,
    type TraceArray
} from '../../../../shared/submodules/tatorscout-calculations/trace';
import { generateTrace } from '../../../../shared/dummy-data';
import { Bar } from 'svelte-chartjs';

export let traces: TraceArray[];

let data: any;

const fns = {
    updateVelocityMap: (traces: TraceArray[]) => {
        if (!traces) return;
        const all = traces
            .map((m) => Trace.velocity.map(m))
            .flat()
            .sort((a, b) => a - b);
        const max = all[all.length - 1];

        const m: number[] = Array.from({ length: max });

        for (let i = 0; i < m.length; i++) {
            m[i] = all.filter(v => Math.floor(v) === i).length;
        }

        data = {
            labels: Array.from({ length: 20 }).map((_, i) => (i + ' fps')),
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

<div class="card p-0">
    <div class="card-header">
        <h5 class="card-title">Velocity Histogram</h5>
    </div>

    <div class="card-body">
        <Bar
            bind:data
            options="{{
                indexAxis: 'x',
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }}"
        />
    </div>
</div>
