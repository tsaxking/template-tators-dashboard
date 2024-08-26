<script lang="ts">
import { onMount } from 'svelte';
import { Section } from '../../../models/FIRST/question-scouting/section';
import NavTabs from '../../components/bootstrap/NavTabs.svelte';
import S from './Section.svelte';
import { FIRSTEvent } from '../../../models/FIRST/event';
import { FIRSTTeam } from '../../../models/FIRST/team';
import GlobalTeamSelect from '../../components/main/GlobalTeamSelect.svelte';

export let loading: boolean;
export let sections: Section[] = [];
let team: FIRSTTeam | undefined = undefined;

const init = async () => {
    sections = await Section.all();
    team = FIRSTTeam.current;
    loading = false;
};

onMount(() => {
    init();
    return () => (loading = true);
});

Section.on('new', s => {
    sections = [...sections, s];
});

let open: Section | undefined = undefined;

let tabs: string[] = [],
    active: string = '';
$: {
    setSections(sections, active);
}

Section.on('new', async s => {
    sections = await Section.all();
});

Section.on('update', async () => {
    sections = await Section.all();
});

FIRSTEvent.on('select', async () => {
    sections = await Section.all();
    const s = sections[0];
    if (s) active = s.name;
});

FIRSTTeam.on('select', t => {
    team = t;
    setSections(sections, active);
});

const setSections = (sections: Section[], active: string) => {
    tabs = sections.map(s => s.name);
    open = sections.find(s => s.name === active);
};
// save: async () => {
//     if (!team) return alert('Please select a team');
//     if (!open) return alert('Please select a section');

//     const groups = await open.getGroups(FIRSTEvent.current);
//     if (groups.isOk()) {
//         const results = await Promise.all(
//             groups.value.map(async g => {
//                 const questions = await g.getQuestions();
//                 if (questions.isOk()) {
//                     return Promise.all(
//                         questions.value.map(q => {
//                             return q.saveAnswer(team);
//                         })
//                     );
//                 }
//             })
//         )
//     }
// }
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
    </div>
    {#if open}
        <div class="row mb-3">
            <div class="col-md-4">
                <GlobalTeamSelect />
            </div>
            <div class="col-md-8">
                {#if team}
                    <h3>Team {team.number} | {team.name}</h3>
                {:else}
                    <h3>No Team Selected, all inputs are disabled</h3>
                {/if}
            </div>
            <!-- <div class="col-lg-4 col-md-6">
                <button class="btn btn-success" on:click={fns.save}>
                    Save <i class="material-icons">save</i>
                </button>
            </div> -->
        </div>
        <div class="row mb-3">
            <S bind:section="{open}" {team} />
        </div>
    {/if}
</div>
