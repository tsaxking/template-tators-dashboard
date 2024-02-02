<script lang="ts">
import { Group } from '../../../models/FIRST/question-scouting/group';
import { Question } from '../../../models/FIRST/question-scouting/question';
import Q from './Question.svelte';
import { alert } from '../../../utilities/notifications';

export let group: Group | undefined = undefined;

let questions: Question[] = [],
    name: string;

const fns = {
    update: () => {
        group.name = name;
        group.update();
    },
    addQuestion: async () => {
        if (!group) return alert('Cannot add question to undefined group');
        const res = await group.addQuestion({
            question: 'New Question',
            type: 'text',
            key: 'key-' + Math.random().toString(36).substring(2, 15),
            options: {},
            description: ''
        });

        if (res.isOk()) {
            questions = [...questions, res.value];
        }
    },
    getQuestions: async (g: Group | undefined) => {
        if (!g) return;
        const res = await g.getQuestions();
        questions = res.isOk() ? res.value : [];
    }
};

$: {
    fns.getQuestions(group);
}
</script>

{#if group}
    <div class="card">
        <div class="card-header">
            <div class="card-title">
                <input
                    type="text"
                    name="name"
                    id="{group.id}-name"
                    bind:value="{group.name}"
                    class="form-control"
                />
            </div>
        </div>
        <div class="card-body">
            <div class="container">
                {#each questions as q}
                    <div class="row">
                        <Q bind:question="{q}" />
                    </div>
                {/each}
                <div class="row">
                    <div class="col">
                        <button
                            class="btn btn-primary"
                            on:click="{fns.addQuestion}"
                        >
                            Create Question
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
