import { Database } from 'https://deno.land/x/sqlite3@0.9.1/mod.ts';
import { DB } from '../server/utilities/databases.ts';
import { uuid } from '../server/utilities/uuid.ts';
import { makeBackup, restore } from '../storage/db/scripts/backups.ts';
import fs from 'node:fs';
import { __root } from '../server/utilities/env.ts';
import path from 'node:path';
import { Match } from '../shared/db-types-extended.ts';
import { error, log } from '../server/utilities/terminal-logging.ts';

const parse = <T>(str: string) => {
    try {
        return JSON.parse(str) as T;
    } catch {
        return {} as T;
    }
};

const test = (): boolean => {
    const q = DB.unsafe.get('SELECT * FROM ScoutingQuestions LIMIT 1');
    return !!q;
};

let db: Database;

const transferAccounts = () => {
    type A = {
        username: string;
        key: string;
        salt: string;
        name: string;
        info: string; // json
        roles: string; // json
        email: string;
        verified: 0 | 1;
        tatorBucks: number;
        discord: string;
    };

    const q = db.prepare('SELECT * FROM Accounts');
    const accounts = q.all() as A[];
    q.finalize();

    // username, key, salt, name, info {}, roles [string, string], email, verified, tatorBucks, discord,

    return accounts
        .map((a) => {
            const roles = JSON.parse(a.roles) as string[];
            const id = uuid();

            if (!a.email) return;
            if (!a.username) return;

            DB.unsafe.run(
                `
            INSERT INTO Accounts (
                id,
                username,
                key,
                salt,
                firstName,
                lastName,
                email,
                verified,
                created
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `,
                ...[
                    uuid(),
                    a.username,
                    a.key,
                    a.salt,
                    a.name.split(' ')[0] ?? '',
                    a.name.split(' ')[1] ?? '',
                    a.email,
                    !!a.verified,
                    Date.now(),
                ],
            );

            return {
                roles,
                id,
            };
        })
        .filter(Boolean) as {
            roles: string[];
            id: string;
        }[];
};
type Match2022 = {
    eventKey: string;
    matchNumber: number;
    compLevel: string;
    teamNumber: number;
    trace: string; // json array
    scout: string;
    auto: string; // json
    teleop: string; // json
    endgame: string; // json
    overall: string; // json
    group: number;
    time: number;
    end: null;
    orientation: null;
    preScoutingKey: string | null;
    orientedTrace: string | null; // ignore
};

