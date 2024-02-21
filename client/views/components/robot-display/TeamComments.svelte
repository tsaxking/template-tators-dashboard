<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { TeamComment } from '../../../models/FIRST/team-comments';
import Modal from '../../components/bootstrap/Modal.svelte';
import { FIRSTEvent } from '../../../models/FIRST/event';
import '../../../utilities/text'
import { fuzzySearch } from '../../../utilities/text';

let comments: TeamComment[];
const foundIndicies: number[] = fuzzySearch('my search string', comments.map(c => c.comment));
let foundComments: TeamComment[];
let team: FIRSTTeam;
let key: string;

const fns = {
    getComments: async (t: FIRSTTeam) => {
        if (!t) return;
        const res = await TeamComment.fromTeam(t.number, FIRSTEvent.current);
        if (res.isOk()){
            comments = res.value;
        }
    },
    filterComments: (key: string) => {
        foundComments = comments.filter((_, i) => {
            return foundIndicies.includes(i);
        })
    }
};

fns.getComments(team);
fns.filterComments(key);


</script>

<div class="card p-0">
    <div class="card-header">
        <div class="card-title">
            <h5>Comments</h5>
        </div>
    </div>
    <div class="card-body">
        <input type="text" id="search" bind:value="{key}" on:input="{() => {fns.filterComments(key)}}">
        <ul>
            {#each foundComments as comment}
                <li>{comment.comment}</li>
            {/each}
        </ul>
    </div>
</div>

