import { TBA } from '../../server/utilities/tba/tba.ts';
import { TBAEvent } from '../../shared/submodules/tatorscout-calculations/tba.ts';
import { backToMain } from '../manager.ts';
import { select } from '../prompt.ts';
import { pullEvent } from '../../server/utilities/tba/pull-event.ts';

export const pullEvents = async () => {
    const events = await TBA.get<TBAEvent[]>(`/team/frc2122/events/${new Date().getFullYear()}`)

    if (events.isOk()) {
        if (!events.value) {
            return backToMain('No events found');
        }

        const event = await select(
            'Select an event to pull',
            events.value.map(e => ({
                name: e.name,
                value: e
            }))
        );

        if (!event) return backToMain('No event selected');

        const res = await pullEvent(event.key);
        if (res.isErr()) return backToMain('Error pulling event: ' + res.error);
        return backToMain('Event pulled successfully');
    } else {
        return backToMain('Error retrieving events: ' + events.error);
    }
};





export const serverController = [
    {
        value: pullEvents,
        icon: '🔄',
        description: 'Pull events from TBA and place into database'
    }
];
