<script lang="ts">
import Card from '../bootstrap/Card.svelte';
import FloatingInput from '../bootstrap/FloatingInput.svelte';
import Button from '../bootstrap/Button.svelte';
import { createEventDispatcher } from 'svelte';

type Type =
    | 'text'
    | 'textarea'
    | 'number'
    | 'checkbox'
    | 'radio'
    | 'select'
    | 'boolean';

export let question: string;
export let key: string;
export let description: string;
export let type: Type = 'text';

const types: Type[] = [
    'text',
    'textarea',
    'number',
    'checkbox',
    'radio',
    'select',
    'boolean'
];

const dispatch = createEventDispatcher();

const change = () => {
    dispatch('change', {
        question,
        key,
        description,
        type
    });
};
</script>

<Card bind:title="{question}" classes="w-100">
    <div slot="header">
        <div class="btn-group">
            <Button
                color="primary"
                outline="{true}"
                on:click="{() => dispatch('moveCardUp')}"
            >
                <i class="material-icons">arrow_upward</i>
            </Button>
            <Button
                color="info"
                outline="{true}"
                on:click="{() => dispatch('moveCardDown')}"
            >
                <i class="material-icons">arrow_downward</i>
            </Button>
            <Button color="danger" on:click="{() => dispatch('delete')}">
                <i class="material-icons">delete</i>&nbsp;Delete
            </Button>
        </div>
    </div>

    <div slot="body">
        <FloatingInput
            bind:value="{question}"
            label="Question"
            on:change="{change}"
        ></FloatingInput>
        <FloatingInput bind:value="{key}" label="Key" on:change="{change}"
        ></FloatingInput>
        <FloatingInput
            bind:value="{description}"
            label="Description"
            type="textarea"
            on:change="{change}"
        ></FloatingInput>
        <FloatingInput
            bind:value="{type}"
            label="Type"
            type="select"
            on:change="{change}"
        >
            {#each types as type}
                <option value="{type}">{type}</option>
            {/each}
        </FloatingInput>
    </div>
</Card>
