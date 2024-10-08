// Purpose: Unit tests for the server, used in github actions

import { __root } from '../../server/utilities/env';
import { runTask, runFile } from '../../server/utilities/run-task';
import { log } from '../../server/utilities/terminal-logging';
import { validate } from '../../server/middleware/data-type';
import { Req } from '../../server/structure/app/req';
import { Res } from '../../server/structure/app/res';
import { deepEqual } from 'assert';
import { check, isValid, parseJSON } from '../../shared/check';
import { match, matchInstance } from '../../shared/match';
import assert from 'assert';
import { getJSONSync } from '../../server/utilities/files';
import {
    TBAMatch,
    TBATeam
} from '../../shared/submodules/tatorscout-calculations/tba';
import {
    generateScoutGroups,
    testAssignments
} from '../../shared/submodules/tatorscout-calculations/scout-groups';

const assertEquals = (a: unknown, b: unknown) => {
    try {
        deepEqual(a, b);
    } catch (e) {
        console.error(e);
        throw e;
    }
};

const test = async (name: string, fn: () => void | Promise<void>) => {
    const ok = '✅';
    const fail = '❌';
    try {
        await fn();
        console.log(ok, name);
        return 0;
    } catch (e) {
        console.log(fail, name);
        console.error(e);
        return 1;
    }
};