const transferMatch2022Scouting = (matches: Match2022[]) => {
    type Section = Partial<{
        ballsHigh: number;
        ballsLow: number;
        leaveTarmac: boolean;
        totalCargoAuto: number;
        ballsLowCopy: number;
        totalCargoTele: number;

        // endgame
        totalTime: number;
        timeStart: number;
        climb15: boolean;
        climb10: boolean;
        climb6: boolean;
        climb4: boolean;
        noClimb: boolean;
        fell: boolean;
        climbLevel: number;
        stage1Time: number;
        stage2Time: number;
        stage3Time: number;
        misses: number;
        bouncedOut: number;
        problemsDriving: boolean;
        dead: boolean;
        tippy: boolean;
        easilyDefended: boolean;
        foulsPinningOrHerdingCargo: boolean;
        shootsCargoOverHub: boolean;
        comments: string;
        pushesBots: boolean;
    }>;

    for (const match of matches) {
        const foundMatch = DB.unsafe.get(
            `
            SELECT * FROM Matches WHERE eventKey = ? AND matchNumber = ? AND compLevel = ?
        `,
            ...[match.eventKey, match.matchNumber, match.compLevel],
        ) as Match | undefined;

        if (!foundMatch) continue;

        const id = uuid();

        DB.unsafe.run(
            `
            INSERT INTO MatchScouting (
                id,
                matchId,
                team,
                scoutId,
                scoutGroup,
                time,
                prescouting,
                trace
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?
            )
        `,
            ...[
                id,
                foundMatch?.id ?? null,
                match.teamNumber,
                match.scout,
                match.group,
                (match.time ?? 0).toString(),
                match.preScoutingKey,
                match.trace,
            ],
        );

        const sections = {
            auto: parse<Section>(match.auto),
            tele: parse<Section>(match.teleop),
            endgame: parse<Section>(match.endgame),
            overall: parse<Section>(match.overall),
        };

        for (const [section, data] of Object.entries(sections)) {
            DB.unsafe.run(
                `
                INSERT INTO MatchScouting2022 (
                    id,
                    matchScoutingId,
                    section,
                    ballsHigh,

                    ballsLow,
                    missed,
                    leaveTarmac,
                    climb4,

                    climb6,
                    climb10,
                    climb15,
                    totalTime,

                    timeStart,
                    noClimb,
                    fell,
                    climbLevel,

                    stage1Time,
                    stage2Time,
                    stage3Time,


                    misses,
                    
                    bouncedOut,
                    problemsDriving,
                    dead,
                    tippy,

                    easilyDefended,
                    foulsPinningOrHerdingCargo,
                    shootsCargoOverHub,

                    pushesBots
                ) VALUES (
                    ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?, ?
                )
            `,
                ...[
                    uuid() as string,
                    id,
                    section as 'auto' | 'tele' | 'endgame',
                    data.ballsHigh ?? 0,
                    data.ballsLow ?? 0,
                    data.ballsLowCopy ?? 0,
                    data.leaveTarmac ?? 0,
                    data.climb4 ?? 0,
                    data.climb6 ?? 0,
                    data.climb10 ?? 0,
                    data.climb15 ?? 0,
                    data.totalTime ?? 0,
                    data.timeStart ?? 0,
                    data.noClimb ?? 0,
                    data.fell ?? 0,
                    data.climbLevel ?? 0,
                    data.stage1Time ?? 0,
                    data.stage2Time ?? 0,
                    data.stage3Time ?? 0,
                    data.misses ?? 0,
                    data.bouncedOut ?? 0,
                    data.problemsDriving ?? 0,
                    data.dead ?? 0,
                    data.tippy ?? 0,
                    data.easilyDefended ?? 0,
                    data.foulsPinningOrHerdingCargo ?? 0,
                    data.shootsCargoOverHub ?? 0,
                    data.pushesBots ?? 0,
                ],
            );

            const { comments } = data;

            const query = `
                INSERT INTO TeamComments (
                    id,
                    matchScoutingId,
                    accountId,
                    team,
                    comment,
                    time,
                    type
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?
                )
            `;

            DB.unsafe.run(
                query,
                ...[
                    uuid(),
                    id,
                    match.scout,
                    match.teamNumber,
                    comments ?? '',
                    (match.time ?? 0).toString(),
                    'match',
                ],
            );
        }
    }
};
type Match2023 = {
    eventKey: string;
    matchNumber: number;
    compLevel: string;
    teamNumber: number;
    trace: string; // json array
    scout: string;
    auto: string; // json
    teleop: string; // json
    endgame: string; // json
    overall: string; // json
    group: number;
    time: number;
    end: null;
    orientation: null;
    preScoutingKey: string | null;
    orientedTrace: string | null; // ignore
};

