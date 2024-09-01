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
            {#each Check.checks as c}
            <div class="col-md-6">
                <div class="input-group mb-3">
                    <div class="input-group-text">
                                    <input
                                    class="form-check-input mt-0"
                    type="checkbox"
                    id="check-{c}-{checks.team}"
                    on:input="{e => {
                        if (e.currentTarget.checked) {
                            checks.add(c);
                        } else {
                            checks.remove(c);
                        }
                    }}"
                    checked="{checks.has(c)}"
                />
                    </div>
                <label class="form-control" for="check-{c}-{checks.team}">{c}</label>
    
                </div>
            </div>

        {/each}
        </div>
    </div>

</div>
{/if}