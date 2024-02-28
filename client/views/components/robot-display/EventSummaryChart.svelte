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

            const eventSummary = matchData.map(m => {
                const velocities = Trace.velocity.map(m.trace);
                const secondsNotMoving = Trace.secondsNotMoving(m.trace, false);
                const climbTimes = Trace.yearInfo[2024].climbTimes(m.trace);
                const score = Trace.score.parse2024(m.trace);
                return {
                    velocities,
                    secondsNotMoving,
                    climbTimes,
                    score
                };
            });

            data = {
                labels: [
                    'Avg Auto',
                    'Max Auto',
                    'Avg Tele',
                    'Max Tele',
                    'Avg Total',
                    'Max Total'
                ],
                datasets: [
                    {
                        label: 'Scores',
                        data: [
                            // Average Auto Score
                            eventSummary.reduce(
                                (acc, cur) => acc + cur.score.auto.total,
                                0
                            ) / eventSummary.length,
                            // Max Auto Score
                            Math.max(
                                ...eventSummary.map(e => e.score.auto.total)
                            ),
                            // Average Teleop Score
                            eventSummary.reduce(
                                (acc, cur) => acc + cur.score.teleop.total,
                                0
                            ) / eventSummary.length,
                            // Max Teleop Score
                            Math.max(
                                ...eventSummary.map(e => e.score.teleop.total)
                            ),
                            // Average Total Score
                            eventSummary.reduce(
                                (acc, cur) => acc + cur.score.total,
                                0
                            ) / eventSummary.length,
                            // Max Total Score
                            Math.max(...eventSummary.map(e => e.score.total))
                        ]
                    }
                ]
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
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }}"
/>
