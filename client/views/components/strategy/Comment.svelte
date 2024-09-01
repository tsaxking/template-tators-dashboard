<script lang="ts">
import { onMount } from 'svelte';
import { Strategy } from '../../../models/FIRST/strategy';

export let strategy: Strategy;

let comment: string = '';

const update = () => {
    // if (before === comment) comment = strategy.comment;
};

const submit = (comment: string) => {
    console.log('Submitting strategy comment...');
    if (comment === strategy.comment) return; // no changes
    strategy.update({ comment });
};

onMount(() => {
    strategy.on('update', update);

    return () => {
        strategy.off('update', update);
    };
});

onMount(() => {
    comment = strategy.comment;
});
</script>

<div class="mb-3 bg-gray-light flex-fill p-3 rounded w-75 position-relative">
    <div class="d-flex flex-column justify-content-between align-items-center">
        <h4 class="text-black">Comment</h4>
        <textarea
            class="form-control"
            rows="5"
            on:input="{e => {
                comment = e.currentTarget.value;
            }}">{comment}</textarea
        >
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
