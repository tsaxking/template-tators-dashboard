<script lang="ts">
import { FIRSTEvent } from '../../models/FIRST/event';
import { FIRSTMatch } from '../../models/FIRST/match';
import { FIRSTTeam } from '../../models/FIRST/team';
import Card from '../components/bootstrap/Card.svelte';

let teams: FIRSTTeam[] = [];
let matches: FIRSTMatch[] = [];

FIRSTEvent.on('select', async (event: FIRSTEvent) => {
    const [t, m] = await Promise.all([event.getTeams(), event.getMatches()]);

    teams = t.isOk() ? t.value : teams;
    matches = m.isOk() ? m.value : matches;
});

// TODO: Set up links to the pages

const colorMap = {
    mechanical: 'orange',
    electrical: 'warning',
    picture: 'steel',
    pit: 'info'
};
</script>

<div class="container">
    <div class="row">
        <div class="col-md-6">
            <Card title="Scouting" hidable="{true}">
                <ul class="list-group" slot="body">
                    {#each teams as team}
                        <li class="list-group-item">
                            <span
                                >{team.tba.team_number} | {team.tba
                                    .nickname}</span
                            >
                            <!-- {#each team.required as question}
                                <span class="badge bg-{colorMap[question]} text-dark mx-1">{question}</span>
                            {/each} -->
                        </li>
                    {/each}
                </ul>
            </Card>
        </div>
        <div class="col-md-6">
            <Card
                title="Match Scouting"
                classes="bg-dark text-light"
                hidable="{true}"
            >
                <ul class="list-group" slot="body">
                    {#each matches as match}
                        <li class="list-group-item bg-dark text-light">
                            <span
                                >{match.tba.comp_level} | {match.tba
                                    .match_number}</span
                            >
                            {#each match.teams as team}
                                {#if match.teams.indexOf(team) < 3}
                                    <span
                                        class="badge bg-danger text-light mx-1"
                                        >{team.tba.team_number}</span
                                    >
                                {:else}
                                    <span
                                        class="badge bg-primary text-light mx-1"
                                        >{team.tba.team_number}</span
                                    >
                                {/if}
                            {/each}
                        </li>
                    {/each}
                </ul>
            </Card>
        </div>
    </div>
</div>
