<script lang="ts">
import Main from '../components/main/Main.svelte';
import Page from '../components/main/Page.svelte';
import RobotDisplay from '../pages/RobotDisplay.svelte';
import CreateScoutingQuestions from '../pages/edit-pit-scouting/CreateQuestions.svelte';
import AnswerPitScouting from '../pages/answer-pit-scouting/AnswerPitScouting.svelte';
import Checklist from '../pages/Checklist.svelte';
import { PageGroup } from '../../utilities/general-types';
import { getOpenPage } from '../../utilities/page';

const groups: PageGroup[] = [
    {
        name: 'home',
        pages: [
            {
                name: 'robot-display',
                icon: 'home',
                iconType: 'material'
            }
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
    }
];

let active = getOpenPage() || 'robot-display';

const domain = 'tatorscout.org';

const navItems: string[] = [
    // 'app'
];

const accountLinks: string[] = [
    // 'account',
    // 'contact',
    // null
];
</script>

<Main
    title="Team Tators"
    {groups}
    on:openPage="{e => (active = e.detail)}"
    {active}
    {navItems}
    {accountLinks}
>
    <Page {active} {domain} title="robot-display">
        <RobotDisplay></RobotDisplay>
    </Page>
    <Page {active} {domain} title="answer-scouting-questions">
        <AnswerPitScouting />
    </Page>
    <Page {active} {domain} title="scouting-checklist">
        <Checklist />
    </Page>
</Main>
