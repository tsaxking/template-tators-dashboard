<script lang="ts">
import { FIRSTTeam } from "../../../models/FIRST/team";
import { TeamComment } from "../../../models/FIRST/team-comments";
import CommentViewer from "./CommentViewer.svelte";

    export let team: FIRSTTeam;

    let comments: TeamComment[] = [];

    const fns = {
        get: async (team: FIRSTTeam) => {
            const comments = await team.getComments();
        }
    }
</script>

<CommentViewer {team} {comments} />