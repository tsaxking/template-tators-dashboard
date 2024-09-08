<script lang="ts">
import { Bar } from 'svelte-chartjs';
import { FIRSTEvent } from '../../models/FIRST/event';
import { FIRSTTeam } from '../../models/FIRST/team';
import { Color } from '../../submodules/colors/color';
import { onMount } from 'svelte';

const colors = Array.from({ length: 10 }, () =>
    Color.random().toString('rgba')
);

export let event: FIRSTEvent;
export let loading: boolean;

let data: {
    title: string;
    labels: string[];
    data: {
        [key: number]: number[];
    };
}[] = [];

let filteredTeams: number[] = [];
let teams: FIRSTTeam[] = [];

const pullData = async (e?: FIRSTEvent) => {
    if (!e) return;
    const [eventSummary, teamsRes] = await Promise.all([
        e.getEventSummary(),
        e.getTeams()
    ]);
    if (eventSummary.isErr()) return console.error(eventSummary.error);
    if (teamsRes.isErr()) return console.error(teamsRes.error);
    data = eventSummary.value;
    teams = teamsRes.value;
    filteredTeams = teams.map(t => t.number);
    loading = false;
};

onMount(() => {
    pullData(event);
    return () => {
        data = [];
        teams = [];
        filteredTeams = [];
        loading = true;
    };
});

FIRSTEvent.on('select', (e: FIRSTEvent) => {
    pullData(e);
});
</script>

<div class="container-fluid">
    <div class="row mb-3">
        {#each teams as team}
            <!-- checkbox for each team -->
            <div class="col">
                <div class="form-check d-flex">
                    <input
                        class="form-check"
                        type="checkbox"
                        value="{team.number}"
                        bind:group="{filteredTeams}"
                    />
                    <label class="form-check" for="flexCheckDefault">
                        {team.number}
                    </label>
                </div>
            </div>
        {/each}
    </div>
    {#each data as row, k}
        <div class="row mb-3">
            <div class="card p-0">
                <div class="card-header">
                    <div class="card-title">
                        {row.title}
                    </div>
                </div>
                <div class="card-body">
                    {#each row.labels as label, i}
                        <h6>
                            {label}
                        </h6>
                        <div class="scroll-x mb-2">
                            <div class="chart-container">
                                <Bar
                                    data="{{
                                        labels: Object.entries(row.data)
                                            .sort((a, b) => b[1][i] - a[1][i])
                                            .filter(v =>
                                                filteredTeams.includes(+v[0])
                                            )
                                            .map(v => v[0]),
                                        datasets: [
                                            {
                                                label,
                                                data: Object.entries(row.data)
                                                    .sort(
                                                        (a, b) =>
                                                            b[1][i] - a[1][i]
                                                    )
                                                    .filter(v =>
                                                        filteredTeams.includes(
                                                            +v[0]
                                                        )
                                                    )
                                                    .map(v => v[1][i]),
                                                backgroundColor:
                                                    colors[
                                                        colors.length % (i + k)
                                                    ]
                                            }
                                        ]
                                    }}"
                                    options="{{
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        },
                                        responsive: true,
                                        maintainAspectRatio: false
                                    }}"
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
