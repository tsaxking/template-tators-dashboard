import { validate } from '../../middleware/data-type';
import { Route } from '../../structure/app/app';
import { DB } from '../../utilities/databases';

export const router = new Route();

router.post<{
    eventKey: string;
    matchNumber: number;
    compLevel: 'qm' | 'qf' | 'sf' | 'f';
}>(
    '/strategy',
    validate({
        eventKey: 'string',
        matchNumber: 'number',
        compLevel: ['qm', 'qf', 'sf', 'f']
    }),
    async (req, res) => {
        const { eventKey, matchNumber, compLevel } = req.body;

        const result = await DB.all('strategy/from-match', {
            eventKey,
            matchNumber,
            compLevel
        });

        if (result.isErr()) return res.sendStatus('unknown:error');

        res.json(result.value);
    }
);

router.post<{
    eventKey: string;
}>(
    '/all-from-event',
    validate({
        eventKey: 'string'
    }),
    async (req, res) => {
        const { eventKey } = req.body;

        const matchesRes = await DB.all('matches/from-event', {
            eventKey
        });

        if (matchesRes.isErr()) return res.sendStatus('unknown:error');

        res.json(matchesRes.value);
    }
);

router.post<{
    eventKey: string;
    matchNumber: number;
    compLevel: 'qm' | 'qf' | 'sf' | 'f';
}>(
    '/info',
    validate({
        eventKey: 'string',
        matchNumber: 'number',
        compLevel: ['qm', 'qf', 'sf', 'f']
    }),
    async (req, res) => {
        const { eventKey, matchNumber, compLevel } = req.body;

        const matches = await DB.all('matches/from-event', {
            eventKey
        });

        if (matches.isErr()) return res.sendStatus('unknown:error');

        const match = matches.value.find(
            m => m.matchNumber === matchNumber && m.compLevel === compLevel
        );

        if (!match) return res.sendStatus('match:not-found');

        res.json(match);
    }
);
