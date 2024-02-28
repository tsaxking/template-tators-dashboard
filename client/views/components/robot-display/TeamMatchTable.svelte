<script lang="ts">
import { dateTime } from '../../../../shared/clock';
import { FIRSTEvent } from '../../../models/FIRST/event';
import { FIRSTMatch } from '../../../models/FIRST/match';
import { FIRSTTeam } from '../../../models/FIRST/team';
import { Modal } from '../../../utilities/modals';
import MatchViewer from './MatchViewer.svelte';

export let team: FIRSTTeam;

let matches: FIRSTMatch[] = [];

const fns = {
    getMatches: async (t: FIRSTTeam) => {
        if (!t) return;
        const m = await FIRSTEvent.current.getMatches();
        if (m.isErr()) return console.error(m.error);

        matches = m.value.filter(m => m.teams.includes(t));

        t.on('new-comment', () => fns.getMatches(t));
    },
    viewMatch: (m: FIRSTMatch) => {
        const modal = new Modal(Math.random().toString().substring(2));
        modal.setTitle(`Match ${m.tba.match_number} Details`);

        const viewer = new MatchViewer({
            target: modal.target.querySelector('.modal-body'),
            props: {
                team: team,
                match: m
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

<div class="table-responsive w-100">
    <table class="table table-hover table-striped w-100">
        <caption>
            Click on a match to view the match details
            <br />
            <i>Italicized</i> = Not yet played
            <br />
            <b>Bold</b> = Team won this match
        </caption>
        <thead>
            <tr>
                <th>#</th>
                <th>Level</th>
                <th>Time</th>
                <!-- <th>Result</th> -->
            </tr>
        </thead>
        <tbody>
            {#each matches as match}
                <tr
                    class="cursor-pointer {match.tba.winning_alliance === 'blue'
                        ? 'fw-bold'
                        : ''} {match.played ? '' : 'fst-italics'}"
                    on:click="{() => fns.viewMatch(match)}"
                >
                    {#if match.tba.alliances.red.team_keys.includes(team.tba.key)}
                        <td class="text-danger">{match.tba.match_number}</td>
                        <td class="text-danger">{match.tba.comp_level}</td>
                        <td class="text-danger">{dateTime(match.time)}</td>
                        <!-- <td>{match.tba.winning_alliance ? match.tba.winning_alliance : ''}</td> -->
                    {:else}
                        <td class="text-primary">{match.tba.match_number}</td>
                        <td class="text-primary">{match.tba.comp_level}</td>
                        <td class="text-primary">{dateTime(match.time)}</td>
                        <!-- <td>{match.tba.winning_alliance ? match.tba.winning_alliance : ''}</td> -->
                    {/if}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