const transferMatch2023Scouting = (matches: Match2023[]) => {
    type Section = Partial<{
        autoMobility: boolean;
        grid: string;
        'Total Distance (Ft)': number;
        'Velocity (ft/s)': number;
        parked: boolean;
        // grid: string;
        comments: string;
        defensiveComments: string;
        // 'Total Distance (Ft)': number;
        // 'Velocity (ft/s)': number;
        'Velocity (excluding auto)': number;
    }>;

    for (const match of matches) {
        const foundMatch = DB.unsafe.get(
            `
            SELECT * FROM Matches WHERE eventKey = ? AND matchNumber = ? AND compLevel = ?
        `,
            ...[match.eventKey, match.matchNumber, match.compLevel],
        ) as Match | undefined;

        if (!foundMatch) continue;

        const id = uuid();

        DB.unsafe.run(
            `
            INSERT INTO MatchScouting (
                id,
                matchId,
                team,
                scoutId,
                scoutGroup,
                time,
                prescouting,
                trace
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?
            )
        `,
            ...[
                id,
                foundMatch?.id ?? null,
                match.teamNumber,
                match.scout,
                match.group,
                (match.time ?? 0).toString(),
                match.preScoutingKey,
                match.trace,
            ],
        );

        const sections = {
            auto: parse<Section>(match.auto),
            tele: parse<Section>(match.teleop),
            endgame: parse<Section>(match.endgame),
            overall: parse<Section>(match.overall),
        };

        for (const [section, data] of Object.entries(sections)) {
            DB.unsafe.run(
                `
                INSERT INTO MatchScouting2023 (
                    id,
                    matchScoutingId,
                    section,
                    autoMobility,
                    grid,
                    totalDistance,
                    velocity,
                    parked
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?, ?
                )
            `,
                ...[
                    uuid() as string,
                    id,
                    section as 'auto' | 'tele' | 'endgame' | 'overall',
                    data.autoMobility ?? 0,
                    data.grid ?? '',
                    data['Total Distance (Ft)'] ?? 0,
                    data['Velocity (ft/s)'] ?? 0,
                    data.parked ?? 0,
                ],
            );

            const { comments, defensiveComments } = data;

            const query = `
                INSERT INTO TeamComments (
                    id,
                    matchScoutingId,
                    accountId,
                    team,
                    comment,
                    time,
                    type
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?
                )
            `;

            DB.unsafe.run(
                query,
                ...[
                    uuid(),
                    id,
                    match.scout,
                    match.teamNumber,
                    comments ?? '',
                    (match.time ?? 0).toString(),
                    'match',
                ],
            );

            DB.unsafe.run(
                query,
                ...[
                    uuid(),
                    id,
                    match.scout,
                    match.teamNumber,
                    defensiveComments ?? '',
                    (match.time ?? 0).toString(),
                    'defensive',
                ],
            );
        }
    }
};

const transferMatchScouting = () => {
    const q = db.prepare('SELECT * FROM MatchScouting');
    const matches = q.all() as (Match2022 | Match2023)[];

    transferMatch2022Scouting(
        matches.filter((m) => m?.eventKey?.startsWith('2022')) as Match2022[],
    );
    transferMatch2023Scouting(
        matches.filter((m) => m?.eventKey?.startsWith('2023')) as Match2023[],
    );
};

const createScoutingQuestionGroups = () => {
    const sections = [
        {
            name: 'pit',
            multiple: false,
        },
        {
            name: 'pre',
            multiple: false,
        },
        {
            name: 'electrical',
            multiple: false,
        },
        {
            name: 'mechanical',
            multiple: false,
        },
        {
            name: 'elimination',
            multiple: false,
        },
    ];

    for (const s of sections) {
        DB.unsafe.run(
            `
            INSERT INTO ScoutingQuestionSections (
                name,
                multiple
            ) VALUES (
                ?, ?
            )
        `,
            s.name,
            s.multiple,
        );
    }
};

