<script lang="ts">
    import { FIRSTEvent } from '../../../models/FIRST/event';
    import { FIRSTTeam } from '../../../models/FIRST/team';

    export let teams: {
        team: FIRSTTeam;
        pit: string[];
        pictures: boolean;
    }[] = [];

    FIRSTEvent.on('select', async e => {
        const [statusRes, teamsRes] = await Promise.all([
            e.getStatus(),
            e.getTeams()
        ]);
        if (statusRes.isErr()) return console.error(statusRes.error);
        if (teamsRes.isErr()) return console.error(teamsRes.error);

        const { pictures, matches, questions } = statusRes.value;
        const teamsInfo = teamsRes.value;

        teams = teamsInfo.map(t => ({
            team: t,
            pit: questions.find(q => q.team === t.number)?.questions || [],
            pictures: pictures.find(p => p === t.number) ? true : false
        }));
    });
</script>

<ul class="list-group">
    {#each teams as { team, pit, pictures }, i}
        <li class="list-group-item">
            <p>
                {team.number} - {team.name}
                {#if pit.length}
                    {#each pit as question}
                        <span class="badge bg-success rounded-pill mx-2"
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
