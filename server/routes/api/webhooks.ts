import { Route } from '../../structure/app/app';
import { App, ServerFunction } from '../../structure/app/app';
import { DB } from '../../utilities/databases';
import env from '../../utilities/env';
import { generateScoutGroups } from '../../../shared/submodules/tatorscout-calculations/scout-groups';
import { TBA } from '../../utilities/tba/tba';
import {
    TBAMatch,
    TBATeam
} from '../../../shared/submodules/tatorscout-calculations/tba';
import { Table } from '../../../scripts/build-table';
// import Account from '../../structure/accounts';
import { TeamComments } from '../../utilities/tables';
import { RetrievedMatchScouting } from '../../utilities/tables';
import { dateTime } from '../../../shared/clock';
import { TraceArray } from '../../../shared/submodules/tatorscout-calculations/trace';
import { resolveAll } from '../../../shared/check';
import { Account } from '../../structure/structs/account';

export const router = new Route();

const lastRequests: {
    [url: string]: number;
} = {};

const auth: ServerFunction = async (req, res, next) => {
    const now = Date.now();

    if (!lastRequests[req.pathname]) lastRequests[req.pathname] = 0;

    if (now - lastRequests[req.pathname] < 1000 * 60) {
        return res.sendStatus('webhook:rate-limit');
    }

    lastRequests[req.pathname] = now;

    return App.headerAuth('x-auth-key', env.WEBHOOK_KEY as string)(
        req,
        res,
        next
    );
};

router.post('/test', (req, res) => {
    res.send(JSON.stringify({ success: true }));
});

router.post('/event/:eventKey/teams/traces', auth, async (req, res) => {
    const { eventKey } = req.params;
    if (!eventKey) return res.sendStatus('webhook:invalid-url');

    const scouting = await DB.all('match-scouting/from-event', { eventKey });

    if (scouting.isErr()) return res.sendStatus('webhook:invalid-url');

    const trace = scouting.value.map(s => {
        const { team, matchNumber, compLevel, trace } = s;
        return {
            team,
            matchNumber,
            compLevel,
            trace: JSON.parse(trace)
        };
    });

    res.json(trace);
});

router.post('/event/:eventKey/scout-groups', auth, async (req, res) => {
    const { eventKey } = req.params;
    if (!eventKey) return res.sendStatus('webhook:invalid-url');

    const [teams, matches] = await Promise.all([
        TBA.get<TBATeam[]>(`/event/${eventKey}/teams`),
        TBA.get<TBAMatch[]>(`/event/${eventKey}/matches`)
    ]);

    if (teams.isOk() && matches.isOk()) {
        if (!teams.value || !matches.value) {
            return res.sendStatus('webhook:invalid-url');
        }
        const scoutGroups = generateScoutGroups(teams.value, matches.value);

        res.json(scoutGroups);
    }

    res.sendStatus('webhook:invalid-url');
});

router.post('/event/:eventKey/match-scouting', auth, async (req, res) => {
    const { eventKey } = req.params;
    if (!eventKey) return res.sendStatus('webhook:invalid-url');

    const matches = await DB.all('match-scouting/from-event', { eventKey });

    if (matches.isErr()) return res.sendStatus('webhook:invalid-url');

    res.json(
        matches.value.map(m => {
            const data: Partial<{
                id: string;
                matchId: string | undefined;
                team: number;
                scoutId: string | undefined;
                scoutGroup: number;
                checks: string;
                preScouting: number | undefined;
                time: number;
                eventKey: string;
                matchNumber: number;
                compLevel: string;
                trace: TraceArray;
                date: string;
            }> = {
                ...m,
                trace: JSON.parse(m.trace) as TraceArray,
                date: dateTime(new Date(m.time || Date.now())),
                checks: (JSON.parse(m.checks) as string[]).join(', ')
            };

            delete data.id;
            delete data.matchId;
            delete data.scoutId;
            delete data.time;
            delete data.preScouting;
            data.scoutGroup = Number(data.scoutGroup) + 1;

            return data;
        })
    );
});

