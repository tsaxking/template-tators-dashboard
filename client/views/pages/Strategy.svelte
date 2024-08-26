<script lang="ts">
import { onMount } from 'svelte';
import AllianceComparison from '../components/strategy/2024Alliance.svelte';

export let loading: boolean;

onMount(() => {
    loading = false;
    return () => (loading = true);
});
</script>

<div class="container-fluid">
    <div class="row">
        <div class="col-md-6">
            <AllianceComparison color="red" />
        </div>
        <div class="col-md-6">
            <AllianceComparison color="blue" />
        </div>
    </div>
</div>
