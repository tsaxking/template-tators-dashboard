import { TBA } from '../server/utilities/tba/tba';
import {
    TBAMatch,
    TBATeam,
    TBATeamEventStatus,
    teamsFromMatch
} from '../shared/submodules/tatorscout-calculations/tba';
import { attempt, attemptAsync, resolveAll, Result } from '../shared/check';
import { DB } from '../server/utilities/databases';
import {
    Trace,
    TraceArray
} from '../shared/submodules/tatorscout-calculations/trace';
import { capitalize, fromCamelCase } from '../shared/text';

type T = string | number | boolean | undefined;

type RowSection = {
    data: T[];
    headers: string[];
};

const getMatchScouting = async (teamNumber: number, eventKey: string) => {
    return attemptAsync(async () => {
        const res = await DB.all('match-scouting/from-team', {
            eventKey,
            team: teamNumber
        });

        if (res.isErr()) throw res.error;

        return res.value
            .map(m => {
                return {
                    ...m,
                    trace: JSON.parse(m.trace) as TraceArray
                };
            })
            .reverse()
            .filter((s, i, a) => {
                return (
                    a.findIndex(
                        s2 =>
                            s2.matchNumber === s.matchNumber &&
                            s.compLevel === s2.compLevel
                    ) === i
                );
            });
    });
};

export class Table {
    public static async build(
        eventKey: string
    ): Promise<Result<[string[], ...T[][]]>> {
        return attemptAsync(async () => {
            const teams = await TBA.get<TBATeam[]>(`/event/${eventKey}/teams`);

            if (teams.isErr()) throw teams.error;
            if (!teams.value) throw new Error('No teams found');

            const data = await Promise.all(
                teams.value
                    .sort((a, b) => a.team_number - b.team_number)
                    .map(t => Table.buildTeamByYear(t.team_number, eventKey))
            );

            const headers = data[0].headers;
            const rows = data.map(d => d.data);

            return [headers, ...rows];
        });
    }

    public static async buildTeamByYear(
        teamNumber: number,
        eventKey: string
    ): Promise<RowSection> {
        const year = parseInt(eventKey.slice(0, 4));
        if (!year) throw new Error('Invalid event key');

        const pull = async (
            fn: (t: number, k: string) => Promise<Result<RowSection>>
        ): Promise<RowSection & { title: string }> => {
            const data = await fn(teamNumber, eventKey);
            if (data.isErr()) {
                console.log(data.error);
                return {
                    // this will not populate the table with the error message, but it will log it.
                    title: 'Error',
                    headers: [],
                    data: []
                };
            }

            if (data.value.data.length !== data.value.headers.length) {
                console.error('Data and headers do not match');
                return {
                    title: 'Error',
                    headers: [],
                    data: []
                };
            }

            return {
                title: capitalize(fromCamelCase(fn.name)),
                ...data.value
            };
        };

        if (!Table.yearInfo[year as keyof typeof Table.yearInfo])
            throw new Error('Year not supported');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await Promise.all(
            (
                Object.values(
                    Table.yearInfo[year as keyof typeof Table.yearInfo]
                ) as ((t: number, k: string) => Promise<Result<RowSection>>)[]
            ).map(pull)
        );

        return {
            headers: data.map(d => d.headers).flat(),
            data: data.map(d => d.data).flat()
        };
    }

