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

<div class="table-responsive">
    <table class="table table-dark table-striped">
        <thead>
            <tr>
                <th
                    colspan="2"
                    class="text-center"
                >Auto</th>
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
                <th
                    colspan="2"
                    class="text-center"
                >Tele</th>
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