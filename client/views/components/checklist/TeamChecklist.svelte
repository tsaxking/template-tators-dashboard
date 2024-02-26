<script lang="ts">
import { teamsFromMatch } from '../../../../shared/submodules/tatorscout-calculations/tba';
    import { FIRSTEvent } from '../../../models/FIRST/event';
    import { FIRSTTeam } from '../../../models/FIRST/team';

    let teams: {
        team: FIRSTTeam,
        // incomplete
        matches: string[],
        pit: string[],
        pictures: boolean
    }[] = [];

    FIRSTEvent.on('select', async(e) => {
        const [teamRes, matchRes, pitQuestions] = await Promise.all([
            e.getTeams(),
            e.getMatches(),
            e.getPitScouting()
        ]);
        if (teamRes.isOk() && matchRes.isOk() && pitQuestions.isOk()) {
            teams = await Promise.all(teamRes.value.map(async t => {
                const [matches, pit, pictures] = await Promise.all([
                    t.getMatchScouting(),
                    t.getPitScouting(),
                    t.getPictures()
                ]);

                return {
                    team: t,
                    matches: matches.isOk() ? matchRes.value.filter(m => {
                        return teamsFromMatch(m.tba).includes(t.number);
                    }).filter(m => {
                        // filter out matches that have been scouted
                        return !matches.value.find(s => s.matchNumber === m.number && s.compLevel === m.compLevel);
                    }).map(m => `${m.compLevel} ${m.number}`) : [],
                    pit: pit.isOk() ? pitQuestions.value.questions.filter(q => {
                        // filter out pit questions that have been answered
                        return !pit.value.find(s => s.questionId === q.id)
                    }).map(q => q.key) : [],
                    pictures: pictures.isOk() ? !!pictures.value.length : false
                };
            }));
        }
    });
</script>



<ul class="list-group">
    {#each teams as { team, matches, pit, pictures }, i}
        <li class="list-group-item">
            <p>
                {team.number} - {team.name}
                {#if matches.length}
                    {#each matches as match}
                        <span class="badge bg-danger rounded-pill mx-2">{match}</span>
                    {/each}
                {/if}
                {#if pit.length}
                    {#each pit as question}
                        <span class="badge bg-warning rounded-pill mx-2">{question}</span>
                    {/each}
                {/if}
                {#if !pictures}
                    <span class="badge bg-orange rounded-pill mx-2">No pictures</span>
                {/if}
            </p>
        </li>
    {/each}
</ul>