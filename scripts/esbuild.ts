import esbuild from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import { typescript } from 'svelte-preprocess-esbuild';
// import preprocess from 'svelte-preprocess';
import fs from 'fs';
import path from 'path';
import env, { __entries, __root, __templates } from '../server/utilities/env';
import { getTemplate, saveTemplate } from '../server/utilities/files';
import { attempt, attemptAsync } from '../shared/check';
import { sassPlugin } from 'esbuild-sass-plugin';
import { Colors } from '../server/utilities/colors';

const log = (...data: unknown[]) =>
    console.log(Colors.FgMagenta, '[Bundler]', Colors.Reset, ...data);

{
    // clear the dist folder

    attempt(() => fs.rmSync(path.resolve(__root, 'dist'), { recursive: true }));
    attempt(() => fs.mkdirSync(path.resolve(__root, 'dist')));

    // remove the /public/templates/entries folder
    attempt(() =>
        fs.rmSync(path.resolve(__templates, 'entries'), { recursive: true })
    );
    attempt(() => fs.mkdirSync(path.resolve(__templates, 'entries')));
}

/**
 * Reads the directory and returns a shallow array of all the files
 * @date 3/8/2024 - 6:01:24 AM
 *
 * @async
 * @param {string} dirPath
 * @returns {Promise<string[]>}
 */
const readDir = async (dirPath: string): Promise<string[]> => {
    const saveFile = async (fullpath: string) => {
        const templateFilePath = path
            .resolve(__templates, 'entries', path.relative(__entries, fullpath))
            .replace('.ts', '.html');

        const index = await getTemplate('index', {
            script: path
                .relative(
                    templateFilePath,
                    path.resolve(
                        __root,
                        'dist',
                        path.relative(__entries, fullpath)
                    )
                )
                .replace('.ts', '.js'),
            style: path.relative(
                templateFilePath,
                path
                    .resolve(__root, 'dist', path.relative(__entries, fullpath))
                    .replace('.ts', '.css')
            ),
            title: env.TITLE || 'Untitled'
        });
        if (index.isOk()) {
            await saveTemplate(templateFilePath, index.value);
        }
    };

    if ((await fs.promises.stat(dirPath)).isFile()) {
        await saveFile(dirPath);
        return [dirPath];
    }

    // log('Reading:', dirPath);
    const entries = await fs.promises.readdir(dirPath);
    // log('Entries:', entries);

    return (
        await Promise.all(
            entries.map(async e => {
                const fullpath = path.resolve(dirPath, e);

                // if it's a file, save the template then return the path
                if ((await fs.promises.stat(fullpath)).isFile()) {
                    await saveFile(fullpath);
                    return fullpath;
                }
                // if it's a directory, recursively read it
                return readDir(fullpath);
            })
        )
    ).flat(Infinity) as string[];
};

export const bundle = (target?: string) =>
    attemptAsync(async () =>
        Promise.all([
            readDir(path.resolve(__entries, target || '')),
            esbuild.build({
                entryPoints: [
                    target // does target exist?
                        ? target.endsWith('.ts') // is target a file?
                            ? 'client/entries/' + target // target is a file
                            : 'client/entries/' + target + '/**/*.ts' // target is a directory
                        : 'client/entries/**/*.ts' // target does not exist
                ],
                bundle: true,
                minify: env.MINIFY === 'y',
                metafile: true,
                outdir: './dist',
                mainFields: ['svelte', 'browser', 'module', 'main'],
                conditions: ['svelte', 'browser'],
                plugins: [
                    sveltePlugin({
                        preprocess: [
                            typescript({
                                tsconfigRaw: {
                                    compilerOptions: {}
                                }
                            })
                        ]
                    }),
                    sassPlugin({
                        filter: /\.s[ac]ss$/
                    })
                ],
                logLevel: 'info',
                loader: {
                    '.png': 'dataurl',
                    '.woff': 'dataurl',
                    '.woff2': 'dataurl',
                    '.eot': 'dataurl',
                    '.ttf': 'dataurl',
                    '.svg': 'dataurl'
                },
                tsconfig: path.resolve(__dirname, '../tsconfig.json')
            })
        ])
    );

if (require.main === module) {
    const [, , target] = process.argv;

    log('Building client (main)');
    bundle(target).then(res => {
        if (res.isErr()) throw res.error;
        log('Built client');
        process.exit(0);
    });
}
