<script lang="ts">
import { FIRSTYear } from '../../../models/FIRST/year';
import { FIRSTEvent } from '../../../models/FIRST/event';
import Select from '../bootstrap/Select.svelte';
import { abbreviate } from '../../../../shared/text';

let options: string[] = [];
let values: string[] = [];
let value: string = '';

FIRSTYear.on('select', async (year: FIRSTYear) => {
    const events = await year.getEvents();

    const now = new Date();

    events.sort((a, b) => {
        const aStartDate = new Date(a.start_date);
        const bStartDate = new Date(b.start_date);
        const aEndDate = new Date(a.end_date);
        const bEndDate = new Date(b.end_date);

        if (aStartDate > now && bStartDate > now) {
            return aStartDate.getTime() - bStartDate.getTime();
        } else if (aStartDate > now) {
            return -1;
        } else if (bStartDate > now) {
            return 1;
        } else if (aEndDate > now && bEndDate > now) {
            return aEndDate.getTime() - bEndDate.getTime();
        } else if (aEndDate > now) {
            return -1;
        } else if (bEndDate > now) {
            return 1;
        } else {
            return aStartDate.getTime() - bStartDate.getTime();
        }
    });

    events.reverse();

    options = events.map(e => abbreviate(e.name, 20));
    values = events.map(e => e.key);
    value = options[0];

    new FIRSTEvent(events[0]).select();
});

FIRSTEvent.on('select', (event: FIRSTEvent) => {
    value = event.tba.key;
});

const handleChange = async (e: any) => {
    const events = await FIRSTYear.current.getEvents();
    const event = events.find(evt => evt.key === e.detail);
    if (event) new FIRSTEvent(event).select();
};
</script>

<Select bind:options bind:value bind:values on:change="{handleChange}"></Select>
