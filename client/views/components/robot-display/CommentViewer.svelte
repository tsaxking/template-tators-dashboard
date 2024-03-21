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
    account?: string;
};

export let team: FIRSTTeam | undefined = undefined;
export let comments: TeamComment[] = [];
let parsed: C[] = [];
let filteredComments: C[] = [];

export let canAdd: boolean = true;

let search = '';

const fns = {
    parse: async (c: TeamComment[]) => {
        const accounts = await Account.get(c.map(c => c.accountId));

        parsed = (
            await Promise.all(
                c.map(async (c, i) => {
                    return {
                        comment: c.comment,
                        type: c.type,
                        time: c.time,
                        account: accounts[i]?.username || c.accountId
                    };
                })
            )
        )
            .sort((a, b) => +b.time - +a.time)
            .filter(
                (c, i, a) =>
                    a.findIndex(
                        _c => _c.comment === c.comment && c.time === _c.time
                    ) === i
            );
    },
    addComment: async () => {
        if (!team) return alert('No team selected');
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
            comments.map(c => c.comment + ' ' + c.type + ' ' + c.account)
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

<div class="container">
    <div class="row justify-content-around">
        <div class="col-lg-8 col-sm-6 mb-2">
            <input
                type="text"
                bind:value="{search}"
                class="form-control"
                disabled="{!team}"
                placeholder="Search..."
            />
        </div>
        <div class="col-lg-4 col-sm-6 mb-2">
            {#if canAdd}
                <button
                    class="btn btn-primary w-100"
                    on:click="{fns.addComment}"
                >
                    <i class="material-icons">add</i>
                </button>
            {/if}
        </div>
    </div>
</div>

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
                <td class="cursor-help">{comment.account || 'Unknown'}</td>
                <td>{comment.type}</td>
                <td>{comment.comment}</td>
                <td>{dateTime(comment.time)}</td>
            </tr>
        {/each}
    </tbody>
</table>
