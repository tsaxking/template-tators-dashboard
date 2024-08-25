<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import { writable } from 'svelte/store';

export let targetTime: number;
export let onFinish: () => void;
// make sure to reset the countdown in here

const timeLeft = writable<number>(0);

const updateCountdown = () => {
    const now = Date.now();
    const remaining = targetTime - now;
    timeLeft.set(Math.max(remaining, 0));

    if (remaining <= 0) {
        clearInterval(interval);
        onFinish?.();
    }
};

// not certain what this does but it works -sylv
let interval: ReturnType<typeof setInterval>;

onMount(() => {
    updateCountdown();
    interval = setInterval(updateCountdown, 1000);
});

onDestroy(() => {
    clearInterval(interval);
});
</script>

<div class="d-flex flex-column align-items-center">
    <!-- TODO: variable for this, pass in an element, or just do it yourself when you import this?
			<h4>Time Left:</h4>
			-->
    {#if $timeLeft > 0}
        {#if $timeLeft >= 3600000}
            <p class="display-4">
                {($timeLeft / 3600000) | 0}h {($timeLeft / 60000) % 60 | 0}m {($timeLeft /
                    1000) %
                    60 |
                    0}s
            </p>
        {:else if $timeLeft >= 60000}
            <p class="display-4">
                {($timeLeft / 60000) | 0}m {($timeLeft / 1000) % 60 | 0}s
            </p>
        {:else}
            <p class="display-4">
                {($timeLeft / 1000) | 0}s
            </p>
        {/if}
    {:else}
        <p class="display-4">Now</p>
    {/if}
</div>

<style>
p.display-4 {
    font-size: 2rem;
    margin: 0;
}
</style>
