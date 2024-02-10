<script lang="ts">
import { FIRSTEvent } from '../../../models/FIRST/event';
import { FIRSTTeam } from '../../../models/FIRST/team';
import { TBA } from '../../../utilities/tba';
import type { TBATeamEventStatus } from '../../../../shared/submodules/tatorscout-calculations/tba';

export let team: FIRSTTeam;

let rank: number;
let record: [number, number, number]; // wins, losses, ties
let played: number;
let rp: number;
let potentialRP: number;

const fns = {
    getData: async (t: FIRSTTeam) => {
        if (!t) return;

        const matches = await FIRSTEvent.current.getMatches();
        if (matches.isErr()) return console.error(matches.error);

        const teamMatches = matches.value.filter(m => m.teams.includes(t));
        const playedMatches = teamMatches.filter(m => m.played);

        potentialRP = playedMatches.reduce(acc => acc += 4, 0); // 4 RP per played match
        played = playedMatches.length;
        
        const stats = await TBA.get<TBATeamEventStatus>(`/team/${t.tba.key}/event/${FIRSTEvent.current.key}/status`);

        if (stats.isErr()) return console.error(stats.error);

        rank = stats.value.data.qual.ranking.rank;
        record = [stats.value.data.qual.ranking.record.wins, stats.value.data.qual.ranking.record.losses, stats.value.data.qual.ranking.record.ties];
        [rp] = stats.value.data.qual.ranking.sort_orders;
    }
};

$: {
    fns.getData(team);
}
</script>
