<script lang="ts">
import { Trace } from '../../../../shared/submodules/tatorscout-calculations/trace';
import { FIRSTTeam } from '../../../models/FIRST/team';
import { Bar } from 'svelte-chartjs';
import { generateTrace } from '../../../../shared/dummy-data';

export let team: FIRSTTeam;

let data: {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        // backgroundColor: string;
    }[];
} = {
    labels: [],
    datasets: []
};

const fns = {
    getEventSummary: async (team: FIRSTTeam) => {
        if (!team) return;
        const matches = await team.getMatchScouting();
        if (matches.isOk()) {
            // for development
            // DELETE THIS IN PRODUCTION
            // Object.assign(matches, {
            //     value: new Array(10).fill(0).map(() => ({
            //         trace: generateTrace()
            //     }))
            // });

            const matchData = matches.value;

            const eventSummary = matchData.map(m =>
                Trace.score.parse2024(m.trace)
            );

            data = {
                labels: [
                    'Average Auto Speaker',
                    'Max Auto Speaker',
                    'Average Auto Amp',
                    'Max Auto Amp',

                    'Average Teleop Speaker',
                    'Max Teleop Speaker',
                    'Average Teleop Amp',
                    'Max Teleop Amp',
                    'Average Teleop Trap',
                    'Max Teleop Trap'
                ],
                datasets: [{
                    label: 'Scores',
                    data: [
                        // Average Auto Speaker
                        eventSummary.reduce((acc, val) => acc + val.auto.spk, 0) / eventSummary.length,
                        // Max Auto Speaker
                        Math.max(...eventSummary.map(val => val.auto.spk)),
                        // Average Auto Amp
                        eventSummary.reduce((acc, val) => acc + val.auto.amp, 0) / eventSummary.length,
                        // Max Auto Amp
                        Math.max(...eventSummary.map(val => val.auto.amp)),
                        // Average Teleop Speaker
                        eventSummary.reduce((acc, val) => acc + val.teleop.spk, 0) / eventSummary.length,
                        // Max Teleop Speaker
                        Math.max(...eventSummary.map(val => val.teleop.spk)),
                        // Average Teleop Amp
                        eventSummary.reduce((acc, val) => acc + val.teleop.amp, 0) / eventSummary.length,
                        // Max Teleop Amp
                        Math.max(...eventSummary.map(val => val.teleop.amp)),
                        // Average Teleop Trap
                        eventSummary.reduce((acc, val) => acc + val.teleop.trp, 0) / eventSummary.length,
                        // Max Teleop Trap
                        Math.max(...eventSummary.map(val => val.teleop.trp))
                    ]
                }]
            };
        }
    }
};

$: {
    fns.getEventSummary(team);
}
</script>

<Bar
    {data}
    options="{{
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }}"
/>