<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { TBA } from '../../../utilities/tba';
import type { TBATeamEventStatus } from '../../../../shared/submodules/tatorscout-calculations/tba';
import { $Math as M } from '../../../../shared/math';
import { FIRSTAlliance } from '../../../models/FIRST/alliance';
import { FIRSTMatch } from '../../../models/FIRST/match';

export let team: FIRSTTeam | undefined = undefined;

let rank: number;
let record: [number, number, number] = [0, 0, 0]; // wins, losses, ties
let played: number;
$: played = M.sum(record);
let velocity: number = 0;
let secondsNotMoving: number = 0;
let drivebase: string = '';
let weight: number = 0;

const getData = async (t?: FIRSTTeam) => {
    if (!t) return reset();

    reset();

    const [matches, pitScouting, velocityData, stats, psQuestions] =
        await Promise.all([
            t.event.getMatches(),
            t.getPitScouting(),
            t.getVelocityData(),
            TBA.get<TBATeamEventStatus>(
                `/team/${t.tba.key}/event/${t.event.key}/status`
            ),
            t.event.getPitScouting()
        ]);
    if (matches.isErr()) return reset() || console.error(matches.error);
    if (pitScouting.isErr()) return reset() || console.error(pitScouting.error);
    if (velocityData.isErr())
        return reset() || console.error(velocityData.error);
    if (stats.isErr()) return reset() || console.error(stats.error);
    if (psQuestions.isErr()) return reset() || console.error();

    const teamMatches: {
        match: FIRSTMatch;
        teams: (FIRSTTeam | null)[];
        played: boolean;
    }[] = (
        await Promise.all(
            matches.value.map(async m => {
                const teams = await m.getTeams();
                if (teams.isErr()) {
                    return {
                        match: m,
                        teams: [] as (FIRSTTeam | null)[],
                        played: m.played
                    };
                }
                return {
                    match: m,
                    teams: teams.value as (FIRSTTeam | null)[],
                    played: m.played
                };
            })
        )
    ).filter(m => t && m.teams.includes(t));
    const playedMatches = teamMatches.filter(m => m.played);

    played = playedMatches.length;

    rank = stats.value.data.qual.ranking.rank;
    record = [
        stats.value.data.qual.ranking.record.wins,
        stats.value.data.qual.ranking.record.losses,
        stats.value.data.qual.ranking.record.ties
    ];

    velocity = velocityData.value.average;
    secondsNotMoving = velocityData.value.averageSecondsNotMoving;
    const weightRegex = /weight/i;
    const weightQuestion = psQuestions.value.questions.find(q =>
        weightRegex.test(q.key + q.question)
    );
    const drivebaseRegex = /drivebase|drivetrain|drive|chassis/i;
    const drivebaseQuestion = psQuestions.value.questions.find(q =>
        drivebaseRegex.test(q.key + q.question)
    );

    const weightAnswer = pitScouting.value.find(
        p => p.questionId === weightQuestion?.id
    );
    const drivebaseAnswer = pitScouting.value.find(
        p => p.questionId === drivebaseQuestion?.id
    );

    if (weightAnswer) weight = +weightAnswer.answer[0];
    else weight = 0;
    if (drivebaseAnswer) drivebase = drivebaseAnswer.answer[0];
    else drivebase = '';
};
const reset = () => {
    rank = 0;
    record = [0, 0, 0];
    played = 0;
    velocity = 0;
    secondsNotMoving = 0;
    drivebase = '';
    weight = 0;

    return false;
};

$: getData(team);
</script>

{#if team}
    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <table class="table table-striped table-hover">
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
                            <th>Played</th>
                            <td>{played}</td>
                        </tr>
                        <tr>
                            <td>Drivebase</td>
                            {#if drivebase}
                                <td>{drivebase}</td>
                            {:else}
                                <td>No response found :(</td>
                            {/if}
                        </tr>
                        <tr>
                            <th>Weight</th>
                            {#if weight}
                                <td>{weight} lbs</td>
                            {:else}
                                <td>No response found :(</td>
                            {/if}
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
