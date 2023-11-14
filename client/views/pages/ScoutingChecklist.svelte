<script lang="ts">
    import Card from "../components/bootstrap/Card.svelte";

    type Team = {
        number: number;
        name: string;
        required: string[];
    }

    export let teams: Team[] = [];

    type Match = {
        number: number;
        compLevel: 'qm' | 'qf' | 'sf' | 'f';
        teams: number[];
    }

    export let matches: Match[] = [];

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
            <Card title="Scouting" hidable={true}>
                <ul class="list-group" slot="body">
                    {#each teams as team}
                        <li class="list-group-item">
                            <span>{team.number} | {team.name}</span>
                            {#each team.required as question}
                                <span class="badge bg-{colorMap[question]} text-dark mx-1">{question}</span>
                            {/each}
                        </li>
                    {/each}
                </ul>
            </Card>
        </div>
        <div class="col-md-6">
            <Card title="Match Scouting" classes="bg-dark text-light" hidable={true}>
                <ul class="list-group" slot="body">
                    {#each matches as match}
                        <li class="list-group-item bg-dark text-light">
                            <span>{match.compLevel} | {match.number}</span>
                            {#each match.teams as team}
                                <span class="badge bg-danger text-light mx-1">{team}</span>
                            {/each}
                        </li>
                    {/each}
                </ul>
            </Card>
        </div>
    </div>
</div>