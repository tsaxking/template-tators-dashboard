import { DB } from '../databases.ts';
import {
    TBAEvent,
    TBAMatch,
    TBATeam,
} from '../../../shared/submodules/tatorscout-calculations/tba.ts';
import { TBA } from './tba.ts';
import { attemptAsync } from '../../../shared/check.ts';
import { uuid } from '../uuid.ts';

export const pullEvent = async (eventKey: string) => {
    return attemptAsync(async () => {
        const res = await TBA.get<TBAEvent>('/event/' + eventKey);
        if (res.isErr()) throw res.error;
        if (!res.value) throw 'No event found';

        const event = res.value;

        const hasEvent = await DB.get('events/from-key', {
            eventKey: event.key,
        });

        if (hasEvent.isErr()) throw hasEvent.error;

        if (!hasEvent.value) {
            DB.run('events/new-event', {
                eventKey: event.key,
                flipX: 0,
                flipY: 0,
            });
        }

        const [teams, matches] = await Promise.all([
            TBA.get<TBATeam[]>(`/event/${event.key}/teams`),
            TBA.get<TBAMatch[]>(`/event/${event.key}/matches`),
        ]);

        if (teams.isErr()) throw teams.error;

        if (matches.isErr()) throw matches.error;

        if (teams.value) {
            const current = await DB.all('teams/from-event', {
                eventKey: event.key,
            });

            if (current.isErr()) throw current.error;

            for (const team of teams.value) {
                const has = current.value.find(
                    (t) => t.number === team.team_number,
                );
                if (!has) {
                    DB.run('teams/new', {
                        eventKey: event.key,
                        number: team.team_number,
                        watchPriority: 0,
                    });
                }
            }
        }

        if (matches.value) {
            const current = await DB.all('matches/from-event', {
                eventKey: event.key,
            });

            if (current.isErr()) throw current.error;

            for (const match of matches.value) {
                const has = current.value.find(
                    (m) =>
                        m.matchNumber === match.match_number &&
                        m.compLevel === match.comp_level,
                );

                if (!has) {
                    DB.run('matches/new', {
                        eventKey: event.key,
                        matchNumber: match.match_number,
                        compLevel: match.comp_level,
                        id: uuid(),
                    });
                }
            }
        }
    });
};
