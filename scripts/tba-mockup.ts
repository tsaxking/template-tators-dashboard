/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import csv from 'csv-parser';
import fs from 'fs';
import z from 'zod';
import {
    TBAEvent,
    TBAMatch,
    TBATeam
} from '../shared/submodules/tatorscout-calculations/tba';
import { TBA } from '../server/utilities/tba/tba';
import { DB } from '../server/utilities/databases';
import { prompt } from './prompt';
import { uuid } from '../server/utilities/uuid';
import { resolveAll, Result } from '../shared/check';

const pathname = (filename: string) => path.join(__dirname, './csv', filename);

const populateTeams = (eventKey: string) => {
    return new Promise<void>((res, rej) => {
        const promises: Promise<Result<unknown>>[] = [];
        const teams: TBATeam[] = [];
        fs.createReadStream(pathname(`${eventKey}.teams.csv`))
            .pipe(csv() as any) // this does work
            .on('data', (data: unknown) => {
                const team = z
                    .object({
                        'Team Number': z.string(),
                        Name: z.string()
                    })
                    .parse(data);
    
                const tbaTeam: TBATeam = {
                    key: `frc${team['Team Number']}`,
                    team_number: parseInt(team['Team Number']),
                    nickname: team['Name'],
                    name: team['Name'],
                    city: '???',
                    state_prov: '???',
                    country: '???',
                    address: '???',
                    postal_code: '???',
                    gmaps_place_id: '???',
                    gmaps_url: '???',
                    lat: 0,
                    lng: 0,
                    location_name: '???',
                    motto: '???',
                    website: '???',
                    rookie_year: 0,
                    home_championship: {
                        key: '???',
                        year: 0,
                        event_code: '???',
                        division_keys: []
                    }
                };
    
                teams.push(tbaTeam);
    
                promises.push(DB.run('teams/new', {
                    eventKey,
                    number: tbaTeam.team_number,
                    watchPriority: 0
                }));
            })
            .on('end', async () => {
                console.log('Creating tba team override...');
                (
                    await DB.run('tba/new', {
                        override: true,
                        url: `/event/${eventKey}/teams`,
                        response: JSON.stringify(teams),
                        updated: Date.now(),
                        update: 1
                    })
                ).unwrap();
    
                console.log('Creating tba team/simple override...');
                (
                    await DB.run('tba/new', {
                        override: true,
                        url: `/event/${eventKey}/teams/simple`,
                        response: JSON.stringify(teams),
                        updated: Date.now(),
                        update: 1
                    })
                ).unwrap();

                const result = resolveAll(await Promise.all(promises));
                if (result.isErr()) return rej(result.error);
                res();
            });
    });
};

const populateMatches = (eventKey: string) => {
    return new Promise<void>((res, rej) => {
        const promises: Promise<Result<unknown>>[] = [];
        const matches: TBAMatch[] = [];
        fs.createReadStream(pathname(`${eventKey}.matches.csv`))
            .pipe(csv() as any) // this does work
            .on('data', (data: unknown) => {
                const match = z
                    .object({
                        'Comp Level': z.enum(['qm', 'qf', 'sf', 'f']),
                        'Set Number': z.string(),
                        'Match Number': z.string(),
                        'Red 1': z.string(), // just the number, not frc####
                        'Red 2': z.string(),
                        'Red 3': z.string(),
                        'Blue 1': z.string(),
                        'Blue 2': z.string(),
                        'Blue 3': z.string(),
                        'Red Score': z.string(),
                        'Blue Score': z.string(),
                        Time: z.string()
                    })
                    .parse(data);
    
                const tbaMatch: TBAMatch = {
                    key: `${eventKey}_${match['Comp Level']}${match['Set Number']}m${match['Match Number']}`,
                    comp_level: match['Comp Level'],
                    set_number: parseInt(match['Set Number']),
                    match_number: parseInt(match['Match Number']),
                    alliances: {
                        red: {
                            team_keys: [
                                `frc${match['Red 1']}`,
                                `frc${match['Red 2']}`,
                                `frc${match['Red 3']}`
                            ],
                            score: parseInt(match['Red Score'])
                        },
                        blue: {
                            team_keys: [
                                `frc${match['Blue 1']}`,
                                `frc${match['Blue 2']}`,
                                `frc${match['Blue 3']}`
                            ],
                            score: parseInt(match['Blue Score'])
                        }
                    },
                    winning_alliance:
                        match['Red Score'] > match['Blue Score'] ? 'red' : 'blue',
                    event_key: eventKey,
                    time: new Date(match['Time']).getTime(),
                    actual_time: new Date(match['Time']).getTime(),
                    predicted_time: new Date(match['Time']).getTime(),
                    post_result_time: new Date(match['Time']).getTime(),
                    score_breakdown: {
                        red: {},
                        blue: {}
                    },
                    videos: []
                };
    
                matches.push(tbaMatch);
    
                promises.push(DB.run('matches/new', {
                    compLevel: tbaMatch.comp_level,
                    matchNumber: tbaMatch.match_number,
                    eventKey: eventKey,
                    id: uuid()
                }));
            })
            .on('end', async () => {
                console.log('Creating tba match override...');
                (
                    await DB.run('tba/new', {
                        override: true,
                        url: `/event/${eventKey}/matches`,
                        response: JSON.stringify(matches),
                        updated: Date.now(),
                        update: 1
                    })
                ).unwrap();
    
                console.log('Creating tba match/simple override...');
                (
                    await DB.run('tba/new', {
                        override: true,
                        url: `/event/${eventKey}/matches/simple`,
                        response: JSON.stringify(matches),
                        updated: Date.now(),
                        update: 1
                    })
                ).unwrap();

                const result = resolveAll(await Promise.all(promises));
                if (result.isErr()) return rej(result.error);
                res();
            });
    });
};

