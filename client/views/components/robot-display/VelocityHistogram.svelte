<script lang="ts">
import {
    Trace,
    type TraceArray
} from '../../../../shared/submodules/tatorscout-calculations/trace';
import { generateTrace } from '../../../../shared/dummy-data';
import { Bar } from 'svelte-chartjs';

export let traces: TraceArray[] = Array.from({ length: 10 }).map(generateTrace);

let velocityMap: number[] = [];

let data: any;

const fns = {
    updateVelocityMap: (traces: TraceArray[]) => {
        console.log({ traces });
        const all = traces
            .map(Trace.velocity.map)
            .flat()
            .sort((a, b) => a - b);
        const max = all[all.length - 1];

        console.log({ all });

        const m: number[] = Array.from({ length: max });

        for (let i = 0; i < m.length; i++) {
            m[i] = all.filter(v => Math.floor(v) === i).length;
        }

        velocityMap = m;
        data = {
            labels: Array.from({ length: 20 }).map((_, i) => i.toString()),
            datasets: [
                {
                    label: 'Velocity',
                    data: velocityMap,
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
