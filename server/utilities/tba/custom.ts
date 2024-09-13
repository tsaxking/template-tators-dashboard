import { attemptAsync, resolveAll } from '../../../shared/check';
import { TBA } from './tba';
import { DB } from '../databases';
import {
    TBAEvent,
    TBAMatch,
    TBATeam
} from '../../../shared/submodules/tatorscout-calculations/tba';
import { validate } from '../../middleware/data-type';
import { ServerFunction } from '../../structure/app/app';

// const multiValidate = <T extends Record<string, unknown>>(data: {
//     [K in keyof T]: ServerFunction<T[K]>;
// }): ServerFunction<T> => {
//     return (req, res, next) => {
//         const body = req.body;

//         const run = (key: keyof T, next: keyof T | undefined) => {
//             const newBody = body[key];
//             Object.assign(req, { body: newBody });

//             if (next) return run(next, Object.keys(data)[Object.keys(data).indexOf(next as string) + 1] as keyof T);
//         }

//         Object.assign(req, { body });
//         next();
//     };
// }

const insert = (url: string, response: unknown) => {
    return DB.run('tba/custom-new', {
        url,
        update: 0,
        response: JSON.stringify(response),
        updated: Date.now()
    });
};

export type Event = {
    key: string;
    name: string;
    startDate: string;
    endDate: string;
    year: number;
};

export type Match = {
    key: string;
    compLevel: string;
    setNumber: number;
    matchNumber: number;
    alliances: {
        red: {
            score: number;
            team_keys: [string, string, string];
        };
        blue: {
            score: number;
            team_keys: [string, string, string];
        };
    };
    winningAlliance: string;
    eventKey: string;
    actualTime: number;
    predictedTime: number;
    postResultTime: number;
    scoreBreakdown: {
        red: unknown;
        blue: unknown;
    };
    videos: {
        key: string;
        type: string;
    }[];
    time: number;
};

export type Team = {
    key: string;
    teamNumber: number;
    nickname: string;
};

export type TeamEvent = {
    eventKey: string;
    teams: Team[];
};

export const validateEvent = validate<Event>({
    key: 'string',
    name: 'string',
    startDate: 'string',
    endDate: 'string',
    year: 'number'
});

export const validateMatch = validate<Match>({
    key: 'string',
    compLevel: 'string',
    setNumber: 'number',
    matchNumber: 'number',
    alliances: (v: unknown) => {
        if (typeof v !== 'object') return false;
        if (v === null) return false;
        if (!('red' in v)) return false;
        if (!('blue' in v)) return false;

        const { red, blue } = v;

        if (typeof red !== 'object') return false;
        if (red === null) return false;
        if (!('score' in red)) return false;
        if (!('team_keys' in red)) return false;
        if (!Array.isArray(red.team_keys)) return false;
        if (red.team_keys.length !== 3) return false;
        if (!red.team_keys.every(k => typeof k === 'string')) return false;

        if (typeof blue !== 'object') return false;
        if (blue === null) return false;
        if (!('score' in blue)) return false;
        if (!('team_keys' in blue)) return false;
        if (!Array.isArray(blue.team_keys)) return false;
        if (blue.team_keys.length !== 3) return false;
        if (!blue.team_keys.every(k => typeof k === 'string')) return false;

        return true;
    },
    winningAlliance: 'string',
    eventKey: 'string',
    actualTime: 'number',
    predictedTime: 'number',
    postResultTime: 'number',
    scoreBreakdown: (v: unknown) => {
        if (typeof v !== 'object') return false;
        if (v === null) return false;

        if (!('red' in v)) return false;
        if (!('blue' in v)) return false;

        const { red, blue } = v;
        if (typeof red !== 'object') return false;
        if (red === null) return false;
        if (typeof blue !== 'object') return false;
        if (blue === null) return false;

        return true;
    },
    videos: (v: unknown) => {
        if (!Array.isArray(v)) return false;
        if (!v.every(e => typeof e === 'object')) return false;
        if (!v.every(e => e !== null)) return false;
        if (!v.every(e => 'key' in e)) return false;
        if (!v.every(e => 'type' in e)) return false;
        if (!v.every(e => typeof e.key === 'string')) return false;
        if (!v.every(e => typeof e.type === 'string')) return false;

        return true;
    },
    time: 'number'
});

