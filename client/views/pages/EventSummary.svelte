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
                    <div class="scroll-x">
                        <div class="chart-container">
                            <Bar 
                                data={{
                                    labels: Object.keys(row.data),
                                    datasets: row.labels.map((label, i) => {
                                        const c = Color.random();
                                        return {
                                            label,
                                            data: Object.values(row.data).map((v) => v[i]),
                                            backgroundColor: c.setAlpha(0.2).toString('rgba'),
                                            borderColor: c.setAlpha(1).toString('rgba'),
                                            borderWidth: 1
                                        }
                                    })
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
                </div>
            </div>
        </div>
    {/each}
</div>

<style>
    .card-body {
        height: 400px;
    }

    .chart-container {
        width: 1500px !important;
        height: 100%;
    }
</style>