<script lang="ts">
import { FIRSTEvent } from '../../../models/FIRST/event';
import { FIRSTTeam } from '../../../models/FIRST/team';
import { TBA } from '../../../utilities/tba';
import type { TBATeamEventStatus } from '../../../../shared/submodules/tatorscout-calculations/tba';
import { Doughnut } from 'svelte-chartjs';

export let team: FIRSTTeam | undefined = undefined;

let rank: number;
let record: [number, number, number] = [0, 0, 0]; // wins, losses, ties
let played: number;
let velocity: number = 0;
let secondsNotMoving: number = 0;

const fns = {
    getData: async (t?: FIRSTTeam) => {
        if (!t) return;

        const matches = await t.event.getMatches();
        if (matches.isErr()) return console.error(matches.error);

        const teamMatches = matches.value.filter(m => m.teams.includes(t));
        const playedMatches = teamMatches.filter(m => m.played);

        played = playedMatches.length;

        const stats = await TBA.get<TBATeamEventStatus>(
            `/team/${t.tba.key}/event/${t.event.key}/status`
        );

        if (stats.isErr()) return console.error(stats.error);

        rank = stats.value.data.qual.ranking.rank;
        record = [
            stats.value.data.qual.ranking.record.wins,
            stats.value.data.qual.ranking.record.losses,
            stats.value.data.qual.ranking.record.ties
        ];
        const dataRes = await t.getVelocityData();
        if (dataRes.isErr()) return console.error(dataRes.error);

        velocity = dataRes.value.average;

        secondsNotMoving = dataRes.value.averageSecondsNotMoving;
    }
};

$: {
    fns.getData(team);
}
</script>

{#if team}
    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <table class="table">
                    <tbody>
                        <tr>
                            <th>Rank</th>
                            <td>{rank}</td>
                        </tr>
                        <tr>
                            <th>Record</th>
                            <td>{record[0]} - {record[1]} - {record[2]}</td>
                        </tr>
                        <tr>
                            <th>Average Velocity</th>
                            {#if isNaN(velocity)}
                                <td>Cannot calculate velocity yet</td>
                            {:else}
                                <td>{velocity.toFixed(2)} ft/s</td>
                            {/if}
                        </tr>
                        <tr>
                            <th>Average seconds not moving</th>
                            {#if isNaN(secondsNotMoving)}
                                <td>Cannot calculate seconds not moving yet</td>
                            {:else}
                                <td>{secondsNotMoving.toFixed(2)} s</td>
                            {/if}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
{/if}
