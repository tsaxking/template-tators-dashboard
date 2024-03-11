<script lang="ts">
import Main from '../components/main/Main.svelte';
import Page from '../components/main/Page.svelte';
import RobotDisplay from '../pages/RobotDisplay.svelte';
import CreateScoutingQuestions from '../pages/edit-pit-scouting/CreateQuestions.svelte';
import AnswerPitScouting from '../pages/answer-pit-scouting/AnswerPitScouting.svelte';
import Accounts from '../pages/Accounts.svelte';
import Roles from '../pages/Roles.svelte';
import { type PageGroup } from '../../utilities/general-types';

const groups: PageGroup[] = [
    {
        name: 'home',
        pages: [
            {
                name: 'accounts',
                icon: 'person',
                iconType: 'material'
            },
            {
                name: 'roles',
                icon: 'admin_panel_settings',
                iconType: 'material'
            }
        ]
    },
    {
        name: 'scouting',
        pages: [
            {
                name: 'create-scouting-questions',
                icon: 'fact_check',
                iconType: 'material'
            }
            // {
            //     name: 'scouting-checklist',
            //     icon: 'checklist'
            // },
        ]
    }
];

let active = 'accounts';

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
    <Page {active} {domain} title="create-scouting-questions">
        <CreateScoutingQuestions />
    </Page>
    <Page {active} {domain} title="accounts"><Accounts></Accounts></Page>
    <Page {active} {domain} title="roles"><Roles></Roles></Page>
    <!-- <Page {active} {domain} title="scouting-checklist">
            <ScoutingChecklist />
        </Page> -->
</Main>
