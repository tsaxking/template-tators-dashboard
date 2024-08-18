<script lang="ts">
import { onMount } from 'svelte';
import { FIRSTTeam } from '../../../models/FIRST/team';
import { MatchScouting } from '../../../models/FIRST/match-scouting';
import { dateTime } from '../../../../shared/clock';
import { Modal } from '../../../utilities/modals';
import MatchViewer from './MatchViewer.svelte';

export let team: FIRSTTeam | undefined = undefined;
export let preScouting: boolean = false;

let matches: MatchScouting[] = [];

const set = async (team?: FIRSTTeam) => {
    if (!team) return;
    matches = [];
    const res = preScouting
        ? await team.getPreScouting()
        : await team.getPracticeMatches();

    if (res.isErr()) return console.error(res.error);

    matches = res.value;
};
const viewMatch = async (match: MatchScouting) => {
    if (!team) return alert('No team selected');
    const modal = new Modal();
    modal.setTitle(`Practice Match ${match.matchNumber} Details`);
    modal.size = 'lg';

    const viewer = new MatchViewer({
        target: modal.target.querySelector('.modal-body') as HTMLElement,
        props: {
            team,
            match
        }
    });

    modal.show();

    modal.on('hide', () => {
        modal.destroy();
        viewer.$destroy();
    });
};

$: set(team);

onMount(() => set(team));
</script>

<div class="container-fluid">
    <div class="row mb-3">
        <p>Click on a match to view details</p>
    </div>
    <div class="row">
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Time</th>
                        {#if preScouting}
                            <th>Event</th>
                        {/if}
                    </tr>
                </thead>
                <tbody>
                    {#each matches as match}
                        <tr
                            class="cursor-pointer"
                            on:click="{() => viewMatch(match)}"
                        >
                            <td>{match.matchNumber}</td>
                            <td>{dateTime(match.time)}</td>
                            {#if preScouting}
                                <td>{match.eventKey}</td>
                            {/if}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
