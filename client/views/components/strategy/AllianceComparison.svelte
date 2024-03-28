<script lang='ts'>
    import { FIRSTTeam } from '../../../models/FIRST/team';
    import { TBA } from '../../../utilities/tba';
    import { Trace } from '../../../../shared/submodules/tatorscout-calculations/trace';
    import {
        type TBAMatch,
        teamsFromMatch
    } from '../../../../shared/submodules/tatorscout-calculations/tba';
    import { FIRSTEvent } from '../../../models/FIRST/event';
    import Select from '../bootstrap/Select.svelte';
    import TeamSelect from '../main/TeamSelect.svelte';
    export let team1: FIRSTTeam | undefined = undefined;
    export let team2: FIRSTTeam | undefined = undefined;
    export let team3: FIRSTTeam | undefined = undefined;

    let bBot1 = {
        avgAuto: 0,
        avgTele: 0,
        avgEnd: 0
    };
    let bBot2 = {
        avgAuto: 0,
        avgTele: 0,
        avgEnd: 0
    };
    let bBot3 = {
        avgAuto: 0,
        avgTele: 0,
        avgEnd: 0
    };



    let options: string[] = [];
    let values: string[] = [];
    let value: string | undefined = FIRSTTeam.current?.number.toString();
    let event: FIRSTEvent | null = FIRSTEvent.current;
    const fns = {
        setOptions: async (event: FIRSTEvent | null) => {
        if (!event) {
            options = [];
            values = [];
            return;
        }
        const res = await event.getTeams();
        if (res.isOk()) {
            const teams = res.value;
            values = teams.map(t => t.number.toString());
            options = teams.map(t => `${t.number.toString()} | ${t.name}`);
        } else {
            values = [];
            options = [];
        }
    },
        getMatchData: async (team: FIRSTTeam) => {
            const match = await team.getMatchScouting();
            if(match.isOk()){
                const matchData = match.value
                let avgAuto = 0;
                let avgTele = 0;
                let avgEnd = 0;
                let alliance: String;
                const event = FIRSTEvent.current;
                const myTeam = FIRSTTeam.current;
                if (!event) return;
                if (!myTeam) return;

                const res = await event.getMatches();
                if (res.isErr()) return console.log(res.error);

                const matches = res.value;
                const data = await Promise.all(matches.map(async m => {
                    const teams = await m.getTeams();
                    if (teams.isErr()) throw teams.error;
                    const [r1, r2, r3, b1, b2, b3] = teams.value;
                    if ([r1, r2, r3].includes(myTeam)) {
                        alliance = 'red'
                    } else {
                        alliance = 'blue'
                    }  
                }));

                for(const match of matchData){
                    const score = Trace.score.parse2024(match.trace, alliance);
                    avgAuto += score.auto.total;
                    avgTele += score.teleop.total;
                    avgEnd += score.endgame.total;
                }

                avgAuto /= matchData.length;
                avgTele /= matchData.length;
                avgEnd /= matchData.length;
                return {avgAuto, avgTele, avgEnd};
            }
        },
        getAllianceData: async(...teams: (FIRSTTeam | undefined)[]) => {
            const data = await Promise.all(teams.filter(Boolean).map(
                fns.getMatchData
            ))
        }
    }

    $: fns.getAllianceData(team1, team2, team3)
    
//pull matches, match# + comp level, pull alliance
</script>

<TeamSelect bind:selected="{team1}"></TeamSelect>
<TeamSelect bind:selected="{team2}"></TeamSelect>
<TeamSelect bind:selected="{team3}"></TeamSelect> 

<div class="card" style="width: 18rem;">                                                                                                                                                                                                                                                              div class="card-body">
    <h5 class="card-title">Alliance Summary</h5>
    <p class="card-text">Average auto score: {team1.avgAuto + team2.avgAuto + team3.avgAuto}</p>
    <p class="card-text">Average tele score: {team1.avgTele + team2.avgTele + team3.avgTele}</p>
    <p class="card-text">Average endgame score: {team1.endgame + team2.endgame + team3.endgame}</p>
    <p class="card-text"></p>
</div>