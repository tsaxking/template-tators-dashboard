<script lang="ts">
    import { FIRSTTeam } from "../../models/FIRST/team";
    import RadioButtonGroup from "../components/bootstrap/RadioButtonGroup.svelte";
    import MatchSelect from '../components/main/GlobalMatchSelect.svelte';
    import FloatingInput from "../components/bootstrap/FloatingInput.svelte";
    import AllianceBuilder from "../components/main/AllianceBuilder.svelte";
    import { FIRSTMatch } from "../../models/FIRST/match";
    import Whiteboard from "../components/whiteboard/Whiteboard.svelte";

    let matchType: string[] = ["From Match", "Custom Match"];
    let matchTypeValue = matchType[0];

    let matchName = "";

    let alliances: {
        red: [FIRSTTeam | undefined, FIRSTTeam | undefined, FIRSTTeam | undefined],
        blue: [FIRSTTeam | undefined, FIRSTTeam | undefined, FIRSTTeam | undefined]
    } = {
        red: [undefined, undefined, undefined],
        blue: [undefined, undefined, undefined]
    };

    FIRSTMatch.on('select', (m: FIRSTMatch) => {
        matchName = m.tba.key;

        alliances = {
            red: m.teams.slice(0, 3) as [FIRSTTeam, FIRSTTeam, FIRSTTeam],
            blue: m.teams.slice(3, 6) as [FIRSTTeam, FIRSTTeam, FIRSTTeam]
        }
    });
</script>


<RadioButtonGroup options={matchType} bind:value={matchTypeValue} />

{#if matchTypeValue === matchType[0]}
    <!-- Existing Match -->
    <MatchSelect />

{:else}
    <!-- Custom Match -->
    <FloatingInput label="Match Name" bind:value={matchName}/>

    <AllianceBuilder on:change={({ detail }) => alliances = { red: detail, blue: alliances.blue }}/>
    <AllianceBuilder on:change={({ detail }) => alliances = { red: alliances.red, blue: detail }}/>
{/if}


<Whiteboard {alliances} />