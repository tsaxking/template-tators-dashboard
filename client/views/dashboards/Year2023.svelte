<script lang="ts">
import Main from '../components/main/Main.svelte';
import Page from '../components/main/Page.svelte';
import { getOpenPage } from '../../utilities/page';
import RobotDisplay from '../pages/RobotDisplay.svelte';
import CreateScoutingQuestions from '../pages/CreateScoutingQuestions.svelte';
import { TBA } from '../../utilities/tba';
import { abbreviate } from '../../../shared/text';
import ScoutingChecklist from '../pages/ScoutingChecklist.svelte';

type TBAEvent = {
    key: string;
    name: string;
    event_code: string;
    event_type: number;
    district: {
        abbreviation: string;
        display_name: string;
        key: string;
        year: number;
    };
    city: string;
    state_prov: string;
    country: string;
    start_date: string;
    end_date: string;
    year: number;
};

type TBATeam = {
    key: string;
    team_number: number;
    nickname: string;
    name: string;
    city: string;
    state_prov: string;
    country: string;
    address: string;
    postal_code: string;
    gmaps_place_id: string;
    gmaps_url: string;
    lat: number;
    lng: number;
    location_name: string;
    website: string;
    rookie_year: number;
    motto: string;
    home_championship: {
        key: string;
        year: number;
        event_code: string;
        division_keys: string[];
    };
};

type TBAMatch = {
    key: string;
    comp_level: string;
    set_number: number;
    match_number: number;
    alliances: {
        red: {
            score: number;
            team_keys: string[];
        };
        blue: {
            score: number;
            team_keys: string[];
        };
    };
    winning_alliance: string;
    event_key: string;
    time: number;
    actual_time: number;
    predicted_time: number;
    post_result_time: number;
    score_breakdown: {
        red: {};
        blue: {};
    };
    videos: {
        key: string;
        type: string;
    }[];
};

const groups = [
    {
        name: 'home',
        pages: [
            {
                name: 'robot-display',
                icon: 'home'
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
            {
                name: 'scouting-checklist',
                icon: 'checklist'
            }
        ]
    }
];

let active: string = getOpenPage();
// active = 'scouting-checklist';

const domain = 'tatorscout.org';

const openPage = ({ detail }) => {
    active = detail;
};

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
    on:openPage="{openPage}"
    {active}
    {navItems}
    {accountLinks}
>
    <!-- <div slot="nav" class="d-flex">
        <select class="form-control" name="year" on:change={selectYear} style="width: min-content;">
            {#each new Array(new Date().getFullYear() - 2006).fill(0).map((_, i) => 2007 + i).reverse() as year}
                <option value={year}>{year}</option>
            {/each}
        </select>
        <select class="form-control" name="event" on:change={selectEvent}>
            {#each events as event}
                <option value={event.key}>{abbreviate(event.name, 15)}</option>
            {/each}
        </select>
    </div> -->

    <Page {active} {domain} title="robot-display">
        <RobotDisplay></RobotDisplay>
    </Page>
    <Page {active} {domain} title="create-scouting-questions">
        <CreateScoutingQuestions />
    </Page>
    <Page {active} {domain} title="scouting-checklist">
        <ScoutingChecklist />
    </Page>
</Main>
