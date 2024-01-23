import { validate } from '../../middleware/data-type.ts';
import { Route } from '../../structure/app/app.ts';
import { DB } from '../../utilities/databases.ts';

export const router = new Route();

router.post(
    '/strategy',
    validate({
        eventKey: 'string',
        matchNumber: 'number',
        compLevel: ['qm', 'qf', 'sf', 'f'],
    }),
    (req, res) => {
        const { eventKey, matchNumber, compLevel } = req.body;

        const strategies = DB.all('strategy/from-match', {
            eventKey,
            matchNumber,
            compLevel,
        });

        res.stream(strategies.map((s) => JSON.stringify(s)));
    },
);

router.post<{
    eventKey: string;
}>(
    '/all-from-event',
    validate({
        eventKey: 'string',
    }),
    (req, res) => {
        const { eventKey } = req.body;

        const matches = DB.all('matches/from-event', {
            eventKey,
        });

        res.stream(matches.map((m) => JSON.stringify(m)));
    },
);

router.post(
    '/info',
    validate({
        eventKey: 'string',
        matchNumber: 'number',
        compLevel: ['qm', 'qf', 'sf', 'f'],
    }),
    (req, res) => {
        const { eventKey, matchNumber, compLevel } = req.body;

        const matches = DB.all('matches/from-event', {
            eventKey,
        });

        const match = matches.find(
            (m) => m.matchNumber === matchNumber && m.compLevel === compLevel,
        );

        if (!match) return res.sendStatus('match:not-found');

        res.json(match);
    },
);