export const validateTeam = validate<Team>({
    key: 'string',
    teamNumber: 'number',
    nickname: 'string'
});

export const validateTeamEvent = validate<TeamEvent>({
    eventKey: 'string',
    teams: (v: unknown) => {
        if (!Array.isArray(v)) return false;
        if (!v.every(e => typeof e === 'object')) return false;
        if (!v.every(e => e !== null)) return false;
        if (!v.every(e => 'key' in e)) return false;
        if (!v.every(e => 'teamNumber' in e)) return false;
        if (!v.every(e => 'nickname' in e)) return false;
        if (!v.every(e => typeof e.key === 'string')) return false;
        if (!v.every(e => typeof e.teamNumber === 'number')) return false;
        if (!v.every(e => typeof e.nickname === 'string')) return false;

        return true;
    }
});

const typeEvent = (e: Event): TBAEvent => ({
    key: e.key,
    name: e.name,
    start_date: e.startDate,
    end_date: e.endDate,
    year: e.year,
    district: {
        abbreviation: '',
        display_name: '',
        key: '',
        year: 0
    },
    event_code: '',
    event_type: 0,
    state_prov: '',
    country: '',
    city: ''
});

const typeMatch = (m: Match): TBAMatch => ({
    key: m.key,
    comp_level: m.compLevel,
    set_number: m.setNumber,
    match_number: m.matchNumber,
    alliances: {
        red: {
            score: m.alliances.red.score,
            team_keys: m.alliances.red.team_keys
        },
        blue: {
            score: m.alliances.blue.score,
            team_keys: m.alliances.blue.team_keys
        }
    },
    winning_alliance: m.winningAlliance,
    event_key: m.eventKey,
    actual_time: m.actualTime,
    predicted_time: m.predictedTime,
    post_result_time: m.postResultTime,
    score_breakdown: m.scoreBreakdown,
    videos: m.videos,
    time: m.time
});

const typeTeam = (t: Team): TBATeam => ({
    key: t.key,
    team_number: t.teamNumber,
    nickname: t.nickname,
    name: '',
    city: '',
    state_prov: '',
    country: '',
    address: '',
    postal_code: '',
    gmaps_place_id: '',
    gmaps_url: '',
    lat: 0,
    lng: 0,
    location_name: '',
    website: '',
    rookie_year: 0,
    motto: '',
    home_championship: {
        key: '',
        year: 0,
        event_code: '',
        division_keys: []
    }
});

export const createEvent = (event: Event) => {
    return attemptAsync(async () => {
        const e = JSON.stringify(typeEvent(event));
        TBA_EVENT_ARRAY: {
            const currentEvents = (
                await DB.get('tba/custom-from-url', {
                    url: '/team/frc2122/events/' + event.year
                })
            ).unwrap();

            if (currentEvents && currentEvents.response) {
                const res = JSON.parse(currentEvents.response) as TBAEvent[];
                if (res.some(r => r.key === event.key)) {
                    break TBA_EVENT_ARRAY;
                }

                (
                    await DB.run('tba/custom-new', {
                        url: '/team/frc2122/events/' + event.year,
                        update: 0,
                        response: JSON.stringify([...res, typeEvent(event)]),
                        updated: Date.now()
                    })
                ).unwrap();
            }
        }

        EVENT_KEY_ARRAY: {
            const currentEvents = (
                await DB.get('tba/custom-from-url', {
                    url: '/team/frc2122/events/' + event.year + '/keys'
                })
            ).unwrap();

            if (currentEvents && currentEvents.response) {
                const res = JSON.parse(currentEvents.response) as string[];
                if (res.includes(event.key)) {
                    break EVENT_KEY_ARRAY;
                }

                (
                    await DB.run('tba/custom-new', {
                        url: '/team/frc2122/events/' + event.year + '/keys',
                        update: 0,
                        response: JSON.stringify([...res, event.key]),
                        updated: Date.now()
                    })
                ).unwrap();
            }
        }

        (
            await DB.run('tba/custom-new', {
                url: '/event/' + event.key,
                update: 0,
                response: e,
                updated: Date.now()
            })
        ).unwrap();
    });
};

