<script lang="ts">
    import { FIRSTEvent } from "../../../models/FIRST/event";
    import { FIRSTMatch } from "../../../models/FIRST/match";
    import Select from "../bootstrap/Select.svelte";

    let options: string[] = [];
    let value: string | undefined = FIRSTMatch.current?.tba.key;

    FIRSTMatch.on('select', (match: FIRSTMatch) => {
        value = match.tba.key;
    });

    FIRSTEvent.on('select', async (event: FIRSTEvent) => {
        const matches = await event.getMatches();
        options = matches.map(m => m.tba.key);
    });

    const handleChange = async (e: any) => {
        const { detail: matchKey } = e;
        const match = (await FIRSTEvent.current.getMatches()).find(m => m.tba.key === matchKey);
        if (match) match.select();
    };
</script>


<Select bind:options bind:value on:change={handleChange} />
