<script lang="ts">
    import Main from '../components/main/Main.svelte';
    import Page from '../components/main/Page.svelte';
    import RobotDisplay from '../pages/RobotDisplay.svelte';
    import CreateScoutingQuestions from '../pages/edit-pit-scouting/CreateQuestions.svelte';
    import AnswerPitScouting from '../pages/answer-pit-scouting/AnswerPitScouting.svelte';
    
    const groups = [
        {
            name: 'home',
            pages: [
                {
                    name: 'accounts',
                    icon: 'person'
                },
                {
                    name: 'roles',
                    icon: 'admin_panel_settings'
                }
            ]
        },
        {
            name: 'scouting',
            pages: [
                {
                    name: 'create-scouting-questions',
                    icon: 'fact_check'
                },
                // {
                //     name: 'scouting-checklist',
                //     icon: 'checklist'
                // },
            ]
        }
    ];
    
    let active = 'robot-display';
    
    const domain = 'tatorscout.org';
    
    const navItems = [
        // 'app'
    ];
    
    const accountLinks = [
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
        <Page {active} {domain} title="create-scouting-questions">
            <CreateScoutingQuestions />
        </Page>
        <Page {active} {domain} title="answer-scouting-questions">
            <AnswerPitScouting />
        </Page>
        <!-- <Page {active} {domain} title="scouting-checklist">
            <ScoutingChecklist />
        </Page> -->
    </Main>
    