export const createMatch = (match: Match) => {
    return attemptAsync(async () => {
        const m = JSON.stringify(typeMatch(match));

        MATCH_ARRAY: {
            const currentMatches = (
                await DB.get('tba/custom-from-url', {
                    url: '/event/' + match.eventKey + '/matches'
                })
            ).unwrap();

            if (currentMatches && currentMatches.response) {
                const res = JSON.parse(currentMatches.response) as TBAMatch[];
                if (res.some(r => r.key === match.key)) {
                    break MATCH_ARRAY;
                }

                (
                    await insert('/event/' + match.eventKey + '/matches', [
                        ...res,
                        typeMatch(match)
                    ])
                ).unwrap();
            } else {
                (
                    await insert('/event/' + match.eventKey + '/matches', [
                        typeMatch(match)
                    ])
                ).unwrap();
            }
        }

        (await insert('/match/' + match.key, typeMatch(match))).unwrap();
    });
};

export const createTeam = (team: Team) => {
    return attemptAsync(async () => {
        const t = JSON.stringify(typeTeam(team));

        (await insert('/team/' + team.key, typeTeam(team))).unwrap();
    });
};

export const createEventTeams = async (eventKey: string, teams: Team[]) => {
    return attemptAsync(async () => {
        resolveAll(await Promise.all(teams.map(createTeam))).unwrap();

        const currentTeams = (
            await DB.get('tba/custom-from-url', {
                url: '/event/' + eventKey + '/teams'
            })
        ).unwrap();

        if (currentTeams && currentTeams.response) {
            const res = JSON.parse(currentTeams.response) as TBATeam[];
            const teamKeys = teams.map(t => t.key);

            (
                await insert('/event/' + eventKey + '/teams', [
                    ...res,
                    ...teamKeys
                ])
            ).unwrap();
        } else {
            (
                await insert(
                    '/event/' + eventKey + '/teams',
                    teams.map(t => t.key)
                )
            ).unwrap();
        }
    });
};

export const deleteEvent = (eventKey: string) => {
    return attemptAsync(async () => {
        const year = +eventKey.replace(/[^0-9]/g, '');

        (await insert('/event/' + eventKey, null)).unwrap();

        const currentEvents = (
            await DB.get('tba/custom-from-url', {
                url: '/team/frc2122/events/' + year
            })
        ).unwrap();

        if (currentEvents && currentEvents.response) {
            const res = JSON.parse(currentEvents.response) as TBAEvent[];

            (
                await insert(
                    '/team/frc2122/events/' + year,
                    res.filter(r => r.key !== eventKey)
                )
            ).unwrap();
        }

        const currentEventKeys = (
            await DB.get('tba/custom-from-url', {
                url: '/team/frc2122/events/' + year + '/keys'
            })
        ).unwrap();

        if (currentEventKeys && currentEventKeys.response) {
            const res = JSON.parse(currentEventKeys.response) as string[];

            (
                await insert(
                    '/team/frc2122/events/' + year + '/keys',
                    res.filter(r => r !== eventKey)
                )
            ).unwrap();
        }
    });
};

export const deleteMatch = (matchKey: string) => {
    return attemptAsync(async () => {
        const eventKey = matchKey.split('_')[0];

        (await insert('/match/' + matchKey, null)).unwrap();

        const currentMatches = (
            await DB.get('tba/custom-from-url', {
                url: '/event/' + eventKey + '/matches'
            })
        ).unwrap();

        if (currentMatches && currentMatches.response) {
            const res = JSON.parse(currentMatches.response) as TBAMatch[];

            (
                await insert(
                    '/event/' + eventKey + '/matches',
                    res.filter(r => r.key !== matchKey)
                )
            ).unwrap();
        }

        const currentMatchKeys = (
            await DB.get('tba/custom-from-url', {
                url: '/event/' + eventKey + '/matches/keys'
            })
        ).unwrap();

        if (currentMatchKeys && currentMatchKeys.response) {
            const res = JSON.parse(currentMatchKeys.response) as string[];

            (
                await insert(
                    '/event/' + eventKey + '/matches/keys',
                    res.filter(r => r !== matchKey)
                )
            ).unwrap();
        }
    });
};

export const deleteTeam = (teamKey: string) => {
    return attemptAsync(async () => {
        (await insert('/team/' + teamKey, null)).unwrap();
    });
};
