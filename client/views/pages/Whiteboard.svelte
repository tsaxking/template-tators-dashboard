<script lang="ts" type="module">
    import { TBAMatch } from '../../../shared/tba';
    export let matches: TBAMatch[] = [];

    let activeMatch: TBAMatch|null = null;
</script>

<div class="container">
    <div class="row">
        <div class="col-12">
            <label for="select-match">Select Match</label>
            <select name="select-match" id="select-match">
                {#each matches as match}
                    <option value={match.key}>{match.comp_level} | {match.match_number}</option>
                {/each}
            </select>
        </div>
    </div>
</div>

{#if activeMatch}
    
{/if}