<script lang="ts">
import type {
    Action,
    TraceArray
} from '../../../../shared/submodules/tatorscout-calculations/trace';
//import {Trace} from './../../../shared/submodules/tatorscout-calculations/trace';
export let trace: TraceArray;

type A = {
    [key in Action]: number;
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

<div class="table-responsive">
    <table class="table table-striped">
        <thead>
            <tr>
                <th class="text-center" colspan="2">Auto</th>
            </tr>
        </thead>
        <tbody>
            {#each Object.entries(auto) as [k, v]}
                <tr>
                    <td>{k}</td>
                    <td>{v}</td>
                </tr>
            {/each}
        </tbody>

        <thead>
            <tr>
                <th class="text-center" colspan="2">Tele</th>
            </tr>
        </thead>

        <tbody>
            {#each Object.entries(tele) as [k, v]}
                <tr>
                    <td>{k}</td>
                    <td>{v}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
