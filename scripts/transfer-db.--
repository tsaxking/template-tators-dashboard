import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { DB } from '../server/utilities/databases';
import { uuid } from '../server/utilities/uuid';
import fs from 'node:fs';
import { __root } from '../server/utilities/env';
import path from 'node:path';
import { Match } from '../shared/db-types-extended';
import { error, log } from '../server/utilities/terminal-logging';
import { attemptAsync, Result } from '../shared/check';

type Q = {
    query: string;
    params?: {
        [key: string]: string | number | null;
    };
    type: 'get' | 'run' | 'all';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolve: (value: any) => void;
    reject: (error: Error) => void;
};

class D {
    public readonly path: string;
    public readonly queue: Q[] = [];
    public queueRunning = false;
    public sqlite?: sqlite3.Database;

    constructor(filepath: string) {
        this.path = filepath;
    }

    async init() {
        this.sqlite = (await open({
            filename: this.path,
            driver: sqlite3.Database
        }).catch(e => console.error(e))) as unknown as sqlite3.Database;
    }

    private async runQueue(q: Q) {
        this.queue.push(q);
        if (this.queueRunning) return;
        this.queueRunning = true;

        while (this.queue.length > 0) {
            const query = this.queue.shift();
            if (!query) break; // should never happen

            await new Promise<void>((res, rej) => {
                if (!this.sqlite)
                    return rej(new Error('Database not initialized'));

                this.sqlite[query.type](
                    query.query,
                    query.params,
                    (err: Error, rows: unknown) => {
                        if (err) {
                            query.reject(err);
                        } else {
                            query.resolve(rows);
                        }
                        res();
                    }
                );
            });
        }
    }

    async get(
        query: string,
        params?: { [key: string]: string | number | null }
    ) {
        return new Promise((resolve, reject) => {
            this.runQueue({
                query,
                params,
                type: 'get',
                resolve,
                reject
            });
        });
    }

    async run(
        query: string,
        params?: { [key: string]: string | number | null }
    ) {
        return new Promise((resolve, reject) => {
            this.runQueue({
                query,
                params,
                type: 'run',
                resolve,
                reject
            });
        });
    }

    async all(
        query: string,
        params?: { [key: string]: string | number | null }
    ) {
        return new Promise((resolve, reject) => {
            this.runQueue({
                query,
                params,
                type: 'all',
                resolve,
                reject
            });
        });
    }
}

const parse = <T>(str: string) => {
    try {
        return JSON.parse(str) as T;
    } catch {
        return {} as T;
    }
};

const test = async (): Promise<boolean> => {
    const q = await DB.unsafe.get('SELECT * FROM dbTransfer');
    if (q.isOk()) {
        console.log(q.value);
        return !!q.value;
    } else {
        throw new Error(
            "The database hasn't been updated to include the new tables!"
        );
    }
};

const transferAccounts = async (db: D) => {
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

    const q = (await db.all('SELECT * FROM Accounts')) as A[];
    // const accounts = q.all() as A[];
    // q.finalize();

    // username, key, salt, name, info {}, roles [string, string], email, verified, tatorBucks, discord,

    return q
        .map(a => {
            const roles = JSON.parse(a.roles) as string[];
            const id = uuid();

            if (!a.email) return;
            if (!a.username) return;

            DB.run('account/new', {
                id,
                username: a.username,
                key: a.key,
                salt: a.salt,
                firstName: a.name,
                lastName: '',
                email: a.email,
                verified: 0,
                verification: '',
                created: Date.now(),
                phoneNumber: ''
            }).then(r =>
                r.isOk()
                    ? console.log(`Account ${a.username} transferred`)
                    : console.log('Error transferring account', r.error)
            );

            return {
                roles,
                id
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

const transferMatch2022Scouting = async (matches: Match2022[]) => {
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

    return Promise.all(
        matches.map(async match => {
            const foundMatch = await DB.unsafe.get<Match>(
                `
            SELECT * FROM Matches 
            WHERE eventKey = :eventKey AND matchNumber = :matchNumber AND compLevel = :compLevel
        `,
                {
                    eventKey: match.eventKey,
                    matchNumber: match.matchNumber,
                    compLevel: match.compLevel
                }
            );

            if (foundMatch.isErr() || !foundMatch.value) return;

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
                    foundMatch.value?.id ?? null,
                    match.teamNumber,
                    match.scout,
                    match.group,
                    (match.time ?? 0).toString(),
                    match.preScoutingKey,
                    match.trace
                ]
            );

            const sections = {
                auto: parse<Section>(match.auto),
                tele: parse<Section>(match.teleop),
                endgame: parse<Section>(match.endgame),
                overall: parse<Section>(match.overall)
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
                        data.pushesBots ?? 0
                    ]
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
                        'match'
                    ]
                );
            }
        })
    );
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

