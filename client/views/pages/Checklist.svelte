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
    const [statusRes, teamsRes, matchesRes] = await Promise.all([
        e.getStatus(),
        e.getTeams(),
        e.getMatches()
    ]);
    if (statusRes.isErr()) return console.error(statusRes.error);
    if (teamsRes.isErr()) return console.error(teamsRes.error);
    if (matchesRes.isErr()) return console.error(matchesRes.error);

    const { pictures, matches, questions } = statusRes.value;
    const teamsInfo = teamsRes.value;

    matchScouting = matchesRes.value.map((m) => {
        const match = matches.find(_m => _m.match === m.number && _m.compLevel === m.compLevel);
        const unScouted = match.teams;
        const { teams } = m;

        return {
            teams: teams.map(t => ({
            team: t.number,
            scouted: !unScouted.includes(t.number)
        })),
        number: m.number,
        compLevel: m.compLevel
    }
    });

    teams = teamsInfo.map(t => ({
        team: t,
        pit: questions.find(q => q.team === t.number)?.questions || [],
        pictures: pictures.find(p => p === t.number) ? true : false
    }));
});

</script>

<TeamChecklist {teams} />
<MatchScouting {matchScouting} />