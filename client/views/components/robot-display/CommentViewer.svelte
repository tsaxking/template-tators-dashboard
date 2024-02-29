<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { TeamComment } from '../../../models/FIRST/team-comments';
import { FIRSTEvent } from '../../../models/FIRST/event';
import '../../../utilities/text';
import { fuzzySearch } from '../../../utilities/text';
import { alert, prompt, select } from '../../../utilities/notifications';
import { dateTime } from '../../../../shared/clock';
import { Account } from '../../../models/account';

type C = {
    comment: string;
    type: string;
    time: number;
    account: Account;
};

export let team: FIRSTTeam;
export let comments: TeamComment[] = [];
let parsed: C[] = [];
let filteredComments: C[] = [];

export let canAdd: boolean = true;

let search = '';

const fns = {
    parse: async (c: TeamComment[]) => {
        parsed = await Promise.all(c.map(async c => {
            return {
                comment: c.comment,
                type: c.type,
                time: c.time,
                account: await Account.get(c.accountId)
            };
        }));
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
        const filtered = fuzzySearch(
            s,
            comments.map(
                c =>
                    c.comment +
                    ' ' +
                    c.type +
                    ' ' +
                    c.account?.username +
                    ' ' +
                    c.account.firstName +
                    ' ' +
                    c.account.lastName
            )
        );
        return comments.filter((_, i) => filtered.includes(i));
    },
    onSet(comments: C[]) {
        jQuery(() => {
            jQuery('[data-bs-toggle="tooltip"]').tooltip();
        });
    }
};

$: filteredComments = fns.filterComments(search, parsed);
$: fns.onSet(filteredComments);
$: fns.parse(comments);
</script>

<input
    type="text"
    bind:value="{search}"
    class="form-control"
    disabled="{!team}"
    placeholder="Search..."
/>

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
                    title="{comment.account?.firstName || ''} {comment.account
                        ?.lastName || ''}"
                    class="cursor-help"
                    >{comment.account?.username || 'Unknown'}</td
                >
                <td>{comment.type}</td>
                <td>{comment.comment}</td>
                <td>{dateTime(comment.time)}</td>
            </tr>
        {/each}
    </tbody>
</table>
{#if canAdd}
    <hr />
    <button class="btn btn-primary" on:click="{fns.addComment}">
        <i class="material-icons">add</i>
        Add Comment
    </button>
{/if}