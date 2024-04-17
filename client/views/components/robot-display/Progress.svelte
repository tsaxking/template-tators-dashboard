<script lang="ts">
    import { FIRSTTeam } from "../../../models/FIRST/team";
    import { MatchScouting } from "../../../models/FIRST/match-scouting";
import { onMount } from "svelte";
import { Bar, Line } from "svelte-chartjs";
import { Trace } from "../../../../shared/submodules/tatorscout-calculations/trace";
import { FIRSTEvent } from "../../../models/FIRST/event";

    export let team: FIRSTTeam | undefined = undefined;

    type Data = {
        auto: {
            total: number;
        },
        teleop: {
            total: number;
        },
        endgame: {
            total: number;
        },
        total: number;
    }

    type M = {
        scouting: MatchScouting;
        data: Data;
    }

    let matches: M[] = [];


    const getMatchScouting = async (team: FIRSTTeam | undefined) => {
        if (!team) return matches = [];

        const scouting = await team.getMatchScouting();

        if (scouting.isErr()) throw scouting.error;
        const matchData = scouting.value;
        const event = FIRSTEvent.current;
        const myTeam = FIRSTTeam.current;
        if (!event) throw new Error('Event is undefined');
        if (!myTeam) throw new Error('My team is undefined');

        const res = await event.getMatches();
        if (res.isErr()) throw res.error;

        const matchesData = res.value;
        const data = await Promise.all(
            matchesData.map(async m => {
                const teams = await m.getTeams();
                if (teams.isErr()) throw teams.error;
                const [r1, r2, r3] = teams.value;

                let alliance: 'red' | 'blue';
                if ([r1, r2, r3].includes(myTeam)) {
                    alliance = 'red';
                } else {
                    alliance = 'blue';
                }

                return {
                    match: m,
                    alliance,
                    scouting:
                        matchData.find(
                            s =>
                                s.matchNumber === m.number &&
                                s.compLevel === m.compLevel
                        )
                };
            })
        );

        matches = data.map(d => ({
            scouting: d.scouting,
            data: Trace.score.parse2024(d.scouting?.trace || [], d.alliance)
        })).filter(m => m.scouting) as M[];
    }



    onMount(() => {
        getMatchScouting(team);

        return () => {
            matches = [];
        };
    });

    $: getMatchScouting(team);

    MatchScouting.on('new', m => {
        if (!team) return matches = [];
        if (m.team === team.number) {
            team = team; // reset view
        }
    });
</script>

<Line
    data={
        {
            labels: matches.map(m => `${m.scouting.compLevel}${m.scouting.matchNumber}`),
            datasets: [
                {
                    label: 'Auto',
                    data: matches.map(m => m.data.auto.total),
                },
                {
                    label: 'Teleop',
                    data: matches.map(m => m.data.teleop.total),
                },
                {
                    label: 'Endgame',
                    data: matches.map(m => m.data.endgame.total),
                },
                {
                    label: 'Total',
                    data: matches.map(m => m.data.total),
                }
            ]
        }
    }
/>