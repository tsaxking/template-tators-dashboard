import { TBA } from '../server/utilities/tba/tba.ts';
import {
    TBATeam,
    TBATeamEventStatus,
} from '../shared/submodules/tatorscout-calculations/tba.ts';
import { attemptAsync, Result } from '../shared/check.ts';
import { DB } from '../server/utilities/databases.ts';
import {
    Trace,
    TraceArray,
} from '../shared/submodules/tatorscout-calculations/trace.ts';
import { capitalize, fromCamelCase } from '../shared/text.ts';

type T = string | number | boolean | undefined;

type RowSection = {
    data: T[];
    headers: string[];
};

export class Table {
    public static async build(
        eventKey: string,
    ): Promise<Result<[string[], ...T[][]]>> {
        return attemptAsync(async () => {
            const teams = await TBA.get<TBATeam[]>(`/event/${eventKey}/teams`);

            if (teams.isErr()) throw teams.error;
            if (!teams.value) throw new Error('No teams found');

            const data = await Promise.all(
                teams.value
                .sort((a, b) => a.team_number - b.team_number)
                .map((t) =>
                    Table.buildTeamByYear(t.team_number, eventKey)
                ),
            );

            const headers = data[0].headers;
            const rows = data.map((d) => d.data);

            return [headers, ...rows];
        });
    }

    public static async buildTeamByYear(
        teamNumber: number,
        eventKey: string,
    ): Promise<RowSection> {
        const year = parseInt(eventKey.slice(0, 4));
        if (!year) throw new Error('Invalid event key');

        const pull = async (
            fn: (t: number, k: string) => Promise<Result<RowSection>>,
        ): Promise<RowSection & { title: string }> => {
            const data = await fn(teamNumber, eventKey);
            if (data.isErr()) {
                console.log(data.error);
                return {
                    // this will not populate the table with the error message, but it will log it.
                    title: 'Error',
                    headers: [],
                    data: [],
                };
            }

            if (data.value.data.length !== data.value.headers.length) {
                console.error('Data and headers do not match');
                return {
                    title: 'Error',
                    headers: [],
                    data: [],
                };
            }

            return {
                title: capitalize(fromCamelCase(fn.name)),
                ...data.value,
            };
        };

        if (!Table.yearInfo[year]) throw new Error('Year not supported');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await Promise.all(
            (
                Object.values(Table.yearInfo[year]) as ((
                    t: number,
                    k: string,
                ) => Promise<Result<RowSection>>)[]
            ).map(pull),
        );

        return {
            headers: data.map((d) => d.headers).flat(),
            data: data.map((d) => d.data).flat(),
        };
    }

