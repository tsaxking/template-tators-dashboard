<script lang="ts">
import TaylorPitStrategy from '../pages/strategy/Strategy.svelte';
import Main from '../components/main/Main.svelte';
import Page from '../components/main/Page.svelte';
import BorderlessPage from '../components/main/BorderlessPage.svelte';
import { type PageGroup } from '../../utilities/general-types';
import { getOpenPage } from '../../utilities/page';
import { FIRSTEvent } from '../../models/FIRST/event';
import PitDashboard from '../pages/strategy/PitDashboard.svelte';
import PitStrategy from '../pages/strategy/PitStrategy.svelte';

const groups: PageGroup[] = [
    {
        name: 'Pit',
        pages: [
            {
                name: 'pit-dashboard',
                icon: 'event',
                iconType: 'material'
            },
            {
                name: 'pit-strategy',
                icon: 'list',
                iconType: 'material'
            },
            {
                name: 'taylor-pit-strategy',
                icon: 'list',
                iconType: 'material'
            }
        ]
    }
];

let active = getOpenPage() || 'pit-dashboard';

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
</script>

<Main
    {accountLinks}
    {active}
    {groups}
    {navItems}
    title="Team Tators"
    on:openPage="{e => {
        active = e.detail;
    }}"
>
    <BorderlessPage {active} {domain} title="pit-dashboard">
        <PitDashboard />
    </BorderlessPage>
    <Page {active} {domain} title="pit-strategy">
        <PitStrategy />
    </Page>
    <!-- <Page {active} {domain} title="taylor-pit-strategy"> -->
    <!-- <Strategy bind:loading /> -->
    <!-- </Page> -->
</Main>
