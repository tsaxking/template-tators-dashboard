<script lang="ts">
import { FIRSTYear } from '../../../models/FIRST/year';
import { FIRSTEvent } from '../../../models/FIRST/event';
import Select from '../bootstrap/Select.svelte';
import { abbreviate } from '../../../../shared/text';

let options: string[] = [];
let values: string[] = [];
let value: string = '';

FIRSTYear.on('select', async (year: FIRSTYear) => {
    const res = await year.getEvents();

    if (res.isOk()) {
        const events = res.value;

        const now = new Date();

        events.sort((a, b) => {
            const aStartDate = new Date(a.start_date);
            aStartDate.setHours(0, 0, 0, 0);
            aStartDate.setDate(aStartDate.getDate() - 3);
            const bStartDate = new Date(b.start_date);
            bStartDate.setHours(0, 0, 0, 0);
            bStartDate.setDate(bStartDate.getDate() - 3);
            const aEndDate = new Date(a.end_date);
            const bEndDate = new Date(b.end_date);

            console.log({
                aStartDate,
                bStartDate,
                aEndDate,
                bEndDate
            })

            const now = new Date();
            // event is happening now
            if (aStartDate <= now && aEndDate >= now) return -1;

            // event is the next event
            if (aStartDate > now && bStartDate > now) {
                return aStartDate.getTime() - bStartDate.getTime();
            }

            return aStartDate.getTime() - bStartDate.getTime();
        });

        options = events.map(e => abbreviate(e.name, 20));
        values = events.map(e => e.key);
        value = options[0];

        new FIRSTEvent(events[0]).select();
    }
});

FIRSTEvent.on('select', (event: FIRSTEvent) => {
    value = event.tba.key;
});

const handleChange = async (e: any) => {
    const res = await FIRSTYear.current.getEvents();
    if (res.isOk()) {
        const events = res.value;
        const event = events.find(evt => evt.key === e.detail);
        if (event) new FIRSTEvent(event).select();
    }
};
</script>

<Select bind:options bind:value bind:values on:change="{handleChange}"></Select>
