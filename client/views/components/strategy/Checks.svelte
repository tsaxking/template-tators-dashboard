<script lang="ts">
    import { Check } from '../../../models/FIRST/strategy';

    export let checks: Check;
</script>

<div>
    <p>
        {checks.team}
    </p>
    <div class="d-flex flex-column">
        {#each Check.checks as c}
            <div class="d-flex flex-row">
                <div class="d-flex flex-column">
                    <h4>{c}</h4>
                </div>
                <div class="d-flex flex-column">
                    <input type="checkbox" on:input="{(e) => {
                        if (e.currentTarget.checked) {
                            checks.add(c);
                        } else {
                            checks.remove(c);
                        }
                    }}" checked={checks.has(c)} />
                </div>
            </div>
        {/each}
    </div>
</div>