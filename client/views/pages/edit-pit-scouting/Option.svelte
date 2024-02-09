<script lang="ts">
import { createEventDispatcher } from 'svelte';

const id = Math.random().toString(36).substring(2);
export let text: string = '';

const dispatch = createEventDispatcher();
</script>

<div class="col-lg-4 col-md-6 col-sm-12 p-0 m-0">
    <div class="d-inline-flex">
        <button class="btn btn-danger h-75 my-auto" on:click="{() => dispatch('delete')}">
            <i class="material-icons">close</i>
        </button>
        <div class="form-floating">
            <input
                type="text"
                class="form-control"
                id="text-{id}"
                bind:value="{text}"
                on:change="{() => dispatch('update', { id, text })}"
            />
            <label for="text-{id}">Option Text</label>
        </div>
    </div>
</div>
