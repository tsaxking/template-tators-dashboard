<script lang="ts">
import { teamsFromMatch } from '../../../../shared/submodules/tatorscout-calculations/tba';
import { FIRSTEvent } from '../../../models/FIRST/event';
import { FIRSTTeam } from '../../../models/FIRST/team';

let teams: {
    team: FIRSTTeam;
    // incomplete
    matches: string[];
    pit: string[];
    pictures: boolean;
}[] = [];

FIRSTEvent.on('select', async e => {
    const [statusRes, teamsRes] = await Promise.all([
        e.getStatus(),
        e.getTeams(),
    ]);
    if (statusRes.isErr()) return console.error(statusRes.error);
    if (teamsRes.isErr()) return console.error(teamsRes.error);

    const { pictures, matches, questions } = statusRes.value;
    const teamsInfo = teamsRes.value;

    teams = teamsInfo.map(t => ({
        team: t,
        matches: matches.filter(m => m.teams.includes(t.number)).map(m => `${m.match} - ${m.compLevel}`),
        pit: questions.find(q => q.team === t.number)?.questions || [],
        pictures: pictures.find(p => p === t.number) ? true : false
    }));
});
</script>

<ul class="list-group">
    {#each teams as { team, matches, pit, pictures }, i}
        <li class="list-group-item">
            <p>
                {team.number} - {team.name}
                {#if matches.length}
                    {#each matches as match}
                        <span class="badge bg-danger rounded-pill mx-2"
                            >{match}</span
                        >
                    {/each}
                {/if}
                {#if pit.length}
                    {#each pit as question}
                        <span class="badge bg-warning rounded-pill mx-2"
                            >{question}</span
                        >
                    {/each}
                {/if}
                {#if !pictures}
                    <span class="badge bg-orange rounded-pill mx-2"
                        >No pictures</span
                    >
                {/if}
            </p>
        </li>
    {/each}
</ul>
