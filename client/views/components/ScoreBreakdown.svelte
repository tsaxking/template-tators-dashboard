<script lang="ts">
    import type {Action2024, TraceArray} from './../../../shared/submodules/tatorscout-calculations/trace';
    //import {Trace} from './../../../shared/submodules/tatorscout-calculations/trace';
    export let trace: TraceArray

    const filter = (from: number, to: number) => 
        trace.slice(from, to).map(
            (p) => p[3]
        ).filter(Boolean).reduce((acc, cur) => {
            if (acc[cur] === undefined) {
                acc[cur] = 0;
            }

            acc[cur]++;

            return acc;

        }, {} as {
            [key in Action2024]: number;
        });

        let auto;
        let tele;
        $: {auto = filter(0, 60);
            tele = filter(61, 600);
        };
</script>

{#each Object.entries(auto) as [action, count]}
    <div class="row">
        <div class="col-12">
            <h5>{action}: {count}</h5>
        </div>
    </div>
{/each}




<!-- <div class="card" style="width: 18rem;">
    <ul class="list-group list-group-flush">
      
    </ul>
</div> -->

