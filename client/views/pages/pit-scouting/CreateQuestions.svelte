<script lang="ts">
    import { onMount } from 'svelte';
    import { Section } from '../../../models/FIRST/question-scouting/section';
    import NavTabs from '../../components/bootstrap/NavTabs.svelte';
    import S from './Section.svelte';

    export let sections: Section[] = [];


    onMount(async () => {
        sections = await Section.all();
    });

    Section.on('new', (s) => {
        sections = [...sections, s];
    });

    let open: Section;

    let tabs: string[] = [],
        active: string = '';
    $: {
        tabs = sections.map((s) => s.name);
        open = sections.find((s) => s.name === active);
    }
</script>

<div class="container">
    <div class="row mb-3">
        <NavTabs 
            {tabs}
            {active}
            on:change="{
                (e) => {
                    active = e.detail;
                }
            }"
        />
    </div>
    <div class="row mb-3">
        <S bind:section={open} />
    </div>
</div>