const populateQuestions = () => {
    type Event = {
        eventKey: string;
        picklist?: string;
        pitScouting?: string;
        preScouting?: string;
        eventProperties?: string;
        electricalScouting?: string;
        eliminationMatchScouting?: string;
        mechanicalScouting?: string;
    };

    type Option = {
        text: string;
        order: number;
    };

    type Options = {
        radio: Option[];
        checkbox: Option[];
        select: Option[];
    };

    type Question = {
        question: string;
        key: string;
        description: string;
        type: 'text' | 'number' | 'checkbox' | 'select' | 'radio';
        small: string;
        id: string;
        options: Options;
    };

    type Section = {
        title: string;
        questions: Question[];
    };

    type QuestionContainer = Section[];

    const q = db.prepare('SELECT * FROM Events');
    const events = q.all() as Event[];

    const saveGroup = (
        name: string,
        group: QuestionContainer,
        event: Event,
    ) => {
        for (const section of group) {
            const id = uuid();
            DB.unsafe.run(
                `
                INSERT INTO ScoutingQuestionGroups (
                    id,
                    name,
                    section,
                    eventKey
                ) VALUES (
                    ?, ?, ?, ?
                )
            `,
                ...[id, section.title, name, event.eventKey],
            );

            for (const question of section.questions) {
                if (!question.id) question.id = uuid();
                if (!question.options) {
                    question.options = {
                        checkbox: [],
                        radio: [],
                        select: [],
                    };
                }
                if (!question.small) question.small = '';
                if (!question.description) question.description = '';
                if (!question.type) question.type = 'text';
                if (!question.key) {
                    question.key =
                        question.question.toLowerCase().replace(/ /g, '-') +
                        '-' +
                        uuid().split('-')[0];
                }

                DB.unsafe.run(
                    `
                    INSERT INTO ScoutingQuestions (
                        id,
                        question,
                        key,
                        description,
                        type,
                        groupId
                    ) VALUES (
                        ?, ?, ?, ?, ?, ?
                    )
                `,
                    ...[
                        question.id,
                        question.question,
                        question.key,
                        question.description,
                        question.type,
                        id,
                    ],
                );

                const saveOptions = (type: keyof Options) => {
                    for (const option of question.options[type]) {
                        DB.unsafe.run(
                            `
                            INSERT INTO ScoutingQuestionOptions (
                                id,
                                questionId,
                                'option',
                                'order'
                            ) VALUES (
                                ?, ?, ?, ?
                            )
                        `,
                            ...[uuid(), question.id, option.text, option.order],
                        );
                    }
                };

                saveOptions('checkbox');
                saveOptions('radio');
                saveOptions('select');
            }
        }
    };

    for (const e of events) {
        const pit = e.pitScouting
            ? parse<QuestionContainer>(e.pitScouting)
            : ([] as QuestionContainer);
        const pre = e.preScouting
            ? parse<QuestionContainer>(e.preScouting)
            : ([] as QuestionContainer);
        const electrical = e.electricalScouting
            ? parse<QuestionContainer>(e.electricalScouting)
            : ([] as QuestionContainer);
        const mechanical = e.mechanicalScouting
            ? parse<QuestionContainer>(e.mechanicalScouting)
            : ([] as QuestionContainer);
        const elimination = e.eliminationMatchScouting
            ? parse<QuestionContainer>(e.eliminationMatchScouting)
            : ([] as QuestionContainer);

        saveGroup('pit', pit, e);
        saveGroup('pre', pre, e);
        saveGroup('electrical', electrical, e);
        saveGroup('mechanical', mechanical, e);
        saveGroup('elimination', elimination, e);
    }
};

const transferTeams = () => {
    const q = db.prepare('SELECT * FROM Teams');

    const teams = q.all() as {
        number: number;
        eventKey: string;
        pitScouting?: string;
        preScouting?: string; // json array
        electricalScouting?: string;
        mechanicalScouting?: string;
        picture?: string;
        dashboardComments?: string;
        active: boolean;
    }[];

    for (const t of teams) {
        DB.unsafe.run(
            `
            INSERT INTO Teams (
                number,
                eventKey
            ) VALUES (
                ?, ?
            )
        `,
            t.number,
            t.eventKey,
        );

        DB.unsafe.run(
            `
            INSERT INTO TeamPictures (
                teamNumber,
                eventKey,
                picture,
                time
            ) VALUES (
                ?, ?, ?, ?
            )
        `,
            ...[t.number, t.eventKey, t.picture ?? '', Date.now().toString()],
        );

        const questions = DB.unsafe.all(
            `
            SELECT 
                ScoutingQuestions.id,
                ScoutingQuestions.key
            FROM ScoutingQuestions
            INNER JOIN ScoutingQuestionGroups ON ScoutingQuestionGroups.id = ScoutingQuestions.groupId
            WHERE ScoutingQuestionGroups.eventKey = ?
        `,
            t.eventKey,
        ) as { id: string; key: string }[];

        const pit = t.pitScouting ? parse<unknown>(t.pitScouting) : {};
        const pre = t.preScouting ? parse<unknown[]>(t.preScouting) : [];
        const electrical = t.electricalScouting
            ? parse<unknown>(t.electricalScouting)
            : {};
        const mechanical = t.mechanicalScouting
            ? parse<unknown>(t.mechanicalScouting)
            : {};

        const save = (data: { [key: string]: string }) => {
            for (const [key, value] of Object.entries(data)) {
                const q = questions.find((q) => q.key === key);
                if (!q) continue;

                if (typeof value === 'object') {
                    save(value);
                    continue;
                }

                DB.unsafe.run(
                    `
                    INSERT INTO ScoutingAnswers (
                        id,
                        teamNumber,
                        questionId,
                        answer
                    ) VALUES (
                        ?, ?, ?, ?
                    )
                `,
                    ...[uuid(), t.number, q.id, value],
                );
            }
        };

        save(pit as { [key: string]: string });
        save(electrical as { [key: string]: string });
        save(mechanical as { [key: string]: string });

        pre.forEach((p) => save(p as { [key: string]: string }));
    }
};

