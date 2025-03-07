<script lang="ts">
    import { Trace } from '../../../../shared/submodules/tatorscout-calculations/trace';
    import { FIRSTTeam } from '../../../models/FIRST/team';
    import { Bar } from 'svelte-chartjs';
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

    const getEventSummary = async (team?: FIRSTTeam) => {
        if (!team) return;

        data = {
            labels: [],
            datasets: []
        };

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
                    if ([b1, b2, b3].find(r => team.number === r))
                        alliance = 'red';
                }
                return Trace.score.parse2024(m.trace, alliance);
            });

            data = {
                // if you are here because you searched old terms, ignore this file. we don't use this graph anymore.
                labels: [
                    'Avg Spk',
                    'Max Spk',
                    'Avg Amp',
                    'Max Amp',
                    'Avg Trap',
                    'Max Trap'
                ],
                datasets: [
                    {
                        label: 'Auto',
                        data: [
                            // Average Auto Speaker
                            eventSummary.reduce(
                                (acc, val) => acc + val.auto.spk,
                                0
                            ) / eventSummary.length,
                            // Max Auto Speaker
                            Math.max(...eventSummary.map(val => val.auto.spk)),
                            // Average Auto Amp
                            eventSummary.reduce(
                                (acc, val) => acc + val.auto.amp,
                                0
                            ) / eventSummary.length,
                            // Max Auto Amp
                            Math.max(...eventSummary.map(val => val.auto.amp))
                        ]
                    },
                    {
                        label: 'Teleop',
                        data: [
                            // Average Teleop Speaker
                            eventSummary.reduce(
                                (acc, val) => acc + val.teleop.spk,
                                0
                            ) / eventSummary.length,
                            // Max Teleop Speaker
                            Math.max(
                                ...eventSummary.map(val => val.teleop.spk)
                            ),
                            // Average Teleop Amp
                            eventSummary.reduce(
                                (acc, val) => acc + val.teleop.amp,
                                0
                            ) / eventSummary.length,
                            // Max Teleop Amp
                            Math.max(
                                ...eventSummary.map(val => val.teleop.amp)
                            ),
                            // Average Teleop Trap
                            eventSummary.reduce(
                                (acc, val) => acc + val.teleop.trp,
                                0
                            ) / eventSummary.length,
                            // Max Teleop Trap
                            Math.max(...eventSummary.map(val => val.teleop.trp))
                        ]
                    }
                ]
            };
        }
    };

    $: getEventSummary(team);
</script>

<Bar
    {data}
    options="{{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 35
            }
        }
    }}"
/>
