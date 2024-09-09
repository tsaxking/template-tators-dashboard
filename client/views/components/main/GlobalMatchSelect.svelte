<script lang="ts">
    import { FIRSTEvent } from '../../../models/FIRST/event';
    import { FIRSTMatch } from '../../../models/FIRST/match';
    import Select from '../bootstrap/Select.svelte';

    let options: string[] = [];
    let value: string | undefined = FIRSTMatch.current?.tba.key;

    FIRSTMatch.on('select', (match: FIRSTMatch) => {
        value = match.tba.key;
    });

    FIRSTEvent.on('select', async (event: FIRSTEvent) => {
        const res = await event.getMatches();
        if (res.isOk()) {
            const matches = res.value;
            options = matches.map(m => m.tba.key);
        } else {
            options = [];
        }
    });

    const handleChange = async (e: CustomEvent) => {
        const { detail: matchKey } = e;
        const res = await FIRSTEvent.current?.getMatches();
        if (!res || res.isErr()) return;
        const matches = res.value;
        const match = matches.find(m => m.tba.key === matchKey);
        if (match) match.select();
    };
</script>

<Select
    bind:options
    bind:value
    on:change="{handleChange}" />