const transferAccountsAndRoles = () => {
    type Info = Partial<{
        viewData: boolean;
        editDatabase: boolean;
        editPermissions: boolean;
        editRoles: boolean;
        editUsers: boolean;
        viewLogs: boolean;
        editScoutingQuestions: boolean;
        settings: boolean;
        logs: boolean;
    }>;
    type Role = {
        name: string;
        info: string; // json -> Info
        description: string;
        rank: number;
    };

    const q = db.prepare('SELECT * FROM Roles');
    const roles = q.all() as Role[];

    const newRoles = roles.map((r) => {
        const info = parse<Info>(r.info);

        const id = uuid();

        DB.unsafe.run(
            `
            INSERT INTO Roles (
                id,
                name,
                description,
                rank
            ) VALUES (
                ?, ?, ?, ?
            );
        `,
            ...[id, r.name, r.description, r.rank],
        );

        for (const [key] of Object.entries(info)) {
            DB.unsafe.run(
                `
                INSERT INTO Permissions (
                    roleId,
                    permission
                ) VALUES (
                    ?, ?
                )
            `,
                ...[id, key],
            );
        }

        return {
            id,
            name: r.name,
        };
    });

    const accounts = transferAccounts();

    for (const a of accounts) {
        const accountRoles = a.roles
            .map((r) => {
                const foundRole = newRoles.find((nr) => nr.name === r);

                if (!foundRole) {
                    console.log(`Role ${r} not found!`);
                    return;
                }

                return foundRole.id;
            })
            .filter(Boolean) as string[];

        for (const roleId of accountRoles) {
            DB.unsafe.run(
                `
                INSERT INTO AccountRoles (
                    accountId,
                    roleId
                ) VALUES (
                    ?, ?
                )
            `,
                ...[a.id, roleId],
            );
        }
    }
};

const run = (fn: () => void) => {
    console.log(`Running ${fn.name}`);
    const start = Date.now();
    try {
        fn();
    } catch (e) {
        log('Error running database transfer, restoring backup');
        error(e);

        restore(DB.db);
        Deno.exit(1);
    }
    const end = Date.now();
    console.log(`${fn.name} | ${end - start}ms`);
};

export const transfer = () => {
    if (DB.version.join('.') !== '1.0.4') {
        throw new Error(
            'The database transfer script is only compatible with version 1.0.4',
        );
    }

    if (test()) {
        log(
            'The database has already been transferred! Nothing has changed :)',
        );
        return;
    }

    if (!fs.existsSync(path.resolve(__root, './scripts/old.db'))) {
        console.log(
            'No old database found. Please place the old database in ./scripts/old.db',
        );
        Deno.exit(0);
    }

    db = new Database('./scripts/old.db');

    makeBackup(DB.db);
    run(transferMatchScouting);
    run(createScoutingQuestionGroups);
    run(populateQuestions);
    run(transferAccountsAndRoles);
    run(transferTeams);
};

if (Deno.args.includes('--transfer')) transfer();
