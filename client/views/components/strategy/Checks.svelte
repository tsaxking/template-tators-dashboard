<script lang="ts">
    import { Check } from '../../../models/FIRST/strategy';

    export let checks: Check | undefined;
</script>

{#if checks}
    <div>
        <h4>
            {checks.team}
        </h4>
        <div class="container-fluid">
            <div class="row p-0 m-0">
                {#each Check.checks as c (c)}
                    <div class="col-md-6">
                        <div class="input-group mb-3">
                            <div class="input-group-text">
                                <input
                                    id="check-{c}-{checks.team}"
                                    class="form-check-input mt-0"
                                    checked="{checks.has(c)}"
                                    type="checkbox"
                                    on:input="{e => {
                                        if (e.currentTarget.checked) {
                                            checks.add(c);
                                        } else {
                                            checks.remove(c);
                                        }
                                    }}"
                                />
                            </div>
                            <label
                                class="form-control"
                                for="check-{c}-{checks.team}">{c}</label
                            >
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
{/if}
