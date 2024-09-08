<script lang="ts">
    export let matchScouting: {
        teams: {
            team: number;
            scouted: boolean;
        }[];
        number: number;
        compLevel: string;
    }[] = [];
</script>

<div class="table-responsive">
    <table class="table table-hover table-striped">
        <thead>
            <tr>
                <th>Match</th>
                <th>Comp Level</th>
                <th>Red 1</th>
                <th>Red 2</th>
                <th>Red 3</th>
                <th>Blue 1</th>
                <th>Blue 2</th>
                <th>Blue 3</th>
            </tr>
        </thead>
        <tbody>
            {#each matchScouting as match}
                <tr>
                    <td>{match.number}</td>
                    <td>{match.compLevel}</td>
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
                </tr>
            {/each}
        </tbody>
    </table>
</div>
