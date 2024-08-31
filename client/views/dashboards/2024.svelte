<script lang="ts">
import Main from '../components/main/Main.svelte';
import Page from '../components/main/Page.svelte';
import RobotDisplay from '../pages/RobotDisplay.svelte';
import CreateScoutingQuestions from '../pages/edit-pit-scouting/CreateQuestions.svelte';
import AnswerPitScouting from '../pages/answer-pit-scouting/AnswerPitScouting.svelte';
import Checklist from '../pages/Checklist.svelte';
import { type PageGroup } from '../../utilities/general-types';
import { getOpenPage } from '../../utilities/page';
import Quiz from '../pages/Quiz.svelte';
import EventSummary from '../pages/EventSummary.svelte';
import { FIRSTEvent } from '../../models/FIRST/event';
import MatchSchedule from '../pages/MatchSchedule.svelte';
import Strategy from '../pages/pit-display/Strategy.svelte';

const groups: PageGroup[] = [
    {
        name: 'overview',
        pages: [
            {
                name: 'event-summary',
                icon: 'event',
                iconType: 'material'
            },
            {
                name: 'matches',
                icon: 'list',
                iconType: 'material'
            },
            {
                name: 'robot-display',
                icon: 'home',
                iconType: 'material'
            }
            // {
            //     name: 'alliance-builder',
            //     icon: 'strategy',
            //     iconType: 'symbols'
            // }
        ]
    },
    {
        name: 'scouting',
        pages: [
            // {
            //     name: 'create-scouting-questions',
            //     icon: 'fact_check'
            // },
            {
                name: 'scouting-checklist',
                icon: 'checklist',
                iconType: 'material'
            },
            {
                name: 'answer-scouting-questions',
                icon: 'question_answer',
                iconType: 'material'
            }
        ]
    },
    {
        name: 'other',
        pages: [
            {
                name: 'quiz',
                icon: 'quiz',
                iconType: 'material'
            }
        ]
    }
];

let active = getOpenPage() || 'event-summary';

const domain = 'tatorscout.org';

const navItems: string[] = [
    // 'app'
];

const accountLinks: string[] = [
    // 'account',
    // 'contact',
    // null
];

let currentEvent: FIRSTEvent | null = null;

FIRSTEvent.on('select', e => {
    currentEvent = e;
});

let loading = true;
</script>

<Main
    title="Team Tators"
    {groups}
    on:openPage="{e => {
        active = e.detail;
    }}"
    {active}
    {navItems}
    {accountLinks}
>
    <Page {active} {domain} title="event-summary" bind:loading>
        {#if currentEvent}
            <EventSummary event="{currentEvent}" bind:loading></EventSummary>
        {/if}
    </Page>
    <Page {active} {domain} title="matches" bind:loading>
        <MatchSchedule bind:loading />
    </Page>
    <Page {active} {domain} title="robot-display" bind:loading>
        <RobotDisplay bind:loading></RobotDisplay>
    </Page>
    <Page {active} {domain} title="answer-scouting-questions" bind:loading>
        <AnswerPitScouting bind:loading />
    </Page>
    <Page {active} {domain} title="scouting-checklist" bind:loading>
        <Checklist bind:loading />
    </Page>
    <Page {active} {domain} title="quiz" bind:loading>
        <Quiz bind:loading />
    </Page>
    <!-- <Page {active} {domain} title="alliance-builder" bind:loading> -->
    <!-- <Strategy bind:loading /> -->
    <!-- </Page> -->
</Main>
