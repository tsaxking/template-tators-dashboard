<script lang="ts">
import { onMount } from 'svelte';
import { Strategy } from '../../../models/FIRST/strategy';
import { merge } from '../../../../shared/text';

export let strategy: Strategy;

let before = strategy.comment;
let comment: string;
$: comment = strategy.comment;

let staged: string[] = [];

const update = () => {
    if (before !== comment) {
        return staged.push(comment);
    }
    if (!staged.length) return (comment = strategy.comment);
    for (let i = 0; i < staged.length; i++) {
        comment = merge(comment, staged[i]);
    }
};

const submit = (comment: string) => {
    if (comment === strategy.comment) return; // no changes
    strategy.update({ comment });
};

const keyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
        submit(comment);
    }
};

onMount(() => {
    strategy.on('update', update);

    return () => {
        strategy.off('update', update);
    };
});
</script>

<div class="mb-3 bg-gray-light flex-fill p-3 rounded w-75 position-relative">
    <div class="d-flex flex-column justify-content-between align-items-center">
        <h4 class="text-black">Comment</h4>
        <textarea
            class="form-control"
            rows="3"
            bind:value="{comment}"
            on:keydown="{keyDown}"
            on:focus="{() => (before = comment)}"
            on:blur="{() => {
                if (before !== comment) {
                    submit(comment);
                }
                before = comment;
            }}"
        ></textarea>
        {#if strategy.comment !== comment}
            <small class="text-danger">Unsaved changes</small>
            <button
                class="btn btn-primary mt-3"
                on:click="{() => submit(comment)}"
            >
                Save
            </button>
        {/if}
    </div>
</div>
