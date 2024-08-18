<script lang="ts">
import { onMount } from 'svelte';
import { FIRSTTeam } from '../../../models/FIRST/team';
import { TeamComment } from '../../../models/FIRST/team-comments';
import CommentViewer from './CommentViewer.svelte';

export let team: FIRSTTeam | undefined = undefined;

let comments: TeamComment[] = [];

const doGet = async (team?: FIRSTTeam) => {
    if (!team) return;
    comments = [];
    comments = await team.getComments();
};

$: doGet(team);

onMount(() => () => {
    doGet();
    return () => {
        comments = [];
    };
});
</script>

<CommentViewer {team} {comments} />
