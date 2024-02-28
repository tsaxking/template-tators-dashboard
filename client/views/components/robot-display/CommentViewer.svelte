<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { TeamComment } from '../../../models/FIRST/team-comments';
import { FIRSTEvent } from '../../../models/FIRST/event';
import '../../../utilities/text';
import { fuzzySearch } from '../../../utilities/text';
// import { TeamComment as TCObject } from '../../../../shared/db-types-extended';
import type {
    TeamComment as TCObject,
    Team
} from '../../../../shared/db-types-extended';
import { Random } from '../../../../shared/math';
import { alert, prompt, select } from '../../../utilities/notifications';
import { dateTime } from '../../../../shared/clock';
import { Account } from '../../../models/account';

export let team: FIRSTTeam | undefined = undefined;

let comments: {
    account: Account | undefined;
    comment: string;
    type: string;
    time: Date;
}[] = [];

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
    }
};

$: fns.getComments(team);
</script>

<table class="table table-striped table-hover">
    <thead>
        <tr>
            <th>Account</th>
            <th>Type</th>
            <th>Comment</th>
            <th>Time</th>
        </tr>
    </thead>
    {#each comments as comment}
        <tr>
            <td>{comment.account?.username || 'Unknown'}</td>
            <td>{comment.type}</td>
            <td>{comment.comment}</td>
            <td>{dateTime(comment.time)}</td>
        </tr>
    {/each}
</table>
<hr />
<button class="btn btn-primary" on:click="{fns.addComment}">
    <i class="material-icons">add</i>
    Add Comment
</button>
