<script lang="ts">
import { Bar } from "svelte-chartjs";
import { FIRSTEvent } from "../../models/FIRST/event";
import { Color } from "../../submodules/colors/color";


export let event: FIRSTEvent;

let data: {
    title: string;
    labels: string[];
    data: {
        [key: number]: number[];
    };
}[] = [];

let filteredTeams: number[] = [];


const fns = {
    pullData: async (e?: FIRSTEvent) => {
        if (!e) return;
        const res = await e.getEventSummary();
        if (res.isErr()) return console.error(res.error);
        data = res.value;
    }
}

$: fns.pullData(event);
</script>

<div class="container-fluid">
    {#each data as row}
        <div class="row mb-3">
            <div class="card p-0">
                <div class="card-header">
                    <div class="card-title">
                        {row.title}
                    </div>
                </div>
                <div class="card-body">
                    {#each row.labels as label, i}
                        <div class="scroll-x">
                            <div class="chart-containe">
                                <Bar 
                                    data={{
                                        labels: Object.entries(row.data).sort((a, b) => b[1][i] - a[1][i]).map((v) => v[0]),
                                        datasets: [{
                                            label,
                                            data: Object.entries(row.data).sort((a, b) => b[1][i] - a[1][i]).map((v) => v[1][i]),
                                            backgroundColor: Color.random().toString('rgba')
                                        }]
                                    }}

                                    options={{
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        },
                                        responsive: true,
                                        maintainAspectRatio: false
                                    }}
                                />
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {/each}
</div>

<style>

    .chart-container {
        min-width: 1500px;
        width: 100%;
        height: 100%;
    }
</style>