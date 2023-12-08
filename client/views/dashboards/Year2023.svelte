<script lang="ts">
    import Main from "../components/main/Main.svelte";
    import Page from "../components/main/Page.svelte";
    import { getOpenPage } from '../../utilities/page';
    import RobotDisplay from "../pages/RobotDisplay.svelte";
    import CreateScoutingQuestions from "../pages/CreateScoutingQuestions.svelte";
    import { TBA } from '../../utilities/tba';
    import { abbreviate } from "../../../shared/text";
    import ScoutingChecklist from "../pages/ScoutingChecklist.svelte";

    type TBAEvent = {
        key: string,
        name: string,
        event_code: string,
        event_type: number,
        district: {
            abbreviation: string,
            display_name: string,
            key: string,
            year: number
        },
        city: string,
        state_prov: string,
        country: string,
        start_date: string,
        end_date: string,
        year: number
    };

    type TBATeam = {
        key: string,
        team_number: number,
        nickname: string,
        name: string,
        city: string,
        state_prov: string,
        country: string,
        address: string,
        postal_code: string,
        gmaps_place_id: string,
        gmaps_url: string,
        lat: number,
        lng: number,
        location_name: string,
        website: string,
        rookie_year: number,
        motto: string,
        home_championship: {
            key: string,
            year: number,
            event_code: string,
            division_keys: string[]
        }
    };

    type TBAMatch = {
        key: string,
        comp_level: string,
        set_number: number,
        match_number: number,
        alliances: {
            red: {
                score: number,
                team_keys: string[]
            },
            blue: {
                score: number,
                team_keys: string[]
            }
        },
        winning_alliance: string,
        event_key: string,
        time: number,
        actual_time: number,
        predicted_time: number,
        post_result_time: number,
        score_breakdown: {
            red: {},
            blue: {}
        },
        videos: {
            key: string,
            type: string
        }[]
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

    let active: string =  /* getOpenPage() || */ groups[0]?.pages[0]?.name;
    active = 'scouting-checklist';


    
    const domain = 'tatorscout.org'

    const openPage = ({ detail }) => {
        active = detail;
    }

    const navItems = [
        // 'app'
    ];

    const accountLinks = [
        // 'account',
        // 'contact',
        // null
    ];


    export let event: TBAEvent;
    export let events: TBAEvent[] = [];

    // CreateScoutingQuestions
    export let scoutingTypes = ['Pit', 'Pre', 'Mechanical', 'Electrical'].map(t => ({
            name: t + ' Scouting',
            groups: [],
            questions: []
        }));
    export let activeScoutingPage: string = 'Pit Scouting';

    const selectEvent = (e: any) => {
        const ev = events.find(ev => ev.key === e.target.value);


        if (ev) {
            event = ev;
        } else {
            console.error('Event not found');
        }

        
        TBA.get<TBATeam[]>(`/event/${event.key}/teams`).then((e) => {
            teams = e.data.map(team => ({
                number: team.team_number,
                name: team.nickname,
                // TODO: undo randomization
                required: ['mechanical', 'electrical', 'pit', 'picture'].filter(_ => {
                    // randomize
                    return Math.random() > 0.5;
                })
            }));
        });

        TBA.get<TBAMatch[]>(`/event/${event.key}/matches`).then((e) => {
            console.log(e.data)
            matches = e.data.map(match => ({
                number: match.match_number,
                compLevel: match.comp_level,
                teams: match.alliances.red.team_keys.concat(match.alliances.blue.team_keys).map(team => parseInt(team.slice(3)))
            }));
        });
    }

    const getEvents = (year: number) => {
        const setEvents = (e: TBAEvent[]) => {
            e.sort((a, b) => {
                const now = new Date();

                const aStart = new Date(a.start_date);
                const bStart = new Date(b.start_date);

                const aEnd = new Date(a.end_date);
                const bEnd = new Date(b.end_date);

                const aStartDiff = Math.abs(now.getTime() - aStart.getTime());
                const bStartDiff = Math.abs(now.getTime() - bStart.getTime());

                const aEndDiff = Math.abs(now.getTime() - aEnd.getTime());
                const bEndDiff = Math.abs(now.getTime() - bEnd.getTime());

                const aDiff = Math.min(aStartDiff, aEndDiff);
                const bDiff = Math.min(bStartDiff, bEndDiff);

                return aDiff - bDiff;
            });

            events = e;

            selectEvent({
                target: {
                    value: e[0].key
                }
            });
        }

        TBA.get<TBAEvent[]>(`/team/frc2122/events/${year}`, true)
            .then((e) => {
                e.onUpdate(setEvents, 1000 * 60 * 60 * 20); // update every day
                setEvents(e.data);
            })
            .catch(console.error);
    }

    const selectYear = (e: any) => getEvents(e.target.value);

    selectYear({
        target: {
            value: new Date().getFullYear()
        }
    });

    let teams = [];
    let matches = [];
</script>




<Main title="Team Tators" {groups} on:openPage={openPage} {active} {navItems} {accountLinks}>
    <div slot="nav" class="d-flex">
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
    </div>


    <Page {active} {domain} title='robot-display'>
        <RobotDisplay></RobotDisplay>
    </Page>
    <Page {active} {domain} title='create-scouting-questions'>
        <CreateScoutingQuestions 
            bind:event={event} 
            bind:active={activeScoutingPage} 
            bind:types={scoutingTypes}
        >
        </CreateScoutingQuestions>
    </Page>
    <Page {active} {domain} title='scouting-checklist'>
        <ScoutingChecklist bind:teams={teams} bind:matches={matches}></ScoutingChecklist>
    </Page>
</Main>