<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { TeamComment } from '../../../models/FIRST/team-comments';
import { FIRSTEvent } from '../../../models/FIRST/event';
import '../../../utilities/text'
import { fuzzySearch } from '../../../utilities/text';
import { TeamComment as TCObject } from '../../../../shared/db-types-extended';
import { Random } from '../../../../shared/math';

let comments: TeamComment[];
const foundIndicies: number[] = fuzzySearch('my search string', comments.map(c => c.comment));
let foundComments: TeamComment[];
export let team: FIRSTTeam | undefined = undefined;
let key: string;
let commentData: TCObject;

commentData.team = team.number;
commentData.time = Date.now();
commentData.eventKey = FIRSTEvent.current.key;

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
    },
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
    <div class="card-footer">
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#newCommentModal">
            <span class="material-symbols-outlined">add</span>
        </button>
    </div>  
</div>

<div class="modal fade" id="newCommentModal" tabindex="-1" role="dialog" aria-labelledby="newCommentModal" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="newCommentModal">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <input type="text" bind:value="{commentData.comment}" placeholder="Write your comment here or smth">
          <select class="form-select" aria-label="commentType" bind:value="{commentData.type}">
            <option selected>Select type of comment</option>
            <option value="defensive">Defensive</option>
            <option value="general">General</option>
          </select>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" on:click="{() => {
            if(commentData.comment.length > 0 && commentData.type.length > 0) {
                commentData.id = Random.uuid();
                TeamComment.new(commentData);
            }
          }}">Save changes</button>
        </div>
      </div>
    </div>
</div>