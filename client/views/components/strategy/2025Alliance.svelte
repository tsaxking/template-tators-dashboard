<script lang="ts">
    import { FIRSTTeam } from '../../../models/FIRST/team';
    import { Trace } from '../../../../shared/submodules/tatorscout-calculations/trace';
    import { FIRSTEvent } from '../../../models/FIRST/event';
    import TeamSelect from '../main/TeamSelect.svelte';
    import { $Math as M } from '../../../../shared/math';
    import {
        type Result,
        attemptAsync,
        resolveAll
    } from '../../../../shared/check';
    import { Bar } from 'svelte-chartjs';
    import { FIRSTAlliance } from '../../../models/FIRST/alliance';

    export let alliance: FIRSTAlliance;
    export let color: 'blue' | 'red' = 'blue';

    let team1: FIRSTTeam | undefined;
    let team2: FIRSTTeam | undefined;
    let team3: FIRSTTeam | undefined;

    $: [team1, team2, team3] = alliance.teams;

    // type DataArr = {
    //     auto: {
    //         spk: number[];
    //         amp: number[];
    //         mobility: number[];
    //         total: number[];
    //     };
    //     teleop: {
    //         spk: number[];
    //         amp: number[];
    //         trp: number[];
    //         total: number[];
    //     };
    //     endgame: {
    //         clb: number[];
    //         park: number[];
    //         total: number[];
    //     };
    //     total: number[];
    // };

    type DataArr = {
        auto: {
            cl1: number[];
            cl2: number[];
            cl3: number[];
            cl4: number[];
            prc: number[];
            brg: number[];
            mobility: number[];
            total: number[];
        };
        teleop: {
            cl1: number[];
            cl2: number[];
            cl3: number[];
            cl4: number[];
            prc: number[];
            brg: number[];
            total: number[];
        };
        endgame: {
            shc: number[];
            dpc: number[];
        };
        total: number[];
    };

    const fns = {
        getMatchData: async (
            team: FIRSTTeam | undefined
        ): Promise<Result<DataArr>> => {
            return attemptAsync(async () => {
                if (!team) return fns.buildDefaultArr();

                const matchScouting = await team.getMatchScouting();
                if (matchScouting.isErr()) throw matchScouting.error;
                const matchData = matchScouting.value;
                const event = FIRSTEvent.current;
                const myTeam = FIRSTTeam.current;
                if (!event) throw new Error('Event is undefined');
                if (!myTeam) throw new Error('My team is undefined');

                const res = await event.getMatches();
                if (res.isErr()) throw res.error;

                const matches = res.value;
                const data = await Promise.all(
                    matches.map(async m => {
                        const teams = await m.getTeams();
                        if (teams.isErr()) throw teams.error;
                        const [r1, r2, r3] = teams.value;

                        let alliance: 'red' | 'blue';
                        if ([r1, r2, r3].includes(myTeam)) {
                            alliance = 'red';
                        } else {
                            alliance = 'blue';
                        }

                        return {
                            match: m,
                            alliance,
                            trace:
                                matchData.find(
                                    s =>
                                        s.matchNumber === m.number &&
                                            s.compLevel === m.compLevel
                                )?.trace || []
                        };
                    })
                );

                return data
                    .map(d => Trace.score.parse2025(d.trace, d.alliance))
                    .reduce((acc, data) => {
                        acc.auto.cl1.push(data.auto.cl1);
                        acc.auto.cl2.push(data.auto.cl2);
                        acc.auto.cl3.push(data.auto.cl3);
                        acc.auto.cl4.push(data.auto.cl4);
                        acc.auto.prc.push(data.auto.prc);
                        acc.auto.brg.push(data.auto.brg);
                        acc.auto.mobility.push(data.auto.mobility);
                        acc.auto.total.push(data.auto.total);

                        acc.teleop.cl1.push(data.teleop.cl1);
                        acc.teleop.cl2.push(data.teleop.cl2);
                        acc.teleop.cl3.push(data.teleop.cl3);
                        acc.teleop.cl4.push(data.teleop.cl4);
                        acc.teleop.prc.push(data.teleop.prc);
                        acc.teleop.brg.push(data.teleop.brg);
                        acc.teleop.total.push(data.teleop.total);

                        acc.endgame.shc.push(data.endgame.shc);
                        acc.endgame.dpc.push(data.endgame.dpc);

                        acc.total.push(data.total);

                        return acc;
                    }, fns.buildDefaultArr()) as DataArr;
            });
        },
        getAllianceData: async (...teams: (FIRSTTeam | undefined)[]) => {
            fns.reset();
            const data = resolveAll(
                await Promise.all(teams.map(fns.getMatchData))
            );
            if (data.isErr()) {
                return console.error(data.error);
            }

            allianceInfo = data.value as [DataArr, DataArr, DataArr];
        },
        reset: () => {
            allianceInfo = [
                fns.buildDefaultArr(),
                fns.buildDefaultArr(),
                fns.buildDefaultArr()
            ];
        },
        buildDefaultArr: (): DataArr => {
            return {
                auto: {
                    cl1: [],
                    cl2: [],
                    cl3: [],
                    cl4: [],
                    prc: [],
                    brg: [],
                    mobility: [],
                    total: []
                },
                teleop: {
                    cl1: [],
                    cl2: [],
                    cl3: [],
                    cl4: [],
                    prc: [],
                    brg: [],
                    total: []
                },
                endgame: {
                    shc: [],
                    dpc: []
                },
                total: []
            };
        }
    };

    // team, team, team
    let allianceInfo: [DataArr, DataArr, DataArr] = [
        fns.buildDefaultArr(),
        fns.buildDefaultArr(),
        fns.buildDefaultArr()
    ];

    $: fns.getAllianceData(team1, team2, team3);
