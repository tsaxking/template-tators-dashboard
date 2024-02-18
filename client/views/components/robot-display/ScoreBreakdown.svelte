<script lang="ts">
import type {
    Action2024,
    TraceArray
} from '../../../../shared/submodules/tatorscout-calculations/trace';
//import {Trace} from './../../../shared/submodules/tatorscout-calculations/trace';
export let trace: TraceArray;

type A = {
    [key in Action2024]: number;
};

const filter = (t: TraceArray, from: number, to: number): A =>
    t
        .slice(from, to)
        .map(p => p[3])
        .filter(Boolean)
        .reduce((acc, cur) => {
            if (acc[cur] === undefined) {
                acc[cur] = 0;
            }

            acc[cur]++;

            return acc;
        }, {} as A);

let auto: A, tele: A;
$: {
    auto = filter(trace, 0, 60);
    tele = filter(trace, 61, 600);
}
</script>

<h5>
    Auto
</h5>
{#each Object.entries(auto) as [action, count]}
    <div class="row">
        <div class="col-12">
            <h5>{action}: {count}</h5>
        </div>
    </div>
{/each}
<hr>
<h5>
    Teleop
</h5>
{#each Object.entries(tele) as [action, count]}
    <div class="row">
        <div class="col-12">
            <h5>{action}: {count}</h5>
        </div>
    </div>
{/each}