router.post(
    '/event/:eventKey/team/:teamNumber/match-scouting',
    auth,
    async (req, res) => {
        const { eventKey, teamNumber } = req.params;
        if (!eventKey || !teamNumber) {
            return res.sendStatus('webhook:invalid-url');
        }

        const matches = await DB.all('match-scouting/from-team', {
            eventKey,
            team: +teamNumber
        });

        if (matches.isErr()) return res.sendStatus('webhook:invalid-url');

        res.json(
            matches.value.map(m => ({
                ...m,
                trace: JSON.parse(m.trace),
                date: dateTime(new Date(m.time || Date.now()))
            }))
        );
    }
);

router.post(
    '/event/:eventKey/team/:teamNumber/comments',
    auth,
    async (req, res) => {
        const { eventKey, teamNumber } = req.params;
        if (!eventKey || !teamNumber) {
            return res.sendStatus('webhook:invalid-url');
        }

        const comments = await DB.all('team-comments/from-team', {
            eventKey,
            team: +teamNumber
        });

        if (comments.isErr()) return res.sendStatus('webhook:invalid-url');

        res.json(comments.value);
    }
);

router.post('/event/:eventKey/comments', auth, async (req, res) => {
    const { eventKey } = req.params;
    if (!eventKey) return res.sendStatus('webhook:invalid-url');

    const comments = await DB.all('team-comments/from-event', { eventKey });
    const accounts = (await Account.Account.all(false)).unwrap();

    if (comments.isErr()) return res.sendStatus('webhook:invalid-url');

    res.json(
        comments.value.map(c => {
            const data: Partial<
                TeamComments & { date: string; account?: string }
            > = {};
            Object.assign(data, c);
            delete data.id;
            delete data.matchScoutingId;
            delete data.eventKey;
            data.account =
                accounts.find(a => a.id === c.accountId)?.data.username ||
                'Unknown';
            delete data.accountId;

            data.date = dateTime(new Date(data.time || Date.now()));
            delete data.time;

            return data;
        })
    );
});

router.post('/event/:eventKey/pit-scouting', auth, async (req, res) => {
    const { eventKey } = req.params;
    if (!eventKey) return res.sendStatus('webhook:invalid-url');

    const [teams, questions, answers] = await Promise.all([
        TBA.get<TBATeam[]>(`/event/${eventKey}/teams`),
        DB.all('scouting-questions/questions-from-event', { eventKey }),
        DB.all('scouting-questions/answers-from-event', { eventKey })
    ]);

    if (teams.isErr()) return res.sendStatus('webhook:invalid-url');
    if (questions.isErr()) return res.sendStatus('webhook:invalid-url');
    if (answers.isErr()) return res.sendStatus('webhook:invalid-url');
    if (!teams.value) return res.sendStatus('webhook:invalid-url');

    res.json(
        teams.value.map(t => {
            const answersForTeam = answers.value.filter(
                a => a.teamNumber === t.team_number
            );
            const data = questions.value.reduce(
                (acc, q) => {
                    acc[q.key] = JSON.parse(
                        answersForTeam.find(a => a.questionId === q.id)
                            ?.answer || '[]'
                    ); // this should never be undefined
                    return acc;
                },
                {} as { [key: string]: unknown }
            );

            return {
                team: t.team_number,
                name: t.nickname,
                ...data
            };
        })
    );
});

router.post('/event/:eventKey/summary', auth, async (req, res) => {
    const { eventKey } = req.params;
    if (!eventKey) return res.sendStatus('webhook:invalid-url');

    const [teams, matches] = await Promise.all([
        DB.all('teams/from-event', { eventKey }),
        DB.all('matches/from-event', { eventKey })
    ]);

    if (teams.isErr() || matches.isErr()) {
        return res.sendStatus('webhook:invalid-url');
    }

    const data = await Table.build(eventKey);
    if (data.isErr()) {
        console.error(data.error);
        return res.sendStatus('server:unknown-server-error', {
            error: data.error.message
        });
    }

    console.log(data.value[0]);

    res.json({
        teams: teams.value,
        matches: matches.value,
        summary: data.value
    });
});

router.post('/accounts/all', auth, async (req, res) => {
    const accounts = (await Account.Account.all(false)).unwrap();

    res.json(accounts.map(a => Account.safe(a)));
});
