<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { TeamComment } from '../../../models/FIRST/team-comments';
import { FIRSTEvent } from '../../../models/FIRST/event';
import '../../../utilities/text';
import { fuzzySearch } from '../../../utilities/text';
import { alert, prompt, select } from '../../../utilities/notifications';
import { dateTime } from '../../../../shared/clock';
import { Account } from '../../../models/account';

export let team: FIRSTTeam | undefined = undefined;

type C = {
    account: Account | undefined;
    comment: string;
    type: string;
    time: Date;
};

let comments: C[] = [];
let filteredComments: C[] = [];

let search = '';

const fns = {
    getComments: async (t: FIRSTTeam) => {
        if (!t) return;
        const res = await TeamComment.fromTeam(t.number, FIRSTEvent.current);
        if (res.isOk()) {
            comments = await Promise.all(
                res.value.map(async c => ({
                    account: await Account.get(c.accountId),
                    comment: c.comment,
                    type: c.type,
                    time: new Date(c.time)
                }))
            );
        }

        t.on('new-comment', () => fns.getComments(t));
    },
    addComment: async () => {
        if (!team) alert('No team selected');
        const types = [
            'General',
            'Defensive',
            'Offensive',
            'Auto',
            'Teleop',
            'Endgame'
        ];
        const type = await select('Select Comment Type', types);

        if (type === -1) return;

        const comment = await prompt(`Enter your ${types[type]} comment`);

        if (comment === null) return;

        team.addComment(types[type], comment);
    },
    filterComments: (search: string, comments: C[]) => {
        if (search === '') return comments;
        const s = search.toLowerCase();
        const filtered = fuzzySearch(s, comments.map(c => c.comment + ' ' + c.type + ' ' + c.account?.username + ' ' + c.account.firstName + ' ' + c.account.lastName));
        return comments.filter((_, i) => filtered.includes(i));
    },
    onSet(comments: C[]) {
        jQuery(() => {
            jQuery('[data-bs-toggle="tooltip"]').tooltip();
        });
    }
};

$: fns.getComments(team);
$: filteredComments = fns.filterComments(search, comments);
$: fns.onSet(filteredComments);
</script>

<input type="text" bind:value={search} class="form-control" disabled={!team} placeholder="Search...">

<table class="table table-striped table-hover">
    <thead>
        <tr>
            <th>Account</th>
            <th>Type</th>
            <th>Comment</th>
            <th>Time</th>
        </tr>
    </thead>
    <tbody>
    {#each filteredComments as comment}
        <tr>
            <td 
                data-bs-toggle="tooltip"
                data-bs-placement="left"
                title="{comment.account?.firstName || ''} {comment.account?.lastName || ''}"
                class="cursor-help"
            >{comment.account?.username || 'Unknown'}</td>
            <td>{comment.type}</td>
            <td>{comment.comment}</td>
            <td>{dateTime(comment.time)}</td>
        </tr>
    {/each}
    </tbody>
</table>
<hr />
<button class="btn btn-primary" on:click="{fns.addComment}">
    <i class="material-icons">add</i>
    Add Comment
</button>
