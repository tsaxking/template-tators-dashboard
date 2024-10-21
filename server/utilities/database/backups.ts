import { attemptAsync } from '../../../shared/check';
import { gitBranch, gitCommit } from '../git';
import { Database, Parameter, Query, SimpleParameter } from './databases-2';
import fs from 'fs';
import path from 'path';
import { __root } from '../env';
import AdmZip from 'adm-zip';

type Metadata = {
    version: {
        major: number;
        minor: number;
        patch: number;
    };
    commit: string;
    branch: string;
    date: string;
};

export class Backup {
    public static makeBackup(database: Database) {
        return attemptAsync(async () => {
            // create a zip file of the database with csv files for each table and a json for metadata

            const [v, c, b] = await Promise.all([
                database.getVersion(),
                gitCommit(),
                gitBranch()
            ]);

            const metadata: Metadata = {
                version: v.unwrap(),
                commit: c.unwrap(),
                branch: b.unwrap(),
                date: new Date().toISOString()
            };

            const tables = (await database.getTables()).unwrap();

            await fs.promises.mkdir(
                path.resolve(__root, `./storage/db/backups/${metadata.date}`),
                { recursive: true }
            );

            await fs.promises.writeFile(
                path.resolve(
                    __root,
                    `./storage/db/backups/${metadata.date}/metadata.json`
                ),
                JSON.stringify(metadata, null, 2)
            );

            await Promise.all(
                tables.map(async t => {
                    const data = (
                        await database.unsafe.all<Record<string, unknown>>(
                            Query.build(`SELECT * FROM ${t};`)
                        )
                    ).unwrap();

                    await fs.promises.writeFile(
                        path.resolve(
                            __root,
                            `./storage/db/backups/${metadata.date}/${t}.table`
                        ),
                        JSON.stringify(data, null, 2)
                    );
                })
            );

            const zip = new AdmZip();

            zip.addLocalFolder(
                path.resolve(__root, `./storage/db/backups/${metadata.date}`)
            );

            zip.writeZip(
                path.resolve(
                    __root,
                    `./storage/db/backups/${metadata.date}.zip`
                )
            );

            await fs.promises.rm(
                path.resolve(__root, `./storage/db/backups/${metadata.date}`),
                { recursive: true }
            );

            return new Backup(
                path.resolve(__root, `./storage/db/backups/${metadata.date}`)
            );
        });
    }

    public static getBackups() {
        return attemptAsync(() => {
            return fs.promises.readdir(
                path.resolve(__root, './storage/db/backups')
            );
        });
    }

    constructor(public readonly path: string) {}

    restore(database: Database) {
        return attemptAsync(async () => {
            const zip = new AdmZip(this.path + '.zip');

            zip.extractAllTo(this.path, true);

            const version = (await database.getVersion()).unwrap();

            const meta: Metadata = JSON.parse(
                await fs.promises.readFile(
                    path.resolve(this.path, 'metadata.json'),
                    'utf-8'
                )
            );

            if (
                meta.version.major !== version.major ||
                meta.version.minor !== version.minor ||
                meta.version.patch !== version.patch
            ) {
                throw new Error('Version mismatch');
            }

            const tables = (await fs.promises.readdir(this.path)).filter(f =>
                f.endsWith('.table')
            );
            fs.promises.rm(this.path, { recursive: true });

            // TODO: use workers to parallelize this

            await Promise.all(
                tables.map(async table => {
                    const data = JSON.parse(
                        await fs.promises.readFile(
                            path.resolve(this.path, table),
                            'utf-8'
                        )
                    ) as Record<string, unknown>[];

                    const tableName = table.replace('.table', '');

                    await Promise.all(
                        data.map(async row => {
                            const keys = Object.keys(row);

                            await database.unsafe.run(
                                Query.build(
                                    `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${keys.map(k => `:${k}`).join(', ')});`,
                                    row as Parameter
                                )
                            );
                        })
                    );
                })
            );
        });
    }

    delete() {
        return attemptAsync(async () => {
            await fs.promises.rm(this.path + '.zip');
        });
    }
}
