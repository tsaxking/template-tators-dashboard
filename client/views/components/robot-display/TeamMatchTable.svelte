<script lang="ts">
import { dateTime } from '../../../../shared/clock';
import { FIRSTEvent } from '../../../models/FIRST/event';
import { FIRSTMatch } from '../../../models/FIRST/match';
import { MatchScouting, rankColor } from '../../../models/FIRST/match-scouting';
import { FIRSTTeam } from '../../../models/FIRST/team';
import { Modal } from '../../../utilities/modals';
import MatchViewer from './MatchViewer.svelte';
import { checkRanks } from '../../../models/FIRST/match-scouting';
import { capitalize } from '../../../../shared/text';
import { alert } from '../../../utilities/notifications';

export let team: FIRSTTeam | undefined = undefined;

let matches: {
    match: FIRSTMatch;
    scouting?: MatchScouting;
}[] = [];

const fns = {
    getMatches: async (t?: FIRSTTeam) => {
        if (!t) return (matches = []);
        const [matchesRes, matchScoutingRes] = await Promise.all([
            t.event.getMatches(),
            MatchScouting.fromTeam(t.event.key, t.number)
        ]);
        if (matchesRes.isErr()) return console.error(matchesRes.error);
        if (matchScoutingRes.isErr())
            return console.error(matchScoutingRes.error);

        matches = matchesRes.value
            .filter(m => m.teams.includes(t))
            .map(m => ({
                match: m,
                scouting: matchScoutingRes.value.find(
                    s =>
                        s.matchNumber === m.number &&
                        s.compLevel === m.compLevel
                )
            }));

        t.on('new-comment', () => fns.getMatches(t));

        setTimeout(() => {
            jQuery('[data-bs-toggle="tooltip"]').tooltip();
        }, 20);
    },
    viewMatch: async (m: FIRSTMatch) => {
        if (!team) return alert('No team selected');
        const modal = new Modal(Math.random().toString().substring(2));
        modal.setTitle('Match viewer');
        modal.size = 'lg';

        const res = await team.getMatchScouting();
        if (res.isErr()) return console.error(res.error);

        const match = res.value.find(
            s => s.matchNumber === m.number && s.compLevel === m.compLevel
        );

        if (!match) return alert('No match scouting found :(');

        const viewer = new MatchViewer({
            target: modal.target.querySelector('.modal-body') as HTMLElement,
            props: {
                team: team,
                match: match
            }
        });
        modal.show();

        modal.on('hide', () => {
            modal.destroy();
            viewer.$destroy();
        });
    }
};

$: {
    fns.getMatches(team);
}
</script>

<p>
    Click on a match to view the match details
    <br />
    <i>Italicized</i> = Not yet played
    <br />
    <b>Bold</b> = Team won this match
</p>
<div class="table-responsive w-100">
    <table class="table table-hover table-striped w-100">
        <thead>
            <tr>
                <th>#</th>
                <th>Level</th>
                <th>Time</th>
                <th>Flag</th>
            </tr>
        </thead>
        <tbody>
            {#each matches as m}
                <tr
                    class="cursor-pointer {m.match.tba.winning_alliance ===
                    'blue'
                        ? 'fw-bold'
                        : ''} {m.match.played ? '' : 'fst-italics'}"
                    on:click="{() => fns.viewMatch(m.match)}"
                >
                    {#if m.match.tba.alliances.red.team_keys.includes(team?.tba.key || '')}
                        <td class="text-danger">{m.match.tba.match_number}</td>
                        <td class="text-danger">{m.match.tba.comp_level}</td>
                        <td class="text-danger">{dateTime(m.match.time)}</td>
                        <!-- <td>{match.tba.winning_alliance ? match.tba.winning_alliance : ''}</td> -->
                    {:else}
                        <td class="text-primary">{m.match.tba.match_number}</td>
                        <td class="text-primary">{m.match.tba.comp_level}</td>
                        <td class="text-primary">{dateTime(m.match.time)}</td>
                        <!-- <td>{match.tba.winning_alliance ? match.tba.winning_alliance : ''}</td> -->
                    {/if}

                    {#if m.scouting}
                        <td
                            data-bs-toggle="tooltip"
                            title="{capitalize(m.scouting.flag.flag)}"
                            data-bs-placement="top"
                        >
                            <i
                                class="material-icons"
                                style="color: {rankColor[
                                    m.scouting.flag.rank
                                ]?.toString('rgb')} !important;"
                            >
                                flag
                            </i>
                        </td>
                    {:else}
                        <td></td>
                    {/if}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