const transferMatch2023Scouting = async (matches: Match2023[]) => {
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

    return Promise.all(
        matches.map(async match => {
            const foundMatch = await DB.unsafe.get<Match>(
                `
            SELECT * FROM Matches WHERE eventKey = ? AND matchNumber = ? AND compLevel = ?
        `,
                ...[match.eventKey, match.matchNumber, match.compLevel]
            );

            if (foundMatch.isErr() || !foundMatch.value) return;

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
                    foundMatch.value?.id ?? null,
                    match.teamNumber,
                    match.scout,
                    match.group,
                    (match.time ?? 0).toString(),
                    match.preScoutingKey,
                    match.trace
                ]
            );

            const sections = {
                auto: parse<Section>(match.auto),
                tele: parse<Section>(match.teleop),
                endgame: parse<Section>(match.endgame),
                overall: parse<Section>(match.overall)
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
                        data.parked ?? 0
                    ]
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
                        'match'
                    ]
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
                        'defensive'
                    ]
                );
            }
        })
    );
};

const transferMatchScouting = async (db: D) => {
    const matches = (await db.all('SELECT * FROM MatchScouting')) as (
        | Match2022
        | Match2023
    )[];
    // const matches = q.all();

    transferMatch2022Scouting(
        matches.filter(m => m?.eventKey?.startsWith('2022')) as Match2022[]
    );
    transferMatch2023Scouting(
        matches.filter(m => m?.eventKey?.startsWith('2023')) as Match2023[]
    );
};

const createScoutingQuestionGroups = (db: D) => {
    const sections = [
        {
            name: 'pit',
            multiple: false
        },
        {
            name: 'pre',
            multiple: false
        },
        {
            name: 'electrical',
            multiple: false
        },
        {
            name: 'mechanical',
            multiple: false
        },
        {
            name: 'elimination',
            multiple: false
        }
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
            s.multiple
        );
    }
};

const populateQuestions = async (db: D) => {
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

    const events = (await db.all('SELECT * FROM Events')) as Event[];

    const saveGroup = (
        name: string,
        group: QuestionContainer,
        event: Event
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
                ...[id, section.title, name, event.eventKey]
            );

            for (const question of section.questions) {
                if (!question.id) question.id = uuid();
                if (!question.options) {
                    question.options = {
                        checkbox: [],
                        radio: [],
                        select: []
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
                        id
                    ]
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
                            ...[uuid(), question.id, option.text, option.order]
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

const transferTeams = async (db: D) => {
    // const q = db.prepare('SELECT * FROM Teams');
    const teams = (await db.all('SELECT * FROM Teams')) as {
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

    return Promise.all(
        teams.map(async t => {
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
                t.eventKey
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
                ...[
                    t.number,
                    t.eventKey,
                    t.picture ?? '',
                    Date.now().toString()
                ]
            );

            const questions = await DB.unsafe.all<{ id: string; key: string }>(
                `
            SELECT 
                ScoutingQuestions.id,
                ScoutingQuestions.key
            FROM ScoutingQuestions
            INNER JOIN ScoutingQuestionGroups ON ScoutingQuestionGroups.id = ScoutingQuestions.groupId
            WHERE ScoutingQuestionGroups.eventKey = ?
        `,
                t.eventKey
            );

            if (questions.isErr()) {
                console.log(questions.error);
                return;
            }

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
                    const q = questions.value.find(q => q.key === key);
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
                        ...[uuid(), t.number, q.id, value]
                    );
                }
            };

            save(pit as { [key: string]: string });
            save(electrical as { [key: string]: string });
            save(mechanical as { [key: string]: string });

            pre.forEach(p => save(p as { [key: string]: string }));
        })
    );
};

