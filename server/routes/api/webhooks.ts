import { Route } from '../../structure/app/app.ts';
import { App } from '../../structure/app/app.ts';
import { DB } from '../../utilities/databases.ts';
import env from '../../utilities/env.ts';
import { generateScoutGroups } from '../../../shared/submodules/tatorscout-calculations/scout-groups.ts';
import { TBA } from '../../utilities/tba/tba.ts';
import {
    TBAMatch,
    TBATeam,
} from '../../../shared/submodules/tatorscout-calculations/tba.ts';
import { Table } from '../../../scripts/build-table.ts';
import Account from '../../structure/accounts.ts';

export const router = new Route();

const auth = App.headerAuth('x-auth-key', env.WEBHOOK_KEY as string);

router.get('/test', (req, res) => {
    res.send(JSON.stringify({ success: true }));
});

router.get('/event/:eventKey/teams/traces', auth, async (req, res) => {
    const { eventKey } = req.params;
    if (!eventKey) return res.sendStatus('webhook:invalid-url');

    const scouting = await DB.all('match-scouting/from-event', { eventKey });

    if (scouting.isErr()) return res.sendStatus('webhook:invalid-url');

    const trace = scouting.value.map((s) => {
        const { team, matchNumber, compLevel, trace } = s;
        return {
            team,
            matchNumber,
            compLevel,
            trace: JSON.parse(trace),
        };
    });

    res.json(trace);
});

router.get('/event/:eventKey/scout-groups', auth, async (req, res) => {
    const { eventKey } = req.params;
    if (!eventKey) return res.sendStatus('webhook:invalid-url');

    const [teams, matches] = await Promise.all([
        TBA.get<TBATeam[]>(`/event/${eventKey}/teams`),
        TBA.get<TBAMatch[]>(`/event/${eventKey}/matches`),
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

router.get('/event/:eventKey/match-scouting', auth, async (req, res) => {
    const { eventKey } = req.params;
    if (!eventKey) return res.sendStatus('webhook:invalid-url');

    const matches = await DB.all('match-scouting/from-event', { eventKey });

    if (matches.isErr()) return res.sendStatus('webhook:invalid-url');

    res.json(matches.value.map((m) => ({
        ...m,
        trace: JSON.parse(m.trace),
    })));
});

router.get(
    '/event/:eventKey/team/:teamNumber/match-scouting',
    auth,
    async (req, res) => {
        const { eventKey, teamNumber } = req.params;
        if (!eventKey || !teamNumber) {
            return res.sendStatus('webhook:invalid-url');
        }

        const matches = await DB.all('match-scouting/from-team', {
            eventKey,
            team: +teamNumber,
        });

        if (matches.isErr()) return res.sendStatus('webhook:invalid-url');

        res.json(matches.value.map((m) => ({
            ...m,
            trace: JSON.parse(m.trace),
        })));
    },
);

router.get(
    '/event/:eventKey/team/:teamNumber/comments',
    auth,
    async (req, res) => {
        const { eventKey, teamNumber } = req.params;
        if (!eventKey || !teamNumber) {
            return res.sendStatus('webhook:invalid-url');
        }

        const comments = await DB.all('team-comments/from-team', {
            eventKey,
            team: +teamNumber,
        });

        if (comments.isErr()) return res.sendStatus('webhook:invalid-url');

        res.json(comments.value);
    },
);

router.get('/event/:eventKey/comments', auth, async (req, res) => {
    const { eventKey } = req.params;
    if (!eventKey) return res.sendStatus('webhook:invalid-url');

    const comments = await DB.all('team-comments/from-event', { eventKey });

    if (comments.isErr()) return res.sendStatus('webhook:invalid-url');

    res.json(comments.value);
});

router.get('/event/:eventKey/summary', auth, async (req, res) => {
    const { eventKey } = req.params;
    if (!eventKey) return res.sendStatus('webhook:invalid-url');

    const teams = await DB.all('teams/from-event', { eventKey });
    const matches = await DB.all('matches/from-event', { eventKey });

    if (teams.isErr() || matches.isErr()) {
        return res.sendStatus('webhook:invalid-url');
    }

    const data = await Table.build(eventKey);
    if (data.isErr()) {
        console.error(data.error);
        return res.sendStatus('server:unknown-server-error', {
            error: data.error.message,
        });
    }

    console.log(data.value);

    res.json({
        teams: teams.value,
        matches: matches.value,
        summary: data.value,
    });
});

router.get('/accounts/all', auth, async (req, res) => {
    const accounts = await Account.getAll();

    res.json(await Promise.all(accounts.map((a) => a.safe())));
});
