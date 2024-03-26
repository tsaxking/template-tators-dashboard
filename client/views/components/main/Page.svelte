<script lang="ts">
import { Random } from '../../../../shared/math';
import { capitalize, fromSnakeCase } from '../../../../shared/text';
import Footer from './Footer.svelte';
export let title: string;
let year: number = new Date().getFullYear();
export let domain: string;
export let active: string;

const mainClasses = 'container-fluid p-3';
</script>

<div class="{active === title ? mainClasses : 'd-none ' + mainClasses}">
    <h1 class="no-select p-5">{capitalize(fromSnakeCase(title, '-'))}</h1>
    <hr class="dropdown-divider" />
    <slot />
    <Footer {domain} />
</div>