//pull matches, match# + comp level, pull alliance
</script>

<div class="card bg-dark text-white">
    <div class="card-body">
        <h5 class="text-center">
            Average ({M.roundTo(
                4,
                M.sum(allianceInfo.map(a => M.average(a.total)))
            )})
        </h5>
        <Bar
            data="{{
                labels: ['Auto', 'Teleop', 'Endgame', 'Total'],
                datasets: [
                    {
                        label: 'Coral Level 1',
                        data: [
                            M.sum(allianceInfo.map(a => M.average(a.auto.cl1))),
                            M.sum(
                                allianceInfo.map(a => M.average(a.teleop.cl1))
                            )
                        ]
                    },
                    {
                        label: 'Coral Level 2',
                        data: [
                            M.sum(allianceInfo.map(a => M.average(a.auto.cl2))),
                            M.sum(
                                allianceInfo.map(a => M.average(a.teleop.cl2))
                            )
                        ]
                    },
                    {
                        label: 'Coral Level 3',
                        data: [
                            M.sum(allianceInfo.map(a => M.average(a.auto.cl3))),
                            M.sum(
                                allianceInfo.map(a => M.average(a.teleop.cl3))
                            )
                        ]
                    },
                    {
                        label: 'Coral Level 4',
                        data: [
                            M.sum(allianceInfo.map(a => M.average(a.auto.cl4))),
                            M.sum(
                                allianceInfo.map(a => M.average(a.teleop.cl4))
                            )
                        ]
                    },
                    {
                        label: 'Processor',
                        data: [
                            M.sum(allianceInfo.map(a => M.average(a.auto.prc))),
                            M.sum(
                                allianceInfo.map(a => M.average(a.teleop.prc))
                            )
                        ]
                    },
                    {
                        label: 'Barge',
                        data: [
                            M.sum(allianceInfo.map(a => M.average(a.auto.brg))),
                            M.sum(
                                allianceInfo.map(a => M.average(a.teleop.brg))
                            )
                        ]
                    },
                    {
                        label: 'Mobility',
                        data: [
                            M.sum(
                                allianceInfo.map(a =>
                                    M.average(a.auto.mobility)
                                )
                            )
                        ]
                    },
                    {
                        label: 'Total',
                        data: [
                            0,
                            0,
                            0,
                            // M.sum(allianceInfo.map(a => M.average(a.auto.total))),
                            // M.sum(allianceInfo.map(a => M.average(a.teleop.total))),
                            // M.sum(allianceInfo.map(a => M.average(a.endgame.total))),
                            M.sum(allianceInfo.map(a => M.average(a.total)))
                        ]
                    }
                ]
            }}"
            options="{{
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 60,
                        stacked: true
                    },
                    x: {
                        stacked: true
                    }
                }
            }}"
        />
        <h5 class="text-center">
            Max ({M.sum(allianceInfo.map(a => Math.max(...a.total)))})
        </h5>
        <Bar
            data="{{
                labels: ['Auto', 'Teleop', 'Endgame', 'Total'],
                datasets: [
                    {
                        label: 'Coral Level 1',
                        data: [
                            M.sum(
                                allianceInfo.map(a => Math.max(...a.auto.cl1))
                            ),
                            M.sum(
                                allianceInfo.map(a => Math.max(...a.teleop.cl1))
                            )
                        ]
                    },
                    {
                        label: 'Coral Level 2',
                        data: [
                            M.sum(
                                allianceInfo.map(a => Math.max(...a.auto.cl2))
                            ),
                            M.sum(
                                allianceInfo.map(a => Math.max(...a.teleop.cl2))
                            )
                        ]
                    },
                    {
                        label: 'Coral Level 3',
                        data: [
                            M.sum(
                                allianceInfo.map(a => Math.max(...a.auto.cl3))
                            ),
                            M.sum(
                                allianceInfo.map(a => Math.max(...a.teleop.cl3))
                            )
                        ]
                    },
                    {
                        label: 'Coral Level 4',
                        data: [
                            M.sum(
                                allianceInfo.map(a => Math.max(...a.auto.cl4))
                            ),
                            M.sum(
                                allianceInfo.map(a => Math.max(...a.teleop.cl4))
                            )
                        ]
                    },
                    {
                        label: 'Processor',
                        data: [
                            M.sum(
                                allianceInfo.map(a => Math.max(...a.auto.prc))
                            ),
                            M.sum(
                                allianceInfo.map(a => Math.max(...a.teleop.prc))
                            )
                        ]
                    },
                    {
                        label: 'Barge',
                        data: [
                            M.sum(
                                allianceInfo.map(a => Math.max(...a.auto.brg))
                            ),
                            M.sum(
                                allianceInfo.map(a => Math.max(...a.teleop.brg))
                            )
                        ]
                    },
                    {
                        label: 'Mobility',
                        data: [
                            M.sum(
                                allianceInfo.map(a =>
                                    Math.max(...a.auto.mobility)
                                )
                            )
                        ]
                    },
                    {
                        label: 'Total',
                        data: [
                            0,
                            0,
                            0,
                            // M.sum(allianceInfo.map(a => Math.max(...a.auto.total))),
                            // M.sum(allianceInfo.map(a => Math.max(...a.teleop.total))),
                            // M.sum(allianceInfo.map(a => Math.max(...a.endgame.total))),
                            M.sum(allianceInfo.map(a => Math.max(...a.total)))
                        ]
                    }
                ]
            }}"
            options="{{
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 150,
                        stacked: true
                    },
                    x: {
                        stacked: true
                    }
                },
                responsive: true
            }}"
        />
    </div>
</div>
