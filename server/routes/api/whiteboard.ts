import { validate } from '../../middleware/data-type';
import { Route } from '../../structure/app/app';
import { DB } from '../../utilities/databases';

const router = new Route();

router.post<{
    eventKey: string;
    matchNumber: number;
    compLevel: string;
}>(
    '/from-match',
    validate({
        eventKey: 'string',
        matchNumber: 'number',
        compLevel: 'string'
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

        if (!match) return res.sendStatus('whiteboard:match-not-found');

        const whiteboard = DB.get('whiteboards/from-match', {
            matchId: match.id
        });

        if (!whiteboard) return res.sendStatus('whiteboard:not-found');

        res.json(whiteboard);
    }
);

router.post('/create', validate({}), (req, res, next) => {});

export default router;
