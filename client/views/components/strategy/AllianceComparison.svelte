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
export let team1: FIRSTTeam | undefined = undefined;
export let team2: FIRSTTeam | undefined = undefined;
export let team3: FIRSTTeam | undefined = undefined;
export let team4: FIRSTTeam | undefined = undefined;
export let team5: FIRSTTeam | undefined = undefined;
export let team6: FIRSTTeam | undefined = undefined;
import { $Math as M } from '../../../../shared/math';

let blueBot1 = { avgAuto: 0, avgTele: 0, avgEnd: 0 };
let blueBot2 = { avgAuto: 0, avgTele: 0, avgEnd: 0 };
let blueBot3 = { avgAuto: 0, avgTele: 0, avgEnd: 0 };
let redBot1 = { avgAuto: 0, avgTele: 0, avgEnd: 0 };
let redBot2 = { avgAuto: 0, avgTele: 0, avgEnd: 0 };
let redBot3 = { avgAuto: 0, avgTele: 0, avgEnd: 0 };

const fns = {
    getMatchData: async (team: FIRSTTeam) => {
        const matchScouting = await team.getMatchScouting();
        if (matchScouting.isOk()) {
            const matchData = matchScouting.value;
            let avgAuto = 0;
            let avgTele = 0;
            let avgEnd = 0;
            const event = FIRSTEvent.current;
            const myTeam = FIRSTTeam.current;
            if (!event) return;
            if (!myTeam) return;

            const res = await event.getMatches();
            if (res.isErr()) return console.log(res.error);

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

            for (const match of data) {
                const score = Trace.score.parse2024(
                    match.trace,
                    match.alliance
                );
                avgAuto += score.auto.total;
                avgTele += score.teleop.total;
                avgEnd += score.endgame.total;
            }

            avgAuto /= matchData.length;
            avgTele /= matchData.length;
            avgEnd /= matchData.length;
            return { avgAuto, avgTele, avgEnd };
        }
    },
    getAllianceData: async (...teams: (FIRSTTeam | undefined)[]) => {
        const data = await Promise.all(
            teams.filter(Boolean).map(fns.getMatchData)
        );

        const [d1, d2, d3, d4, d5, d6] = data;
        if (d1) blueBot1 = d1;
        else {
            blueBot1 = {
                avgAuto: 0,
                avgTele: 0,
                avgEnd: 0
            };
        }
        if (d2) blueBot2 = d2;
        else {
            blueBot2 = {
                avgAuto: 0,
                avgTele: 0,
                avgEnd: 0
            };
        }
        if (d3) blueBot3 = d3;
        else {
            blueBot3 = {
                avgAuto: 0,
                avgTele: 0,
                avgEnd: 0
            };
        }
        if (d4) redBot1 = d4;
        else {
            blueBot3 = {
                avgAuto: 0,
                avgTele: 0,
                avgEnd: 0
            };
        }
        if (d5) redBot2 = d5;
        else {
            blueBot3 = {
                avgAuto: 0,
                avgTele: 0,
                avgEnd: 0
            };
        }
        if (d6) redBot3 = d6;
        else {
            blueBot3 = {
                avgAuto: 0,
                avgTele: 0,
                avgEnd: 0
            };
        }
    }
};

let blueAllianceTotal =
    blueBot1.avgAuto +
    blueBot2.avgAuto +
    blueBot3.avgAuto +
    blueBot1.avgTele +
    blueBot2.avgTele +
    blueBot3.avgTele +
    blueBot1.avgEnd +
    blueBot2.avgEnd +
    blueBot3.avgEnd;
let redAllianceTotal =
    redBot1.avgAuto +
    redBot2.avgAuto +
    redBot3.avgAuto +
    redBot1.avgTele +
    redBot2.avgTele +
    redBot3.avgTele +
    redBot1.avgEnd +
    redBot2.avgEnd +
    redBot3.avgEnd;

$: fns.getAllianceData(team1, team2, team3, team4, team5, team6);
//pull matches, match# + comp level, pull alliance
</script>

<div class="container-fluid">
    <div class="row justify-content-between">
        <div class="col-md-4">
            <div class="card bg-danger text-white">
                <div class="card-header">Red Alliance</div>
                <div class="card-body">
                    <TeamSelect bind:selected="{team1}"></TeamSelect>
                    <TeamSelect bind:selected="{team2}"></TeamSelect>
                    <TeamSelect bind:selected="{team3}"></TeamSelect>
                </div>
            </div>
            <div class="card bg-danger text-white">
                <h5 class="card-title">Alliance Summary</h5>
                <p class="card-text">
                    Average auto score: {blueBot1.avgAuto +
                        blueBot2.avgAuto +
                        blueBot3.avgAuto}
                </p>
                <p class="card-text">
                    Average tele score: {blueBot1.avgTele +
                        blueBot2.avgTele +
                        blueBot3.avgTele}
                </p>
                <p class="card-text">
                    Average endgame score: {blueBot1.avgEnd +
                        blueBot2.avgEnd +
                        blueBot3.avgEnd}
                </p>
                <p class="card-text"></p>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card">
                <div class="card-header">Alliance Comparison</div>
                <div class="card-body">
                    <p class="card-text">
                        {blueAllianceTotal > redAllianceTotal
                            ? 'Blue Alliance is better'
                            : 'Red Alliance is better'}
                    </p>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card bg-primary text-white">
                <div class="card-header">Blue Alliance</div>
                <div class="card-body">
                    <TeamSelect bind:selected="{team4}"></TeamSelect>
                    <TeamSelect bind:selected="{team5}"></TeamSelect>
                    <TeamSelect bind:selected="{team6}"></TeamSelect>
                </div>
            </div>
            <div class="card bg-primary text-white">
                <h5 class="card-title">Alliance Summary</h5>
                <p class="card-text">
                    Average auto score: {redBot1.avgAuto +
                        redBot2.avgAuto +
                        redBot3.avgAuto}
                </p>
                <p class="card-text">
                    Average tele score: {redBot1.avgTele +
                        redBot2.avgTele +
                        redBot3.avgTele}
                </p>
                <p class="card-text">
                    Average endgame score: {redBot1.avgEnd +
                        redBot2.avgEnd +
                        redBot3.avgEnd}
                </p>
                <p class="card-text"></p>
            </div>
        </div>
    </div>
</div>