    public static get yearInfo() {
        return {
            2024: {
                teamGeneral: async (
                    teamNumber: number,
                    eventKey: string,
                ): Promise<Result<RowSection>> => {
                    return attemptAsync(async () => {
                        const headers: string[] = [
                            'Team Number',
                            'Team Name',
                            'Rank',
                            'Rank Points',
                        ];

                        const [team, event] = await Promise.all([
                            TBA.get<TBATeam>('/team/frc' + teamNumber),
                            TBA.get<TBATeamEventStatus>(
                                '/team/frc' +
                                    teamNumber +
                                    '/event/' +
                                    eventKey +
                                    '/status',
                            ),
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
                                0,
                            ],
                        };
                    });
                },
                robotGeneral: async (
                    teamNumber: number,
                    eventKey: string,
                ): Promise<Result<RowSection>> => {
                    return attemptAsync(async () => {
                        const headers: string[] = [
                            'Average Velocity',
                            // 'Max Velocity',
                            'Weight',
                            'Height',
                            'Width',
                            'Length',
                        ];

                        const res = await DB.all('match-scouting/from-team', {
                            eventKey,
                            team: teamNumber,
                        });

                        if (res.isErr()) throw res.error;

                        const matches = res.value.map((m) => {
                            return {
                                ...m,
                                trace: JSON.parse(m.trace) as TraceArray,
                            };
                        });

                        const velocities = matches
                            .map((m) => Trace.velocity.map(m.trace))
                            .flat();
                        // const max = Math.max(...velocities);
                        const avg = velocities.reduce((a, b) => a + b, 0) /
                            velocities.length;
                        // const hist = matches.map(m => Trace.velocity.histogram(m.trace));

                        const pitScouting = await DB.all(
                            'scouting-questions/answer-from-team',
                            {
                                teamNumber,
                                eventKey,
                            },
                        );

                        if (pitScouting.isErr()) throw pitScouting.error;

                        const weight = pitScouting.value.find((p) =>
                            /weight/i.test(p.question)
                        )?.answer || '[]';
                        const height = pitScouting.value.find((p) =>
                            /height/i.test(p.question)
                        )?.answer || '[]';
                        const width = pitScouting.value.find((p) =>
                            /width/i.test(p.question)
                        )?.answer || '[]';
                        const length = pitScouting.value.find((p) =>
                            /length/i.test(p.question)
                        )?.answer || '[]';

                        return {
                            headers,
                            data: [
                                avg,
                                // max,
                                JSON.parse(weight).join(','),
                                JSON.parse(height).join(','),
                                JSON.parse(width).join(','),
                                JSON.parse(length).join(','),
                            ],
                        };
                    });
                },
                matchGeneral: async (
                    teamNumber: number,
                    eventKey: string,
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
                        ];

                        const res = await DB.all('match-scouting/from-team', {
                            eventKey,
                            team: teamNumber,
                        });

                        if (res.isErr()) throw res.error;

                        const matches = res.value.map((m) => {
                            return {
                                ...m,
                                trace: JSON.parse(m.trace) as TraceArray,
                            };
                        });

                        const scores = matches.map((m) =>
                            Trace.score.parse2024(m.trace)
                        );

                        return {
                            headers,
                            data: [
                                scores.reduce((a, b) => a + b.total, 0) /
                                scores.length,
                                Math.max(...scores.map((s) => s.total)),
                                scores.reduce((a, b) => a + b.auto.total, 0) /
                                scores.length,
                                Math.max(...scores.map((s) => s.auto.total)),
                                scores.reduce((a, b) => a + b.teleop.total, 0) /
                                scores.length,
                                Math.max(...scores.map((s) => s.teleop.total)),
                                scores.reduce(
                                    (a, b) => a + b.endgame.total,
                                    0,
                                ) / scores.length,
                                Math.max(...scores.map((s) => s.endgame.total)),
                            ],
                        };
                    });
                },
                autoBreakdown: async (
                    teamNumber: number,
                    eventKey: string,
                ): Promise<Result<RowSection>> => {
                    return attemptAsync(async () => {
                        const headers: string[] = [
                            'Average Speaker',
                            'Max Speaker',
                            'Average Amp',
                            'Max Amp',
                            'Average Mobility',
                        ];

                        const res = await DB.all('match-scouting/from-team', {
                            eventKey,
                            team: teamNumber,
                        });

                        if (res.isErr()) throw res.error;

                        const matches = res.value.map((m) => {
                            return {
                                ...m,
                                trace: JSON.parse(m.trace) as TraceArray,
                            };
                        });

                        const scores = matches.map(
                            (m) => Trace.score.parse2024(m.trace).auto,
                        );

                        return {
                            headers,
                            data: [
                                scores.reduce((a, b) => a + b.spk, 0) /
                                scores.length,
                                Math.max(...scores.map((s) => s.spk)),
                                scores.reduce((a, b) => a + b.amp, 0) /
                                scores.length,
                                Math.max(...scores.map((s) => s.amp)),
                                scores.reduce((a, b) => a + b.mobility, 0) /
                                scores.length,
                            ],
                        };
                    });
                },
                teleBreakdown: async (
                    teamNumber: number,
                    eventKey: string,
                ): Promise<Result<RowSection>> => {
                    return attemptAsync(async () => {
                        const headers: string[] = [
                            'Average Speaker',
                            'Max Speaker',
                            'Average Amp',
                            'Max Amp',
                            'Average Trap',
                        ];

                        const res = await DB.all('match-scouting/from-team', {
                            eventKey,
                            team: teamNumber,
                        });

                        if (res.isErr()) throw res.error;

                        const matches = res.value.map((m) => {
                            return {
                                ...m,
                                trace: JSON.parse(m.trace) as TraceArray,
                            };
                        });

                        const scores = matches.map(
                            (m) => Trace.score.parse2024(m.trace).teleop,
                        );

                        return {
                            headers,
                            data: [
                                scores.reduce((a, b) => a + b.spk, 0) /
                                scores.length,
                                Math.max(...scores.map((s) => s.spk)),
                                scores.reduce((a, b) => a + b.amp, 0) /
                                scores.length,
                                Math.max(...scores.map((s) => s.amp)),
                                scores.reduce((a, b) => a + b.trp, 0) /
                                scores.length,
                            ],
                        };
                    });
                },
                endgameBreakdown: async (
                    teamNumber: number,
                    eventKey: string,
                ): Promise<Result<RowSection>> => {
                    return attemptAsync(async () => {
                        const headers: string[] = [
                            'Average Climb',
                            'Max Climb',
                            'Parked',
                            'Average Climb Time',
                            'Max Climb Time',
                        ];

                        const res = await DB.all('match-scouting/from-team', {
                            eventKey,
                            team: teamNumber,
                        });

                        if (res.isErr()) throw res.error;

                        const matches = res.value.map((m) => {
                            return {
                                ...m,
                                trace: m.trace ? JSON.parse(m.trace) as TraceArray : [],
                            };
                        });

                        const scores = matches.map(
                            (m) => Trace.score.parse2024(m.trace).endgame,
                        );

                        const climbTimes = matches
                            .map((m) =>
                                Trace.yearInfo[2024].climbTimes(m.trace)
                            )
                            .flat();

                        return {
                            headers,
                            data: [
                                scores.reduce((a, b) => a + b.clb, 0) /
                                scores.length,
                                Math.max(...scores.map((s) => s.clb)),
                                scores.reduce((a, b) => a + b.park, 0) /
                                scores.length,
                                climbTimes.reduce((a, b) => a + b, 0) /
                                climbTimes.length,
                                Math.max(...climbTimes),
                            ],
                        };
                    });
                },
            },
        } as const;
    }
}

if (import.meta.main) {
    const eventKey = Deno.args[0];
    const table = await Table.build(eventKey);
    if (table.isErr()) throw table.error;
    console.log(table.value);
    Deno.exit();
}
