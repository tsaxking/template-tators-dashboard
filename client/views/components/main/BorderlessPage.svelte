<script lang="ts">
    import { Random } from '../../../../shared/math';
    import { capitalize, fromSnakeCase } from '../../../../shared/text';
    import Footer from './Footer.svelte';
    export let title: string;
    let year: number = new Date().getFullYear();
    export let domain: string;
    export let active: string;
</script>

{#if active === title}
    <div class="container-fluid m-0 p-0">
        <slot />
    </div>
{/if}
