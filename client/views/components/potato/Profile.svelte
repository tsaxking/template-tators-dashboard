<script lang="ts">
import { capitalize } from '../../../../shared/text';
    import { Potato } from '../../../models/potato/game';
    import { onMount } from 'svelte';

    let potato: Potato | undefined;
    const init = async () => {
        const p = await Potato.getSelf();
        if (p.isErr()) return console.log(p.error);
        potato = p.value; 
    }

    onMount(() => {
        init();
    });
</script>

{#if potato} 
    <div class="p-1 me-1 d-flex">
        <img src="/public/potato/{potato.phase}.png" alt="Potato {potato.phase} Avatar" class="circle">
        <div class="h-100">
            <h5 class="m-0">{potato.name}</h5>
            <p class="m-0"
                title="Next pahse: {potato.nextPhase} ({potato.nextPhaseChips})"
            >Phase: {capitalize(potato.phase)}</p>
            <p class="m-0">Chips: {potato.potatoChips}</p>
        </div>
    </div>
{/if}