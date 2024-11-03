import { validate } from '../../middleware/data-type';
import { Route } from '../../structure/app/app';
import { Match } from '../../structure/cache/matches';
import { DB } from '../../utilities/databases';

export const router = new Route();

router.post<{
    eventKey: string;
}>(
    '/all-from-event',
    validate({
        eventKey: 'string'
    }),
    async (req, res) => {
        const { eventKey } = req.body;

        const matches = (await Match.fromEvent(eventKey)).unwrap();

        res.json(matches);
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

        const matches = (await Match.fromEvent(eventKey)).unwrap();

        const match = matches.find(
            m => m.matchNumber === matchNumber && m.compLevel === compLevel
        );

        if (!match) return res.sendStatus('match:not-found');

        res.json(match);
    }
);

router.post<{
    id: string;
}>('/from-id', validate({ id: 'string' }), async (req, res) => {
    const { id } = req.body;

    const match = (await Match.fromId(id)).unwrap();
    res.json(match);
});
