import { DB } from '../databases';
import {
    TBAEvent,
    TBAMatch,
    TBATeam
} from '../../../shared/submodules/tatorscout-calculations/tba';
import { TBA } from './tba';
import { attemptAsync, resolveAll } from '../../../shared/check';
import { uuid } from '../uuid';

export const pullEvent = async (eventKey: string) => {
    return attemptAsync(async () => {
        const res = await TBA.get<TBAEvent>('/event/' + eventKey);
        if (res.isErr()) throw res.error;
        if (!res.value) throw 'No event found';

        const event = res.value;

        const hasEvent = await DB.get('events/from-key', {
            eventKey: event.key
        });

        if (hasEvent.isErr()) throw hasEvent.error;

        if (!hasEvent.value) {
            console.log('Added event', event.key);
            DB.run('events/new-event', {
                eventKey: event.key,
                flipX: 0,
                flipY: 0
            });
        }

        const [teams, matches] = await Promise.all([
            TBA.get<TBATeam[]>(`/event/${event.key}/teams`),
            TBA.get<TBAMatch[]>(`/event/${event.key}/matches`)
        ]);

        if (teams.isErr()) throw teams.error;

        if (matches.isErr()) throw matches.error;

        if (teams.value) {
            const current = await DB.all('teams/from-event', {
                eventKey: event.key
            });

            if (current.isErr()) throw current.error;

            for (const team of teams.value) {
                const has = current.value.find(
                    t => t.number === team.team_number
                );
                if (!has) {
                    console.log('Added team', team.team_number);
                    DB.run('teams/new', {
                        eventKey: event.key,
                        number: team.team_number,
                        watchPriority: 0
                    });
                }
            }
        }

        if (matches.value) {
            const current = await DB.all('matches/from-event', {
                eventKey: event.key
            });

            if (current.isErr()) throw current.error;

            for (const match of matches.value) {
                const has = current.value.find(
                    m =>
                        m.matchNumber === match.match_number &&
                        m.compLevel === match.comp_level
                );

                if (!has) {
                    console.log('Added match', match.match_number);
                    DB.run('matches/new', {
                        eventKey: event.key,
                        matchNumber: match.match_number,
                        compLevel: match.comp_level,
                        id: uuid()
                    });
                }
            }
        }
    });
};

export const pullAllEvents = async () => {
    return attemptAsync(async () => {
        const res = await TBA.get<TBAEvent[]>(`/team/frc2122/events/${new Date().getFullYear()}`);
        if (res.isErr()) throw res.error;
        if (!res.value) throw 'No events found';

        const result = resolveAll(await Promise.all(res.value.map(e => pullEvent(e.key))));
        if (result.isErr()) throw result.error;
        return result.value;
    });
};