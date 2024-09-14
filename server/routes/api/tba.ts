import { validate } from '../../middleware/data-type';
import { App, Route } from '../../structure/app/app';
import env from '../../utilities/env';
import * as cTBA from '../../utilities/tba/custom';
import { TBA } from '../../utilities/tba/tba';

export const router = new Route();

const customAuth = App.headerAuth(
    'x-custom-tba-auth',
    env.CUSTOM_TBA_AUTH || 'abcd'
);

router.post('/test', customAuth, async (req, res) => {
    console.log('test successful', req.body);
    res.json({ success: true });
});

router.post<cTBA.Event>(
    '/create-event',
    customAuth,
    cTBA.validateEvent,
    async (req, res) => {
        const event = req.body;

        (await cTBA.createEvent(event)).unwrap();

        res.sendStatus('custom-tba:event-created');
    }
);

router.post<cTBA.Match>(
    '/create-match',
    customAuth,
    cTBA.validateMatch,
    async (req, res) => {
        const match = req.body;

        (await cTBA.createMatch(match)).unwrap();

        res.sendStatus('custom-tba:match-created');
    }
);

router.post<cTBA.Team>(
    '/create-team',
    customAuth,
    cTBA.validateTeam,
    async (req, res) => {
        const team = req.body;

        (await cTBA.createTeam(team)).unwrap();

        res.sendStatus('custom-tba:team-created');
    }
);

router.post<cTBA.TeamEvent>(
    '/create-team-event',
    customAuth,
    cTBA.validateTeamEvent,
    async (req, res) => {
        const { teams, eventKey } = req.body;

        (await cTBA.createEventTeams(eventKey, teams)).unwrap();

        res.sendStatus('custom-tba:team-event-created');
    }
);

router.post<{ eventKey: string }>(
    '/delete-event',
    customAuth,
    validate({
        eventKey: 'string'
    }),
    async (req, res) => {
        const { eventKey } = req.body;

        (await cTBA.deleteEvent(eventKey)).unwrap();

        res.sendStatus('custom-tba:event-deleted');
    }
);

router.post<{ matchKey: string }>(
    '/delete-match',
    customAuth,
    validate({
        matchKey: 'string'
    }),
    async (req, res) => {
        const { matchKey } = req.body;

        (await cTBA.deleteMatch(matchKey)).unwrap();

        res.sendStatus('custom-tba:match-deleted');
    }
);

router.post<{ teamKey: string }>(
    '/delete-team',
    customAuth,
    validate({
        teamKey: 'string'
    }),
    async (req, res) => {
        const { teamKey } = req.body;

        (await cTBA.deleteTeam(teamKey)).unwrap();

        res.sendStatus('custom-tba:team-deleted');
    }
);

router.get('/*', async (req, res) => {
    let { pathname } = req;

    pathname = pathname.replace('/api/tba', '');

    const result = await TBA.get(pathname);

    if (result.isErr()) return res.json(null);

    res.json(result.value);
});
