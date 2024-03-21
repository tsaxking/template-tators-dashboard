<script lang="ts">
import MatchScouting from '../components/checklist/MatchScouting.svelte';
import TeamChecklist from '../components/checklist/TeamChecklist.svelte';
import { FIRSTTeam } from '../../models/FIRST/team';
import { FIRSTEvent } from '../../models/FIRST/event';

let teams: {
    team: FIRSTTeam;
    pit: string[];
    pictures: boolean;
}[] = [];

let matchScouting: {
    teams: {
        team: number;
        scouted: boolean;
    }[];
    number: number;
    compLevel: string;
}[] = [];

FIRSTEvent.on('select', async e => {
    const [statusRes, teamsRes] = await Promise.all([
        e.getStatus(),
        e.getTeams(),
    ]);
    if (statusRes.isErr()) return console.error(statusRes.error);
    if (teamsRes.isErr()) return console.error(teamsRes.error);

    const { pictures,questions } = statusRes.value;
    const teamsInfo = teamsRes.value;


    teams = teamsInfo.map(t => ({
        team: t,
        pit: questions.find(q => q.team === t.number)?.questions || [],
        pictures: pictures.find(p => p === t.number) ? true : false
    }));
});
</script>

<TeamChecklist {teams} />