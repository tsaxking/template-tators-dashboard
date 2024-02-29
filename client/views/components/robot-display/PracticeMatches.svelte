<script lang="ts">
import { onMount } from "svelte";
import { FIRSTTeam } from "../../../models/FIRST/team";
import { MatchScouting } from "../../../models/FIRST/match-scouting";
import { dateTime } from "../../../../shared/clock";
import { Modal } from "../../../utilities/modals";
import MatchViewer from "./MatchViewer.svelte";

    export let team: FIRSTTeam;

    let matches: MatchScouting[] = [];

    const fns = {
        set: async (team: FIRSTTeam) => {
            if (!team) return;
            const res = await team.getPracticeMatches();

            console.log(res);

            if (res.isErr()) return console.error(res.error);
            
            matches = res.value; 
        },
        viewMatch: async (match: MatchScouting) => {
            const modal = new Modal();
            modal.setTitle(`Practice Match ${match.matchNumber} Details`);
            modal.size = 'lg';

            const viewer = new MatchViewer({
                target: modal.target.querySelector('.modal-body'),
                props: {
                    team,
                    match
                }
            });

            modal.show();

            modal.on('hide', () => {
                modal.destroy();
                viewer.$destroy();
            })
        }
    }

    $: fns.set(team);

    onMount(() => fns.set(team));
</script>

<div class="table-responsive">
    <caption>
        Click on a match to view details
    </caption>

    <table class="table table-striped table-hover">
        <thead>
            <tr>
                <th>#</th>
                <th>Time</th>
            </tr>
        </thead>
        <tbody>
            {#each matches as match}
                <tr class="cursor-pointer" on:click={() => fns.viewMatch(match)}>
                    <td>{match.matchNumber}</td>
                    <td>{dateTime(match.date)}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>