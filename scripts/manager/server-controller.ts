import { DB } from '../../server/utilities/databases.ts';
import { TBA } from '../../server/utilities/tba/tba.ts';
import { uuid } from '../../server/utilities/uuid.ts';
import { TBAEvent, TBATeam, TBAMatch } from '../../shared/submodules/tatorscout-calculations/tba.ts';
import { backToMain } from '../manager.ts';
import { select } from '../prompt.ts';

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

        const hasEvent = await DB.get('events/from-key', {
            eventKey: event.key
        });

        if (hasEvent.isErr()) {
            return backToMain('Error checking for event: ' + hasEvent.error);
        }

        if (!hasEvent.value) {
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

        if (teams.isErr()) {
            return backToMain('Error retrieving teams: ' + teams.error);
        }

        if (matches.isErr()) {
            return backToMain('Error retrieving matches: ' + matches.error);
        }

        if (teams.value) {
            const current = await DB.all('teams/from-event', {
                eventKey: event.key
            });

            if (current.isErr()) {
                return backToMain('Error retrieving current teams: ' + current.error);
            }

            for (const team of teams.value) {
                const has = current.value.find(t => t.number === team.team_number);
                if (!has) {
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

            if (current.isErr()) {
                return backToMain('Error retrieving current matches: ' + current.error);
            }

            for (const match of matches.value) {
                const has = current.value.find(m => m.matchNumber === match.match_number && m.compLevel === match.comp_level);

                if (!has) {
                    DB.run('matches/new', {
                        eventKey: event.key,
                        matchNumber: match.match_number,
                        compLevel: match.comp_level,
                        id: uuid()
                    });
                }
            }
        }
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
