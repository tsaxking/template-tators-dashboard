import { DB } from '../server/utilities/databases.ts';
import env from '../server/utilities/env.ts';
import { uuid } from '../server/utilities/uuid.ts';
import { Team } from '../shared/db-types-extended.ts';

if (['production', 'prod'].includes(env.ENVIRONMENT as string)) {
    console.log('Cannot run dummy data in production! You could make bad data!');
    Deno.exit();
}

const chars = 'abcdefghijklmnopqrstuvwxyz';
const char = (num: number) => new Array(num).fill('').map(_ => chars[Math.floor(Math.random() * chars.length)]).join('');
const num = (num: number) => +new Array(num).fill(0).map(_ => Math.floor(Math.random() * 10)).join('');

const createEvent = () => {
    const year = num(4);
    const chars = char(4);
    const key = year + chars;

    DB.run('events/new-event', {
        eventKey: key,
        flipX: false,
        flipY: false
    });

    return {
        key,
        flipX: false,
        flipY: false
    }
}

const createTeam = (eventKey: string) => {
    const teams = DB.all('teams/from-event', { eventKey });

    let team: number;

    do {
        team = num(5);
    } while (teams.some(t => t.number === team));


    DB.run('teams/new', {
        number: team,
        eventKey,
        watchPriority: 0
    });

    return {
        number: team,
        eventKey,
        watchPriority: 0
    }
}

const createMatch = (eventKey: string, i: number, compLevel: 'pr' | 'qm' | 'qf' | 'sf' | 'f' ) => {
    if (i < 1) throw new Error('i must be greater than 0');
    const id = uuid();

    DB.run('matches/new', {
        id,
        eventKey,
        matchNumber: i,
        compLevel
    });

    return {
        id,
        eventKey,
        matchNumber: i,
        compLevel
    }
}

const createMatchScouting = (team: number, matchId: string, eventKey: string) => {
    const ms = DB.all('match-scouting/from-team', { team, eventKey });


}