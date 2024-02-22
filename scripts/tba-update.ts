import { DB } from '../server/utilities/databases.ts';
import { TBA } from '../server/utilities/tba/tba.ts';
import { error, log } from '../server/utilities/terminal-logging.ts';
import { uuid } from '../server/utilities/uuid.ts';
import { CompLevel } from '../shared/db-types-extended.ts';
import {
    TBAEvent,
    TBAMatch,
    TBATeam,
} from '../shared/submodules/tatorscout-calculations/tba.ts';

export const saveEvent = async (eventKey: string) => {
    const event = await TBA.get<TBAEvent>('/event/' + eventKey);
    if (!event) return error(`Error getting event ${eventKey} from TBA API!`);

    // check if event exists
    const exists = await DB.get('events/from-key', {
        eventKey,
    });

    if (exists.isOk()) {
        if (Deno.args.includes('--force') && Deno.args.includes('--tba-task')) {
            DB.unsafe.run(`DELETE FROM Teams WHERE eventKey = ?`, eventKey);
            DB.unsafe.run(`DELETE FROM Matches WHERE eventKey = ?`, eventKey);
            DB.unsafe.run(`DELETE FROM Events WHERE eventKey = ?`, eventKey);
            DB.run('events/new-event', {
                eventKey,
                flipX: 0,
                flipY: 0,
            });
        } else {
            log('Event already exists in database!');
        }
    } else {
        DB.run('events/new-event', {
            eventKey,
            flipX: 0,
            flipY: 0,
        });
    }

    saveMatches(eventKey);
    saveTeams(eventKey);
};

export const saveMatches = async (eventKey: string) => {
    log('Getting matches for event', eventKey);
    const matches = await TBA.get<TBAMatch[]>(
        '/event/' + eventKey + '/matches',
    );
    if (matches.isErr() || !matches.value) {
        return error(
            `Error getting matches for event ${eventKey} from TBA API!`,
        );
    }

    const existingMatches = await DB.all('matches/from-event', {
        eventKey,
    });

    if (existingMatches.isErr()) {
        return error('Error getting existing matches from database!');
    }

    let saved = 0;
    for (const match of matches.value) {
        // check if match exists
        if (
            existingMatches.value.some(
                (m) =>
                    m.matchNumber === match.match_number &&
                    m.compLevel === match.comp_level,
            )
        ) {
            if (
                Deno.args.includes('--force') &&
                Deno.args.includes('--tba-task')
            ) {
                DB.unsafe.run(
                    `DELETE FROM matches WHERE eventKey = ? AND matchNumber = ? AND compLevel = ?`,
                    eventKey,
                    match.match_number,
                    match.comp_level,
                );
            } else {
                continue;
            }
        }

        DB.run('matches/new', {
            id: uuid(),
            eventKey,
            compLevel: match.comp_level as CompLevel,
            matchNumber: match.match_number,
        });
        saved++;
    }

    if (saved) {
        log(`Saved ${saved} new matches for event ${eventKey}!`);
    }
};

export const saveTeams = async (eventKey: string) => {
    log('Getting teams for event', eventKey);
    const teams = await TBA.get<TBATeam[]>(
        '/event/' + eventKey + '/teams/simple',
    );
    if (teams.isErr() || !teams.value) {
        return error(`Error getting teams for event ${eventKey} from TBA API!`);
    }

    const existingTeams = await DB.all('teams/from-event', {
        eventKey,
    });

    if (existingTeams.isErr()) {
        return error('Error getting existing teams from database!');
    }

    let saved = 0;
    for (const team of teams.value) {
        // check if team exists
        if (existingTeams.value.some((t) => t.number === team.team_number)) {
            if (
                Deno.args.includes('--force') &&
                Deno.args.includes('--tba-task')
            ) {
                DB.unsafe.run(
                    `DELETE FROM teams WHERE eventKey = ? AND number = ?`,
                    eventKey,
                    team.team_number,
                );
            } else {
                continue;
            }
        }

        DB.run('teams/new', {
            number: team.team_number,
            eventKey,
            watchPriority: 0,
        });

        saved++;
    }

    if (saved) {
        log(`Saved ${saved} new teams for event ${eventKey}!`);
    }
};

const updateYear = async (year: number) => {
    const events = await TBA.get<TBAEvent[]>(
        `/team/frc2122/events/${year}/simple`,
    );
    if (Array.isArray(events)) {
        for (const event of events) {
            await saveEvent(event.key);
        }
    }
};

// if running from command line
if (Deno.args.includes('--update') && Deno.args.includes('--tba-task')) {
    if (Deno.args.includes('--force')) {
        log(
            'Forcing updates... This will reset all existing data for the event(s) being updated! (Including matches and teams)',
        );
        const res = prompt('Are you sure you want to continue? (y/n)');
        if (res !== 'y') {
            error('Aborting update!');
            Deno.exit();
        }
    }

    const eventKey = Deno.args[Deno.args.indexOf('--update') + 1];
    if (eventKey) {
        if (eventKey === 'now') {
            const year = new Date().getFullYear();
            await updateYear(year);
        } else if (eventKey === 'all') {
            const year = new Date().getFullYear();
            for (let y = year; y >= 2007; y--) {
                updateYear(y);
            }
        } else {
            saveEvent(eventKey);
        }
    } else {
        error('No event key specified!');
    }
}
