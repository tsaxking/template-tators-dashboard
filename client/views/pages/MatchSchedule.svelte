<script lang="ts">
import { onMount } from 'svelte';
import { dateTime } from '../../../shared/clock';
import { FIRSTEvent } from '../../models/FIRST/event';
import { FIRSTMatch } from '../../models/FIRST/match';

export let loading: boolean;

let matchScouting: {
    teams: {
        team: number;
        scouted: boolean;
    }[];
    match?: FIRSTMatch;
}[] = [];

const init = async (e: FIRSTEvent) => {
    const [statusRes, matchesRes] = await Promise.all([
        e.getStatus(),
        e.getMatches()
    ]);
    if (statusRes.isErr()) return console.error(statusRes.error);
    if (matchesRes.isErr()) return console.error(matchesRes.error);

    const { matches } = statusRes.value;

    const levels = ['qm', 'qf', 'sf', 'f'];

    matchScouting = (
        await Promise.all(
            matchesRes.value.map(async m => {
                const match = matches.find(
                    _m => _m.match === m.number && _m.compLevel === m.compLevel
                );
                if (!match) {
                    return {
                        teams: []
                    };
                }
                const unScouted = match.teams;
                const teams = await m.getTeams();

                if (teams.isErr()) {
                    return {
                        teams: []
                    };
                }

                return {
                    teams: teams.value.filter(Boolean).map(t => ({
                        team: t.number,
                        scouted: !unScouted.includes(t.number)
                    })),
                    match: m
                };
            })
        )
    ).sort((a, b) => {
        if (!a.match || !b.match) return 0;
        if (a.match.compLevel === b.match.compLevel) {
            return a.match.number - b.match.number;
        }
        return (
            levels.indexOf(a.match.compLevel) -
            levels.indexOf(b.match.compLevel)
        );
    });

    loading = false;
};

onMount(() => {
    FIRSTEvent.on('select', init);

    if (FIRSTEvent.current) {
        init(FIRSTEvent.current);
    }

    return () => {
        FIRSTEvent.off('select', init);
        loading = true;
    };
});
</script>

<div class="table-responsive">
    <table class="table table-striped table-hover">
        <thead>
            <tr>
                <th>Match</th>
                <th>Comp Level</th>
                <th>Expected Time</th>
                <th>Red 1</th>
                <th>Red 2</th>
                <th>Red 3</th>
                <th>Blue 1</th>
                <th>Blue 2</th>
                <th>Blue 3</th>
                <th>Results</th>
            </tr>
        </thead>
        <tbody>
            {#each matchScouting as match}
                <tr>
                    <td>{match.match?.number}</td>
                    <td>{match.match?.compLevel}</td>
                    <td
                        >{dateTime(
                            Number(match.match?.tba.predicted_time) * 1000
                        )}</td
                    >
                    {#each match.teams as team, i}
                        {#if i > 2}
                            <td class="table-primary">
                                <span
                                    class="badge bg-{team.scouted
                                        ? 'success'
                                        : 'danger'}"
                                >
                                    {team.team}
                                </span>
                            </td>
                        {:else}
                            <td class="table-danger">
                                <span
                                    class="badge bg-{team.scouted
                                        ? 'success'
                                        : 'danger'}"
                                >
                                    {team.team}
                                </span>
                            </td>
                        {/if}
                    {/each}
                    <td>
                        <a
                            href="https://www.thebluealliance.com/match/{match
                                .match?.tba.key}"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <i class="bi bi-box-arrow-up-right"></i>
                        </a>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
