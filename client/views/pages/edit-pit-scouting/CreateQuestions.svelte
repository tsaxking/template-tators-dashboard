<script lang="ts">
import { onMount } from 'svelte';
import { Section } from '../../../models/FIRST/question-scouting/section';
import NavTabs from '../../components/bootstrap/NavTabs.svelte';
import S from './Section.svelte';
import { prompt, alert, choose } from '../../../utilities/notifications';
import { FIRSTEvent } from '../../../models/FIRST/event';

export let sections: Section[] = [];

onMount(async () => {
    sections = await Section.all();
});

Section.on('new', s => {
    sections = [...sections, s];
});

let open: Section;

let tabs: string[] = [],
    active: string = '';
$: {
    fns.setSections(sections, active);
}

Section.on('new', async s => {
    sections = await Section.all();
});

Section.on('update', async () => {
    sections = await Section.all();
});

Section.on('delete', async () => {
    sections = await Section.all();
});

FIRSTEvent.on('select', async () => {
    sections = await Section.all();
    const s = sections[0];
    if (s) active = s.name;
});

const fns = {
    setSections(sections: Section[], active: string) {
        tabs = sections.map(s => s.name);
        open = sections.find(s => s.name === active);
    }
};
</script>

<div class="container">
    <div class="row mb-3">
        <NavTabs
            {tabs}
            {active}
            on:change="{e => {
                active = e.detail;
            }}"
        />
        <!-- <div class="nav-item"> -->
        <a
            href="javascript:void(0)"
            on:click="{async () => {
                const name = await prompt(
                    'What name would you like the new section to be?'
                );
                // console.log(name);
                if (name) {
                    if (tabs.includes(name))
                        return alert('A section with that name already exists');
                    const multiple = await choose(
                        'Would you like to add multiple questions at once?',
                        'Yes',
                        'No'
                    );
                    Section.new({
                        name,
                        multiple: multiple === 'Yes'
                    });
                }
            }}"
        >
            <i class="material-icons">add</i>
        </a>
        <!-- </div> -->
    </div>
    <div class="row mb-3">
        <S bind:section="{open}" />
    </div>
</div>
