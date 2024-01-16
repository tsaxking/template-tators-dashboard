<script lang="ts">
import { fuzzySearch } from '../../utilities/text';

export let searchKey: string = '';
export let searchOptions: string[] = [];
const originalOptions = searchOptions;

function checkStrings() {
    if (searchKey == '') {
        searchOptions = originalOptions;
        return;
    }

    const values = fuzzySearch(searchKey, searchOptions);
    searchOptions = values.map((i: number) => searchOptions[i]);
}
</script>

<input
    bind:value="{searchKey}"
    on:input="{checkStrings}"
    placeholder="Search input"
/>
<ul>
    {#each searchOptions as str}
        <li>
            {str}
        </li>
    {/each}
</ul>