const transferAccountsAndRoles = async (db: D) => {
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

    const roles = (await db.all('SELECT * FROM Roles')) as Role[];

    const newRoles = roles.map(r => {
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
            ...[id, r.name, r.description, r.rank]
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
                ...[id, key]
            );
        }

        return {
            id,
            name: r.name
        };
    });

    const accounts = await transferAccounts(db);

    for (const a of accounts) {
        const accountRoles = a.roles
            .map(r => {
                const foundRole = newRoles.find(nr => nr.name === r);

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
                ...[a.id, roleId]
            );
        }
    }
};

const run = async (db: D, fn: (db: D) => unknown) => {
    console.log(`Running ${fn.name}`);
    const start = Date.now();
    try {
        await fn(db);
    } catch (e) {
        log('Error running database transfer, restoring backup');
        error(e);

        process.exit(1);
    }
    const end = Date.now();
    console.log(`${fn.name} | ${end - start}ms`);
};

export const transfer = async (oldDBPath: string): Promise<Result<void>> => {
    return attemptAsync(async () => {
        if (await test()) {
            log(
                'The database has already been transferred! Nothing has changed :)'
            );
            return;
        }

        if (!fs.existsSync(path.resolve(__root, './scripts/old.db'))) {
            console.log(
                'No old database found. Please place the old database in ./scripts/old.db'
            );
            process.exit(0);
        }

        const db = new D(oldDBPath);

        await DB.makeBackup();
        await Promise.all([
            run(db, transferMatchScouting),
            run(db, createScoutingQuestionGroups),
            run(db, populateQuestions),
            run(db, transferAccountsAndRoles),
            run(db, transferTeams)
        ]);

        await DB.unsafe.run('INSERT INTO dbTransfer (date) VALUES (:date)', {
            date: Date.now()
        });
    });
};

export const runTransfer = async () => {
    const arg = process.argv.find(a => /^db=/.test(a));
    if (!arg) {
        console.log('No database path provided');
        process.exit(1);
    }

    const db = arg.split('=')[1];

    const doAccounts = process.argv.includes('accounts');
    const doRoles = process.argv.includes('roles');
    const doTeams = process.argv.includes('teams');
    const doQuestions = process.argv.includes('questions');
    const doMatchScouting = process.argv.includes('match-scouting');
    const doScoutingGroups = process.argv.includes('scouting-groups');
    const doAll = process.argv.includes('all');

    const oldDB = new D(db);

    if (doAll || doAccounts) {
        run(oldDB, transferAccounts);
    }

    if (doAll || doRoles) {
        run(oldDB, transferAccountsAndRoles);
    }

    if (doAll || doTeams) {
        run(oldDB, transferTeams);
    }

    if (doAll || doQuestions) {
        run(oldDB, createScoutingQuestionGroups);
        run(oldDB, populateQuestions);
    }

    if (doAll || doMatchScouting) {
        run(oldDB, transferMatchScouting);
    }

    if (doAll || doScoutingGroups) {
        run(oldDB, createScoutingQuestionGroups);
    }

    await DB.unsafe.run('INSERT INTO dbTransfer (date) VALUES (:date)', {
        date: Date.now()
    });
};
