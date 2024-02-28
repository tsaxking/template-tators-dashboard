<script lang="ts">
import { Group } from '../../../models/FIRST/question-scouting/group';
import { Question } from '../../../models/FIRST/question-scouting/question';
import { FIRSTTeam } from '../../../models/FIRST/team';
import Q from './ScoutingQuestion.svelte';

export let group: Group | undefined = undefined;
export let index: number;
export let team: FIRSTTeam | undefined = undefined;

let questions: Question[] = [];

const fns = {
    getQuestions: async (g: Group | undefined) => {
        if (!g) return;
        const res = await g.getQuestions();
        if (res.isOk()) {
            questions = res.value;
        } else {
            console.error(res.error);
        }

        const update = () => {
            group = g;
            g.off('new-question', update);
            g.off('delete-question', update);
            g.off('update', update);
        };

        g.on('new-question', update);
        g.on('delete-question', update);
        g.on('update', update);
    }
};

$: {
    fns.getQuestions(group);
}
</script>

{#if group}
    <div class="card p-0">
        <div class="card-header">
            <div class="card-title">
                {group.name}
            </div>
        </div>
        <div class="card-body">
            <div class="container">
                {#each questions as q}
                    <div class="row mb-1">
                        <Q bind:question="{q}" {team} />
                    </div>
                {/each}
            </div>
        </div>
    </div>
{/if}
