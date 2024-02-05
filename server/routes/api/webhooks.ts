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

export const router = new Route();

const auth = App.headerAuth('x-auth-key', env.WEBHOOK_AUTH as string);

router.post('/test', (req, res) => {
    res.send(JSON.stringify({ success: true }));
});

router.post('/event/:eventKey/teams/trace', auth, async (req, res) => {
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

router.post('/event/:eventKey/scout-groups', auth, async (req, res) => {
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

router.post('/event/:eventKey/match-scouting', auth, async (req, res) => {
    const { eventKey } = req.params;
    if (!eventKey) return res.sendStatus('webhook:invalid-url');

    const matches = await DB.all('match-scouting/from-event', { eventKey });

    if (matches.isErr()) return res.sendStatus('webhook:invalid-url');

    res.json(matches.value);
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
            team: +teamNumber,
        });

        if (matches.isErr()) return res.sendStatus('webhook:invalid-url');

        res.json(matches.value);
    },
);

router.post('/event/:eventKey/team/:teamNumber/comments', auth, async (req, res) => {
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
});

router.post('/event/:eventKey/comments', auth, async (req, res) => {
    const { eventKey } = req.params;
    if (!eventKey) return res.sendStatus('webhook:invalid-url');

    const comments = await DB.all('team-comments/from-event', { eventKey });

    if (comments.isErr()) return res.sendStatus('webhook:invalid-url');

    res.json(comments.value);
});