    public static get yearInfo() {
        return {
            2024: {
                teamGeneral: async (
                    teamNumber: number,
                    eventKey: string
                ): Promise<Result<RowSection>> => {
                    return attemptAsync(async () => {
                        const headers: string[] = [
                            'Team Number',
                            'Team Name',
                            'Rank',
                            'Rank Points'
                        ];

                        const [team, event] = await Promise.all([
                            TBA.get<TBATeam>('/team/frc' + teamNumber),
                            TBA.get<TBATeamEventStatus>(
                                '/team/frc' +
                                    teamNumber +
                                    '/event/' +
                                    eventKey +
                                    '/status'
                            )
                        ]);

                        if (team.isErr()) throw team.error;
                        if (event.isErr()) throw event.error;

                        return {
                            headers,
                            data: [
                                teamNumber,
                                team.value?.nickname || '',
                                event.value?.qual?.ranking?.rank || 0,
                                event.value?.qual?.ranking?.sort_orders?.[0] ||
                                    0
                            ]
                        };
                    });
                },
                robotGeneral: async (
                    teamNumber: number,
                    eventKey: string
                ): Promise<Result<RowSection>> => {
                    return attemptAsync(async () => {
                        const headers: string[] = [
                            'Average Velocity',
                            'Checks',
                            'Weight',
                            'Height',
                            'Width',
                            'Length'
                        ];

                        const res = await getMatchScouting(
                            teamNumber,
                            eventKey
                        );
                        if (res.isErr()) throw res.error;
                        const matches = res.value;

                        const avg = Trace.velocity.average(
                            matches.map(m => m.trace).flat()
                        );

                        const pitScouting = await DB.all(
                            'scouting-questions/answer-from-team',
                            {
                                teamNumber,
                                eventKey
                            }
                        );

                        if (pitScouting.isErr()) throw pitScouting.error;

                        const weight =
                            pitScouting.value.find(p =>
                                /weight/i.test(p.question)
                            )?.answer || '[]';
                        const height =
                            pitScouting.value.find(p =>
                                /height/i.test(p.question)
                            )?.answer || '[]';
                        const width =
                            pitScouting.value.find(p =>
                                /width/i.test(p.question)
                            )?.answer || '[]';
                        const length =
                            pitScouting.value.find(p =>
                                /length/i.test(p.question)
                            )?.answer || '[]';

                        const checks = matches.reduce((acc, cur) => {
                            return (
                                acc +
                                ' ' +
                                (JSON.parse(cur.checks) as string[]).join(' ')
                            );
                        }, '');

                        return {
                            headers,
                            data: [
                                avg,
                                checks,
                                (JSON.parse(weight) as string[]).join(','),
                                (JSON.parse(height) as string[]).join(','),
                                (JSON.parse(width) as string[]).join(','),
                                (JSON.parse(length) as string[]).join(',')
                            ]
                        };
                    });
                },
                matchGeneral: async (
                    teamNumber: number,
                    eventKey: string
                ): Promise<Result<RowSection>> => {
                    return attemptAsync(async () => {
                        const headers: string[] = [
                            'Average Score Contribution',
                            'Max Score Contribution',
                            'Average Auto Score',
                            'Max Auto Score',
                            'Average Teleop Score',
                            'Max Teleop Score',
                            'Average Endgame Score',
                            'Max Endgame Score',
                            'Average Lobs per Match',
                        ];

                        const res = await getMatchScouting(
                            teamNumber,
                            eventKey
                        );
                        if (res.isErr()) throw res.error;
                        const matches = res.value;

                        const tbaMatches = await TBA.get<TBAMatch[]>(
                            '/event/' + eventKey + '/matches'
                        );

                        if (tbaMatches.isErr()) throw tbaMatches.error;
                        if (!tbaMatches.value)
                            throw new Error('No matches found');

                        const scoresRes = matches.map(m => {
                            return attempt(() => {
                                const match = tbaMatches.value?.find(
                                    match =>
                                        match.match_number === m.matchNumber &&
                                        match.comp_level === m.compLevel
                                );

                                if (!match) throw new Error('Match not found');

                                const [r1, r2, r3, b1, b2, b3] =
                                    teamsFromMatch(match);

                                let alliance: 'red' | 'blue';
                                if ([r1, r2, r3].includes(teamNumber))
                                    alliance = 'red';
                                else if ([b1, b2, b3].includes(teamNumber))
                                    alliance = 'blue';
                                else throw new Error('Team not found in match');

                                const trace = m.trace;

                                return Trace.score.parse2024(trace, alliance);
                            });
                        });

                        const scores = scoresRes
                            .map(s => (s.isOk() ? s.value : null))
                            .filter(Boolean);

                        return {
                            headers,
                            data: [
                                scores.reduce((a, b) => a + b.total, 0) /
                                    scores.length,
                                Math.max(...scores.map(s => s.total)),
                                scores.reduce((a, b) => a + b.auto.total, 0) /
                                    scores.length,
                                Math.max(...scores.map(s => s.auto.total)),
                                scores.reduce((a, b) => a + b.teleop.total, 0) /
                                    scores.length,
                                Math.max(...scores.map(s => s.teleop.total)),
                                scores.reduce(
                                    (a, b) => a + b.endgame.total,
                                    0
                                ) / scores.length,
                                Math.max(...scores.map(s => s.endgame.total)),
                                Math.max(...scores.map(s => s.teleop.lob)),
                            ]
                        };
                    });
                },
                autoBreakdown: async (
                    teamNumber: number,
                    eventKey: string
                ): Promise<Result<RowSection>> => {
                    return attemptAsync(async () => {
                        const headers: string[] = [
                            'Average Speaker',
                            'Max Speaker',
                            // 'Average Amp',
                            'Max Amp',
                            'Average Mobility'
                        ];

                        const res = await getMatchScouting(
                            teamNumber,
                            eventKey
                        );
                        if (res.isErr()) throw res.error;
                        const matches = res.value;

                        const tbaMatches = await TBA.get<TBAMatch[]>(
                            '/event/' + eventKey + '/matches'
                        );

                        if (tbaMatches.isErr()) throw tbaMatches.error;
                        if (!tbaMatches.value)
                            throw new Error('No matches found');

                        const scoresRes = matches.map(m => {
                            return attempt(() => {
                                const match = tbaMatches.value?.find(
                                    match =>
                                        match.match_number === m.matchNumber &&
                                        match.comp_level === m.compLevel
                                );

                                if (!match) throw new Error('Match not found');

                                const [r1, r2, r3, b1, b2, b3] =
                                    teamsFromMatch(match);

                                let alliance: 'red' | 'blue';
                                if ([r1, r2, r3].includes(teamNumber))
                                    alliance = 'red';
                                else if ([b1, b2, b3].includes(teamNumber))
                                    alliance = 'blue';
                                else throw new Error('Team not found in match');

                                const trace = m.trace;

                                return Trace.score.parse2024(trace, alliance)
                                    .auto;
                            });
                        });

                        const scores = scoresRes
                            .map(s => (s.isOk() ? s.value : null))
                            .filter(Boolean);

                        return {
                            headers,
                            data: [
                                scores.reduce((a, b) => a + b.spk, 0) /
                                    scores.length,
                                Math.max(...scores.map(s => s.spk)),
                                // scores.reduce((a, b) => a + b.amp, 0) /
                                //     scores.length,
                                Math.max(...scores.map(s => s.amp)),
                                scores.reduce((a, b) => a + b.mobility, 0) /
                                    scores.length
                            ]
                        };
                    });
                },
                teleBreakdown: async (
                    teamNumber: number,
                    eventKey: string
                ): Promise<Result<RowSection>> => {
                    return attemptAsync(async () => {
                        const headers: string[] = [
                            'Average Speaker',
                            'Max Speaker',
                            'Average Amp',
                            'Max Amp',
                            'Average Trap'
                        ];

                        const res = await getMatchScouting(
                            teamNumber,
                            eventKey
                        );
                        if (res.isErr()) throw res.error;
                        const matches = res.value;

                        const tbaMatches = await TBA.get<TBAMatch[]>(
                            '/event/' + eventKey + '/matches'
                        );

                        if (tbaMatches.isErr()) throw tbaMatches.error;
                        if (!tbaMatches.value)
                            throw new Error('No matches found');

                        const scoresRes = matches.map(m => {
                            return attempt(() => {
                                const match = tbaMatches.value?.find(
                                    match =>
                                        match.match_number === m.matchNumber &&
                                        match.comp_level === m.compLevel
                                );

                                if (!match) throw new Error('Match not found');

                                const [r1, r2, r3, b1, b2, b3] =
                                    teamsFromMatch(match);

                                let alliance: 'red' | 'blue';
                                if ([r1, r2, r3].includes(teamNumber))
                                    alliance = 'red';
                                else if ([b1, b2, b3].includes(teamNumber))
                                    alliance = 'blue';
                                else throw new Error('Team not found in match');

                                const trace = m.trace;

                                return Trace.score.parse2024(trace, alliance)
                                    .teleop;
                            });
                        });
                        const scores = scoresRes
                            .map(s => (s.isOk() ? s.value : null))
                            .filter(Boolean);
                        return {
                            headers,
                            data: [
                                scores.reduce((a, b) => a + b.spk, 0) /
                                    scores.length,
                                Math.max(...scores.map(s => s.spk)),
                                scores.reduce((a, b) => a + b.amp, 0) /
                                    scores.length,
                                Math.max(...scores.map(s => s.amp)),
                                scores.reduce((a, b) => a + b.trp, 0) /
                                    scores.length
                            ]
                        };
                    });
                },
                endgameBreakdown: async (
                    teamNumber: number,
                    eventKey: string
                ): Promise<Result<RowSection>> => {
                    return attemptAsync(async () => {
                        const headers: string[] = [
                            'Average Climb',
                            'Max Climb',
                            'Parked',
                            'Average Climb Time',
                            'Max Climb Time'
                        ];

                        const res = await getMatchScouting(
                            teamNumber,
                            eventKey
                        );
                        if (res.isErr()) throw res.error;
                        const matches = res.value;

                        const tbaMatches = await TBA.get<TBAMatch[]>(
                            '/event/' + eventKey + '/matches'
                        );

                        if (tbaMatches.isErr()) throw tbaMatches.error;
                        if (!tbaMatches.value)
                            throw new Error('No matches found');

                        const scoresRes = matches.map(m => {
                            return attempt(() => {
                                const match = tbaMatches.value?.find(
                                    match =>
                                        match.match_number === m.matchNumber &&
                                        match.comp_level === m.compLevel
                                );

                                if (!match) throw new Error('Match not found');

                                const [r1, r2, r3, b1, b2, b3] =
                                    teamsFromMatch(match);

                                let alliance: 'red' | 'blue';
                                if ([r1, r2, r3].includes(teamNumber))
                                    alliance = 'red';
                                else if ([b1, b2, b3].includes(teamNumber))
                                    alliance = 'blue';
                                else throw new Error('Team not found in match');

                                const trace = m.trace;

                                return Trace.score.parse2024(trace, alliance)
                                    .endgame;
                            });
                        });

                        const scores = scoresRes
                            .map(s => (s.isOk() ? s.value : null))
                            .filter(Boolean);

                        const climbTimes = matches
                            .map(m => Trace.yearInfo[2024].climbTimes(m.trace))
                            .flat();

                        return {
                            headers,
                            data: [
                                scores.reduce((a, b) => a + b.clb, 0) /
                                    scores.length,
                                Math.max(...scores.map(s => s.clb)),
                                scores.reduce((a, b) => a + b.park, 0) /
                                    scores.length,
                                climbTimes.reduce((a, b) => a + b, 0) /
                                    climbTimes.length,
                                Math.max(...climbTimes)
                            ]
                        };
                    });
                }
                // checks: async (teamNumber: number, eventKey: string) => {
                //     return attemptAsync(async () => {
                //         const scouting = await getMatchScouting(teamNumber, eventKey);
                //         if (scouting.isErr()) throw scouting.error;

                //         const checks = scouting.value.map(s => JSON.parse(s.checks)).flat() as string[];

                //         return {
                //             headers: [
                //                 'Checks'
                //             ],
                //             data: [
                //                 checks.join(' ')
                //             ]
                //         }
                //     });
                // }
            }
        } as const;
    }
}

if (require.main === module) {
    (async () => {
        const eventKey = process.argv[0];
        const table = await Table.build(eventKey);
        if (table.isErr()) throw table.error;
        console.log(table.value);
        process.exit(0);
    })();
}
