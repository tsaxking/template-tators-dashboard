<script lang="ts">
import { Group } from '../../../models/FIRST/question-scouting/group';
import { Question } from '../../../models/FIRST/question-scouting/question';
import Q from './Question.svelte';
import { alert, confirm } from '../../../utilities/notifications';

export let group: Group | undefined = undefined;
export let index: number;

let questions: Question[] = [];

const fns = {
    update: (name: string) => {
        if (!group) return;
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
    },
    delete: async () => {
        if (!group) return;

        const doDelete = await confirm('Are you sure you want to delete this group?');
        if (doDelete) group.delete();
    }
};

Question.on('delete', () => {
    fns.getQuestions(group);
});

Question.on('new', () => {
    fns.getQuestions(group);
});

Question.on('update', () => {
    fns.getQuestions(group);
});

$: {
    fns.getQuestions(group);
}
</script>

{#if group}
    <div class="card p-0">
        <div class="card-header">
            <div class="card-title">
                <div class="d-flex justify-content-between">
                    <div class="form-floating">
                        <input
                            type="text"
                            name="name"
                            id="name-{group.id}"
                            class="form-control"
                            value="{group.name}"
                            on:change="{e => fns.update(e.currentTarget.value)}"
                        />
                        <label for="name-{group.id}">Group Name</label>
                    </div>
                    <button class="btn btn-outline-light" on:click="{fns.delete}">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="container">
                {#each questions as q}
                    <div class="row mb-1">
                        <Q question="{q}" />
                    </div>
                {/each}
            </div>
        </div>
        <div class="card-footer">
            <button class="btn btn-outline-light" on:click="{fns.addQuestion}">
                <i class="material-icons">add</i> Question
            </button>
        </div>
    </div>
{/if}
