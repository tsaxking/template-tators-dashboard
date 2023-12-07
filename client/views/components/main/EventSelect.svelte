<script lang="ts">
    import { FIRSTYear } from '../../../models/FIRST/year';
    import { FIRSTEvent } from '../../../models/FIRST/event';
    import Select from '../bootstrap/Select.svelte';

    let options: string[] = [];
    let value: string = '';

    FIRSTYear.on('select', async (year: FIRSTYear) => {
        const events = await year.getEvents();
        options = events.map(e => e.name);
    });

    FIRSTEvent.on('select', (event: FIRSTEvent) => {
        value = event.tba.name;
    });

    const handleChange = async (e: any) => {
        const events = await FIRSTYear.current.getEvents();
        const event = events.find(evt => evt.name === e.detail);
        new FIRSTEvent(event).select();
    }
</script>


<Select bind:options bind:value on:change={handleChange}></Select>

