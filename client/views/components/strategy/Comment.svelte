<script lang="ts">
    import { onMount } from 'svelte';
    import { Strategy } from '../../../models/FIRST/strategy';

    export let strategy: Strategy;

    let comment: string = '';

    $: comment = strategy.comment;

    const update = () => {
    // if (before === comment) comment = strategy.comment;
    };

    const submit = (comment: string) => {
        // console.log('Submitting strategy comment...');
        if (comment === strategy.comment) return; // no changes
        strategy.update({ comment });
    };

    onMount(() => {
        strategy.on('update', update);
        comment = strategy.comment.trim();
        if (!comment) defaultComment();

        return () => {
            strategy.off('update', update);
        };
    });

    const defaultComment = async () => {
        const res = await strategy.getTeams();
        if (res.isErr()) return console.error(res.error);
        const teams = res.value.filter(Boolean);

        const templates = [
            'Auto Starting Location',
            'Auto Routine',
            'Main Teleop Role',
            'Endgame',
        ];

        const red = teams.slice(0, 3);
        const blue = teams.slice(3, 6);

        let str: string;

        if (red.some(t => t.number === 2122)) {
            str = `Red Alliance:
    ${red[0].number} - ${red[0].name}
        ${templates.join(':\n        ')}:
    ${red[1].number} - ${red[1].name}
        ${templates.join(':\n        ')}:
    ${red[2].number} - ${red[2].name}
        ${templates.join(':\n        ')}:

Blue Alliance:
    ${blue[0].number} - ${blue[0].name}
        ${templates.join(':\n        ')}:
    ${blue[1].number} - ${blue[1].name}
        ${templates.join(':\n        ')}:
    ${blue[2].number} - ${blue[2].name}
        ${templates.join(':\n        ')}:`;
        } else {

            str = `Blue Alliance:
    ${blue[0].number} - ${blue[0].name}
        ${templates.join(':\n        ')}:
    ${blue[1].number} - ${blue[1].name}
        ${templates.join(':\n        ')}:
    ${blue[2].number} - ${blue[2].name}
        ${templates.join(':\n        ')}:
Red Alliance:
    ${red[0].number} - ${red[0].name}
        ${templates.join(':\n        ')}:
    ${red[1].number} - ${red[1].name}
        ${templates.join(':\n        ')}:
    ${red[2].number} - ${red[2].name}
        ${templates.join(':\n        ')}:`;
        }

        comment = str.trim();
    };
</script>

<div class="mb-3 bg-gray-light flex-fill p-3 rounded w-75 position-relative">
    <div class="d-flex flex-column justify-content-between align-items-center">
        <h4 class="text-black">Comment</h4>
        <textarea
            class="form-control"
            rows="30"
            on:input="{e => {
                comment = e.currentTarget.value;
            }}">{comment}</textarea
        >
        {#if strategy.comment !== comment}
            <small class="text-danger">Unsaved changes</small>
            <button
                class="btn btn-primary mt-3"
                type="button"
                on:click="{() => submit(comment)}"
            >
                Save
            </button>
        {/if}
    </div>
</div>
