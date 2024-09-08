<script lang="ts">
import { onMount } from 'svelte';
import { Section } from '../../../models/FIRST/question-scouting/section';
import NavTabs from '../../components/bootstrap/NavTabs.svelte';
import S from './Section.svelte';
import {
    prompt,
    alert,
    choose,
    select
} from '../../../utilities/notifications';
import { FIRSTEvent } from '../../../models/FIRST/event';
import { FIRSTYear } from '../../../models/FIRST/year';

export let sections: Section[] = [];
let event: FIRSTEvent;

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

FIRSTEvent.on('select', async e => {
    event = e;
    sections = await Section.all();
    const s = sections[0];
    if (s) active = s.name;
});

const fns = {
    setSections: (sections: Section[], active: string) => {
        tabs = sections.map(s => s.name);
        const s = sections.find(s => s.name === active);
        if (s) open = s;
    },
    migrateQuestions: async () => {
        if (!event) return console.error('No event selected');
        const events = await FIRSTYear.current?.getEvents();
        console.log({ events });
        if (!events) return alert('No events found');
        if (events.isErr()) return console.error(events.error);

        const allowedEvents = events.value.filter(e => e.key !== event.key);

        console.log({ allowedEvents });

        const selected = await select(
            'What event would you like to migrate the questions to?',
            allowedEvents.map(e => e.name)
        );
        const e = allowedEvents[selected];
        if (!e) return;

        console.log({ e });

        const res = await event.copyQuestionsFromEvent(e.key);

        console.log({ res });

        if (res.isErr()) {
            if (res.error.message === 'Cannot copy from self') {
                // this should never happen because we filter out the current event
                // but just in case
                alert('You cannot copy questions from the same event');
            } else {
                console.error(res.error);
            }
            return;
        }
    }
};
</script>

<div class="container">
    <div class="row mb-3">
        <div class="col-md-8 col-sm-12 mb-2">
            <NavTabs
                {active}
                {tabs}
                on:change="{e => {
                    active = e.detail;
                }}"
            >
                <a
                    href="javascript:void(0)"
                    on:click="{async () => {
                        const name = await prompt(
                            'What name would you like the new section to be?'
                        );
                        // console.log(name);
                        if (name) {
                            if (tabs.includes(name))
                                return alert(
                                    'A section with that name already exists'
                                );
                            // const multiple = await choose(
                            //     'Would you like to add multiple questions at once?',
                            //     'Yes',
                            //     'No'
                            // );
                            Section.new({
                                name,
                                // multiple: multiple === 'Yes'
                                multiple: false
                            });
                        }
                    }}"
                >
                    <i class="material-icons">add</i>
                </a>
            </NavTabs>
        </div>
        <div class="col-md-4 col-sm-12 mb-2">
            <button
                class="btn btn-primary w-100"
                on:click="{fns.migrateQuestions}"
            >
                Migrate from another event
            </button>
        </div>
    </div>
    <div class="row mb-3">
        <S bind:section="{open}" />
    </div>
</div>
