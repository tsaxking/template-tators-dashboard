<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const d = createEventDispatcher();
    export let text: string = '';
</script>

<div class="card">
    <div class="card-body">
        <div class="d-flex justify-content-between">
            <button class="btn btn-danger">
                <i class="material-icons">close</i>
            </button>
        </div>
        <div class="container">
            <div class="row mb-3">
                <label for="text">Option Text</label>
                <input
                    id="text"
                    class="form-control"
                    type="text"
                    bind:value="{text}"
                    on:change="{() => d('update', { text })}"
                />
            </div>
        </div>
    </div>
</div>
