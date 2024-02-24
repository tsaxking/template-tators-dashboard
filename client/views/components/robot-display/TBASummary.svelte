<script lang="ts">
import { FIRSTEvent } from '../../../models/FIRST/event';
import { FIRSTTeam } from '../../../models/FIRST/team';
import { TBA } from '../../../utilities/tba';
import type { TBATeamEventStatus } from '../../../../shared/submodules/tatorscout-calculations/tba';
import { Doughnut } from 'svelte-chartjs';

export let team: FIRSTTeam;

let rank: number;
let record: [number, number, number] = [0, 0, 0]; // wins, losses, ties
let played: number;
let rp: number;
let potentialRP: number;

const fns = {
    getData: async (t: FIRSTTeam) => {
        if (!t) return;

        const matches = await FIRSTEvent.current.getMatches();
        if (matches.isErr()) return console.error(matches.error);

        const teamMatches = matches.value.filter(m => m.teams.includes(t));
        const playedMatches = teamMatches.filter(m => m.played);

        potentialRP = playedMatches.reduce(acc => (acc += 4), 0); // 4 RP per played match
        played = playedMatches.length;

        const stats = await TBA.get<TBATeamEventStatus>(
            `/team/${t.tba.key}/event/${FIRSTEvent.current.key}/status`
        );

        if (stats.isErr()) return console.error(stats.error);

        rank = stats.value.data.qual.ranking.rank;
        record = [
            stats.value.data.qual.ranking.record.wins,
            stats.value.data.qual.ranking.record.losses,
            stats.value.data.qual.ranking.record.ties
        ];
        const [avgRP] = stats.value.data.qual.ranking.sort_orders;
        rp = avgRP * played;
    }
};

$: {
    fns.getData(team);
}
</script>

<div class="card p-0">
    <div class="card-header">
        <div class="card-title">
            <h5>Summary</h5>
        </div>
    </div>
    <div class="card-body">
        {#if team}
            <div class="container">
                <div class="row">
                    <div class="col">
                        <h5>Rank Points:</h5>
                        <div>
                            <Doughnut
                                data="{{
                                    labels: ['Earned', 'Potential'],
                                    datasets: [
                                        {
                                            label: 'RP',
                                            data: [rp, potentialRP - rp],
                                            backgroundColor: [
                                                'rgb(255, 99, 132)',
                                                'rgb(54, 162, 235)'
                                            ],
                                            hoverOffset: 4
                                        }
                                    ]
                                }}"
                                options="{{
                                    responsive: true,
                                    maintainAspectRatio: false
                                }}"
                            />
                        </div>
                    </div>
                    <div class="col">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <th>Rank</th>
                                    <td>{rank}</td>
                                </tr>
                                <tr>
                                    <th>Record</th>
                                    <td
                                        >{record[0]} - {record[1]} - {record[2]}</td
                                    >
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>