export const runTests = async () =>
    Promise.all([
        test('Run async task functionality', async () => {
            const asyncTest = await runFile<string[]>(
                './scripts/tests/run-task-test.ts',
                'asyncFn',
                'a',
                'b',
                'c'
            );
            log('Async test result:', asyncTest);
            if (asyncTest.isErr()) throw asyncTest.error;
            else assertEquals(asyncTest.value, ['a', 'b', 'c']);
        }),

        test('Run sync task functionality', async () => {
            const syncTest = await runFile<string[]>(
                './scripts/tests/run-task-test.ts',
                'syncFn',
                'a',
                'b',
                'c'
            );
            log('Sync test result:', syncTest);
            if (syncTest.isErr()) throw syncTest.error;
            else assertEquals(syncTest.value, ['a', 'b', 'c']);
        }),

        test('Run command', async () => {
            const result = await runTask('echo', ['"test"']);
            log('Command result:', result);
            if (result.isOk()) return assertEquals(true, true);
            throw result.error;
        }),

        test('Data validation', async () => {
            const fail = () => {
                console.log('Validation should not have passed');

                assertEquals(true, false);
            };

            const pass = () => assertEquals(true, true);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const invalid: [string, any][] = [];
            const missing: string[] = [];

            JSON.parse;

            // simulate a request
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            validate<any>(
                {
                    passBoolean: 'boolean',
                    failBoolean: 'boolean',
                    passString: 'string',
                    failString: 'string',
                    passNumber: 'number',
                    failNumber: 'number',
                    passPrimitiveArray: ['string', 'number'],
                    failPrimitiveArray: ['string', 'number'],
                    passCustomArray: ['a', 'b', 'c'],
                    failCustomArray: ['a', 'b', 'c'],
                    passFunction: () => true,
                    failFunction: () => false,

                    missing: 'string'
                },
                {
                    // log: true,
                    onInvalid: (key, value) => {
                        invalid.push([key, value]);
                    },
                    onMissing: key => {
                        missing.push(key);
                    }
                }
            )(
                {
                    body: {
                        passBoolean: true,
                        failBoolean: 'true',
                        passString: 'test',
                        failString: 1,
                        passNumber: 1,
                        failNumber: '1',
                        passPrimitiveArray: 'string',
                        failPrimitiveArray: true,
                        passCustomArray: 'a',
                        failCustomArray: 'd',
                        passFunction: true,
                        failFunction: false
                    },
                    url: new URL('http://localhost:1234')
                } as unknown as Req,
                {
                    sendStatus: () => {
                        const passedInvalids = invalid.every(
                            ([key, _value]) => {
                                return [
                                    'failBoolean',
                                    'failString',
                                    'failNumber',
                                    'failPrimitiveArray',
                                    'failCustomArray',
                                    'failFunction'
                                ].includes(key);
                            }
                        );

                        const passedMissings = missing.every(
                            key => key === 'missing'
                        );

                        if (passedInvalids && passedMissings) {
                            pass();
                        } else {
                            console.log('Validation failed on the wrong keys');
                            console.log('Passed invalids:', invalid);
                            console.log('Passed missings:', missing);

                            assertEquals(true, false);
                        }
                    }
                } as unknown as Res,
                fail
            );
        }),

        test('Runtime Type Checker', async () => {
            const run = (data: unknown, type: isValid, expect: boolean) => {
                const result = check(data, type);
                if (result !== expect) {
                    console.log('Failed:', data, type, expect);
                }
                return result;
            };

            const passes = [
                run({ a: 1 }, { a: 'number' }, true),
                run({ a: '1' }, { a: 'string' }, true),
                run({ a: [1, 2, 3] }, { a: ['number'] }, true),
                run({ a: ['1', '2', '3'] }, { a: ['string'] }, true),
                run({ a: { b: 1 } }, { a: { b: 'number' } }, true),
                run({ a: { b: '1' } }, { a: { b: 'string' } }, true),
                run({ a: { b: [1, 2, 3] } }, { a: { b: ['number'] } }, true),
                run(
                    { a: { b: ['1', '2', '3'] } },
                    { a: { b: ['string'] } },
                    true
                ),
                run({ a: '1' }, { a: ['string', 'number'] }, true),
                run({ a: 1 }, { a: ['string', 'number'] }, true),

                run({ a: true, b: false }, { a: 'boolean', b: 'boolean' }, true)
            ];
            const fails = [
                run({ a: 1 }, { a: 'string' }, false),
                run({ a: '1' }, { a: 'number' }, false),
                run({ a: [1, 2, 3] }, { a: ['string'] }, false),
                run({ a: ['1', '2', '3'] }, { a: ['number'] }, false),
                run({ a: { b: 1 } }, { a: { b: 'string' } }, false),
                run({ a: { b: '1' } }, { a: { b: 'number' } }, false),
                run({ a: { b: [1, 2, 3] } }, { a: { b: ['string'] } }, false),
                run(
                    { a: { b: ['1', '2', '3'] } },
                    { a: { b: ['number'] } },
                    false
                ),
                run({ a: '1' }, { a: ['number'] }, false),
                run({ a: 1 }, { a: ['string'] }, false),

                run({ a: true, b: false }, { a: 'boolean', b: 'string' }, false)
            ];

            if (passes.every(v => v) && fails.every(v => !v)) {
                return assertEquals(true, true);
            }

            throw new Error('Failed');
        }),

        test('JSON parsing', async () => {
            const obj = {
                a: 1,
                b: '2',
                c: [1, 2, 3],
                d: { e: 'f' }
            };

            const str = JSON.stringify(obj);

            const parsed = parseJSON(str, {
                a: 'number',
                b: 'string',
                c: ['number'],
                d: { e: 'string' }
            });

            const failed = parseJSON(str, {
                a: 'string',
                b: 'number',
                c: ['string'],
                d: { e: 'number' }
            });

            if (parsed.isOk() && failed.isErr()) {
                return assertEquals(true, true);
            }

            throw new Error('Failed');
        }),

        test('Match Case', async () => {
            const value = 'test';

            const a = match(value)
                .case('test', () => {
                    return 'test';
                })
                .case('test2', () => {
                    return 'test2';
                })
                .default(() => {
                    return 'default';
                })
                .exec()
                .unwrap();

            const b = match(value)
                .case('test2', () => {
                    return 'test2';
                })
                .default(() => {
                    return 'default';
                })
                .exec()
                .unwrap();

            class Test {}

            const c = matchInstance(new Test())
                .case(Test, () => 'test')
                .case(Array, () => 'array')
                .default(() => 'default')
                .exec()
                .unwrap();

            assertEquals(a, 'test');
            assertEquals(b, 'default');
            assertEquals(c, 'test');
        }),
        test('Scout groups', async () => {
            const eventKey = '2023cabl';
            const regex = /^([0-9]{4}[a-z]{3,4})$/i;
            if (!regex.test(eventKey)) throw new Error('Invalid event key');

            const data = await getJSONSync<{
                matches: TBAMatch[];
                teams: TBATeam[];
            }>('scout-group-test');

            if (data.isOk()) {
                const { matches, teams } = data.value;
                const assignments = generateScoutGroups(teams, matches);
                const result = testAssignments(assignments);

                assertEquals(result.status, 'ok');
            } else {
                throw data.error;
            }
        })
        // if (!process.argv.includes('lite')) {
        //     test('Database tests', async () => {
        //         const { DB } = await import('../../server/utilities/databases');
        //     });
        // }
    ]);

if (require.main === module)
    runTests().then(val => process.exit(val.some(v => v === 1) ? 1 : 0));
