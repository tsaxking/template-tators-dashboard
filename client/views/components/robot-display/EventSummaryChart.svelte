<script lang="ts">
import { Trace } from '../../../../shared/submodules/tatorscout-calculations/trace';
import { FIRSTTeam } from '../../../models/FIRST/team';
import { Bar } from 'svelte-chartjs';
import { generateTrace } from '../../../../shared/dummy-data';
import { TBA } from '../../../utilities/tba';
import {
    type TBAMatch,
    teamsFromMatch
} from '../../../../shared/submodules/tatorscout-calculations/tba';

export let team: FIRSTTeam | undefined = undefined;

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
    getEventSummary: async (team?: FIRSTTeam) => {
        if (!team) return;

        data = {
            labels: [],
            datasets: []
        }

        const matches = await team.getMatchScouting();

        const tbaMatches = await TBA.get<TBAMatch[]>(
            `/event/${team.event.key}/matches`
        );
        if (tbaMatches.isErr()) return console.error(tbaMatches.error);
        if (!tbaMatches.value.data)
            return console.error('Could not find tbaMatches');

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
                const foundM = tbaMatches.value.data.find(
                    _m =>
                        m.matchNumber === _m.match_number &&
                        m.compLevel === _m.comp_level
                );

                let alliance: 'red' | 'blue' = 'red';
                if (foundM) {
                    const [, , , b1, b2, b3] = teamsFromMatch(foundM);
                    if (!![b1, b2, b3].find(r => team.number === r))
                        alliance = 'red';
                }

                const velocities = Trace.velocity.map(m.trace);
                const secondsNotMoving = Trace.secondsNotMoving(m.trace, false);
                const climbTimes = Trace.yearInfo[2024].climbTimes(m.trace);
                const score = Trace.score.parse2024(m.trace, alliance);
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
                beginAtZero: true,
                max: 60
            }
        }
    }}"
/>
