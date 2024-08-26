<script lang="ts">
import { Random } from '../../../../shared/math';
import { capitalize, fromSnakeCase } from '../../../../shared/text';
import { fade } from 'svelte/transition';
import Footer from './Footer.svelte';
export let title: string;
let year: number = new Date().getFullYear();
export let domain: string;
export let active: string;
export let loading: boolean = false;
</script>

{#if active === title}
    {#if loading}
        <div class="loading-backdrop" transition:fade>
            <div class="loading">
                <div class="text-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading...</p>
                </div>
            </div>
        </div>
    {/if}
    <div style:opacity="{loading ? 0 : 1}">
        <div class="container-fluid p-3">
            {#if !title.startsWith('--$')}
                <h1 class="no-select p-5">
                    {capitalize(fromSnakeCase(title, '-'))}
                </h1>
                <hr class="dropdown-divider" />
            {/if}
            <slot />
            <p class="text-muted text-center">
                &copy; {year}
                {domain} | All Rights Reserved
            </p>
        </div>
    </div>
{/if}

<style>
.loading-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
