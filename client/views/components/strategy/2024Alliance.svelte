<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { Trace } from '../../../../shared/submodules/tatorscout-calculations/trace';
import { FIRSTEvent } from '../../../models/FIRST/event';
import TeamSelect from '../main/TeamSelect.svelte';
import { $Math as M } from '../../../../shared/math';
import { type Result, attemptAsync, resolveAll } from '../../../../shared/check';
import { Bar } from 'svelte-chartjs';



export let team1: FIRSTTeam | undefined = undefined;
export let team2: FIRSTTeam | undefined = undefined;
export let team3: FIRSTTeam | undefined = undefined;
export let color: 'blue' | 'red' = 'blue';

type DataArr = {
    auto: {
        spk: number[];
        amp: number[];
        mobility: number[];
        total: number[];
    },
    teleop: {
        spk: number[];
        amp: number[];
        trp: number[];
        total: number[];
    },
    endgame: {
        clb: number[];
        park: number[];
        total: number[];
    },
    total: number[];
}


const fns = {
    getMatchData: async (team: FIRSTTeam | undefined): Promise<Result<DataArr>> => {
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

            return data.map(d => Trace.score.parse2024(d.trace, d.alliance)).reduce((acc, data) => {
                acc.auto.spk.push(data.auto.spk);
                acc.auto.amp.push(data.auto.amp);
                acc.auto.mobility.push(data.auto.mobility);
                acc.auto.total.push(data.auto.total);

                acc.teleop.spk.push(data.teleop.spk);
                acc.teleop.amp.push(data.teleop.amp);
                acc.teleop.trp.push(data.teleop.trp);
                acc.teleop.total.push(data.teleop.total);

                acc.endgame.clb.push(data.endgame.clb);
                acc.endgame.park.push(data.endgame.park);
                acc.endgame.total.push(data.endgame.total);

                acc.total.push(data.total);

                return acc;
            }, fns.buildDefaultArr()) as DataArr;
        });
    },
    getAllianceData: async (...teams: (FIRSTTeam | undefined)[]) => {
        fns.reset();
        const data = resolveAll(await Promise.all(teams.map(fns.getMatchData)));
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
        ]
    },
    buildDefaultArr: (): DataArr => {
        return {
            auto: {
                spk: [],
                amp: [],
                mobility: [],
                total: []
            },
            teleop: {
                spk: [],
                amp: [],
                trp: [],
                total: []
            },
            endgame: {
                clb: [],
                park: [],
                total: []
            },
            total: []
        }
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
    <div class="card-header bg-{color === 'red' ? 'danger' : 'primary'}">
        <div class="d-flex">
            <TeamSelect bind:selected="{team1}"></TeamSelect>
            <TeamSelect bind:selected="{team2}"></TeamSelect>
            <TeamSelect bind:selected="{team3}"></TeamSelect>
        </div>
    </div>
    <div class="card-body">
        <h5 class="text-center">Average ({M.sum(allianceInfo.map(a => M.average(a.total)))})</h5>
        <Bar 
            data={{
                labels: ['Auto', 'Teleop', 'Endgame', 'Total'],
                datasets: [
                    {
                        label: 'Speaker',
                        data: [
                            M.sum(allianceInfo.map(a => M.average(a.auto.spk))),
                            M.sum(allianceInfo.map(a => M.average(a.teleop.spk))),
                        ]
                    },
                    {
                        label: 'Amplifier',
                        data: [
                            M.sum(allianceInfo.map(a => M.average(a.auto.amp))),
                            M.sum(allianceInfo.map(a => M.average(a.teleop.amp))),
                        ]
                    },
                    {
                        label: 'Mobility',
                        data: [
                            M.sum(allianceInfo.map(a => M.average(a.auto.mobility))),
                        ]
                    },
                    {
                        label: 'Total',
                        data: [
                            0,0,0,
                            // M.sum(allianceInfo.map(a => M.average(a.auto.total))),
                            // M.sum(allianceInfo.map(a => M.average(a.teleop.total))),
                            // M.sum(allianceInfo.map(a => M.average(a.endgame.total))),
                            M.sum(allianceInfo.map(a => M.average(a.total))),
                        ]
                    }
                ]
            }}
            options={
                {
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 60,
                            stacked: true,
                        },
                        x: {
                            stacked: true,
                        }
                    },
                }
            }
        />
        <h5 class="text-center">Max ({M.sum(allianceInfo.map(a => Math.max(...a.total)))})</h5>
        <Bar 
        data={{
            labels: ['Auto', 'Teleop', 'Endgame', 'Total'],
            datasets: [
                {
                    label: 'Speaker',
                    data: [
                        M.sum(allianceInfo.map(a => Math.max(...a.auto.spk))),
                        M.sum(allianceInfo.map(a => Math.max(...a.teleop.spk))),
                    ]
                },
                {
                    label: 'Amplifier',
                    data: [
                        M.sum(allianceInfo.map(a => Math.max(...a.auto.amp))),
                        M.sum(allianceInfo.map(a => Math.max(...a.teleop.amp))),
                    ]
                },
                {
                    label: 'Mobility',
                    data: [
                        M.sum(allianceInfo.map(a => Math.max(...a.auto.mobility))),
                    ]
                },
                {
                    label: 'Total',
                    data: [
                        0,0,0,
                        // M.sum(allianceInfo.map(a => Math.max(...a.auto.total))),
                        // M.sum(allianceInfo.map(a => Math.max(...a.teleop.total))),
                        // M.sum(allianceInfo.map(a => Math.max(...a.endgame.total))),
                        M.sum(allianceInfo.map(a => Math.max(...a.total))),
                    ]
                }
            ]
        }}
        options={
            {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 150,
                        stacked: true,
                    },
                    x: {
                        stacked: true,
                    }
                },
                responsive: true
            }
        }
    />
    </div>
</div>
