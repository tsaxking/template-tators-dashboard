<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { TBA } from '../../../utilities/tba';
import { Trace } from '../../../../shared/submodules/tatorscout-calculations/trace';
import {
    type TBAMatch,
    teamsFromMatch
} from '../../../../shared/submodules/tatorscout-calculations/tba';
import { FIRSTEvent } from '../../../models/FIRST/event';
import Select from '../bootstrap/Select.svelte';
import TeamSelect from '../main/TeamSelect.svelte';
import { match } from 'assert';
import { attemptAsync, resolveAll } from '../../../../shared/check';
export let team1: FIRSTTeam | undefined = undefined;
export let team2: FIRSTTeam | undefined = undefined;
export let team3: FIRSTTeam | undefined = undefined;
export let color: 'blue' | 'red' = 'blue';

// [min, max, avg]

type Data = {
    auto: {
        spk: number;
        amp: number;
        mobility: number;
        total: number;
    },
    teleop: {
        spk: number;
        amp: number;
        trp: number;
        total: number;
    },
    endgame: {
        clb: number;
        park: number;
        total: number;
    },
    total: number;
}


const fns = {
    getMatchData: async (team: FIRSTTeam | undefined) => {
        return attemptAsync(async () => {
            if (!team) return [];

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

            return data.map(d => Trace.score.parse2024(d.trace, d.alliance));
        });
    },
    getAllianceData: async (...teams: (FIRSTTeam | undefined)[]) => {
        fns.reset();
        const data = resolveAll(await Promise.all(teams.map(fns.getMatchData)));
        if (data.isErr()) {
            return console.error(data.error);
        }

        const scores = data.value.flat();

        const allData: Data[] = scores.map(s => {
            const auto = {
                spk: s.auto.spk,
                amp: s.auto.amp,
                mobility: s.auto.mobility,
                total: s.auto.total
            };
            const teleop = {
                spk: s.teleop.spk,
                amp: s.teleop.amp,
                trp: s.teleop.trp,
                total: s.teleop.total
            };
            const endgame = {
                clb: s.endgame.clb,
                park: s.endgame.park,
                total: s.endgame.total
            };
            const total = s.total;

            return {
                auto,
                teleop,
                endgame,
                total
            };
        });

        allianceInfo = [
            {
                
            }
        ]
    },
    reset: () => {
        allianceInfo = [
            fns.buildDefault(),
            fns.buildDefault(),
            fns.buildDefault()
        ]
    },
    buildDefault: (): Data => {
        return {
            auto: {
                spk: 0,
                amp: 0,
                mobility: 0,
                total: 0
            },
            teleop: {
                spk: 0,
                amp: 0,
                trp: 0,
                total: 0
            },
            endgame: {
                clb: 0,
                park: 0,
                total: 0
            },
            total: 0
        }
    }
};


let allianceInfo: [Data, Data, Data] = [
    fns.buildDefault(),
    fns.buildDefault(),
    fns.buildDefault()
]

$: fns.getAllianceData(team1, team2, team3);
//pull matches, match# + comp level, pull alliance
</script>

<div class="card bg-{color === 'red' ? 'danger' : 'primary'} text-white">
    <div class="card-header">
        <div class="d-flex">
            <TeamSelect bind:selected="{team1}"></TeamSelect>
            <TeamSelect bind:selected="{team2}"></TeamSelect>
            <TeamSelect bind:selected="{team3}"></TeamSelect>
        </div>
    </div>
    <div class="card-body"></div>
</div>
