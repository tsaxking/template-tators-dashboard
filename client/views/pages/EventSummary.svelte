<script lang="ts">
    import { Bar } from "svelte-chartjs";
import { FIRSTEvent } from "../../models/FIRST/event";
import { Color } from "../../submodules/colors/color";


    export let event: FIRSTEvent;

    let data: {
        name: string[];
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
        <div class="row">
            <div class="col-12">
                <Bar 
                    data={{
                        labels: Object.keys(row.data),
                        datasets: row.name.map((name, i) => {
                            const c = Color.random();
                            return {
                                label: name,
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
                        }
                    }}
                />
            </div>
        </div>
    {/each}
</div>