const populateEvent = async () => {
    console.clear();
    const eventKey = await prompt('Enter event key');
    if (!eventKey) return console.error('No event key provided!');

    // test regex ####ZZZ(Z)
    const regex = /^\d{4}[a-zA-Z]{3,4}$/;
    if (!regex.test(eventKey))
        return console.error('Invalid event key! (####ZZZZ or ####ZZZ)');

    const name = await prompt('Enter event name');
    if (!name) return console.error('No event name provided!');
    const start = await prompt('Enter event start date (YYYY-MM-DD)');
    if (!start) return console.error('No event start date provided!');
    const end = await prompt('Enter event end date (YYYY-MM-DD)');
    if (!end) return console.error('No event end date provided!');

    const year = new Date(start).getFullYear();

    const tbaEvent: TBAEvent = {
        key: eventKey,
        name,
        start_date: new Date(start).toISOString(),
        end_date: new Date(end).toISOString(),
        district: {
            abbreviation: '???',
            display_name: '???',
            key: '???',
            year: 0
        },
        city: '???',
        state_prov: '???',
        country: '???',
        year: year,
        event_code: eventKey,
        event_type: 0
    };

    console.log('Event:', tbaEvent);
    const confirmed = await prompt('Confirm event creation? (y/n)');
    if (confirmed !== 'y') return console.error('Aborted event creation!');

    console.log('Creating tba event override...');
    (
        await DB.run('tba/new', {
            override: true,
            url: `/event/${eventKey}`,
            response: JSON.stringify(tbaEvent),
            updated: Date.now(),
            update: 1
        })
    ).unwrap();

    console.log('Creating tba event/simple override...');
    (
        await DB.run('tba/new', {
            override: true,
            url: `/event/${eventKey}/simple`,
            response: JSON.stringify(tbaEvent),
            updated: Date.now(),
            update: 1
        })
    ).unwrap();

    console.log('Creating tba year/event override...');
    const current = await TBA.get<TBAEvent[]>(`/team/frc2122/events/${year}`);
    if (current.isErr()) return console.error(current.error);
    if (!current.value) return console.error('No current events found!');
    current.value.push(tbaEvent);
    (
        await DB.run('tba/new', {
            override: true,
            url: `/team/frc2122/events/${year}`,
            response: JSON.stringify(current.value),
            updated: Date.now(),
            update: 1
        })
    ).unwrap();

    (
        await DB.run('tba/new', {
            override: true,
            url: `/team/frc2122/events/${year}/simple`,
            response: JSON.stringify(current.value),
            updated: Date.now(),
            update: 1
        })
    ).unwrap();

    (
        await DB.run('tba/new', {
            override: true,
            url: `/team/frc2122/events/${year}/keys`,
            response: JSON.stringify(current.value.map(e => e.key)),
            updated: Date.now(),
            update: 1
        })
    ).unwrap();

    console.log('Creating event...');
    (
        await DB.run('events/new-event', {
            eventKey: eventKey,
            flipX: 0,
            flipY: 0
        })
    ).unwrap();

    await prompt(
        `Please put the csv files in the folder and press [ENTER] when ready. Name them as follows: ./csv/${eventKey}.teams.csv and ./csv/1/0${eventKey}.matches.csv. Make them here: https://docs.google.com/spreadsheets/d/1YrGMOyuECdMjizRmta3KZqF4TIVD_vO_XTrzqm0GTvQ/edit?gid=1123440159#gid=1123440159`
    );

    console.log('Populating teams...');
    await populateTeams(eventKey);
    console.log('Populating matches...');
    await populateMatches(eventKey);

    console.log('Event creation complete!');
    await test(eventKey);
    process.exit(0);
};

const test = async (eventKey: string) => {
    console.clear();
    const event = await TBA.get<TBAEvent>(`/event/${eventKey}`);
    if (event.isErr()) return console.error(event.error);
    console.log(event.value);
    const teams = await TBA.get<TBATeam[]>(`/event/${eventKey}/teams`);
    if (teams.isErr()) return console.error(teams.error);
    console.log(teams.value);
    const matches = await TBA.get<TBAMatch[]>(`/event/${eventKey}/matches`);
    if (matches.isErr()) return console.error(matches.error);
    console.log(matches.value);
};

DB.connect().then(() => populateEvent());