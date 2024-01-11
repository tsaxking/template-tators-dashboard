import { validate } from '../../middleware/data-type.ts';
import { Route } from '../../structure/app/app.ts';
import { DB } from '../../utilities/databases.ts';

const router = new Route();

router.post<{
    eventKey: string;
    matchNumber: number;
    compLevel: string;
}>(
    '/from-match',
    validate({
        eventKey: (v) => typeof v === 'string',
        matchNumber: (v) => typeof v === 'number',
        compLevel: (v) => typeof v === 'string',
    }),
    (req, res, next) => {
        const { eventKey, matchNumber, compLevel } = req.body;

        const matches = DB.all('matches/from-event', {
            eventKey,
        });

        const match = matches.find((m) =>
            m.matchNumber === matchNumber && m.compLevel === compLevel
        );

        if (!match) return res.sendStatus('whiteboard:match-not-found');

        const whiteboard = DB.get('whiteboards/from-match', {
            matchId: match.id,
        });

        if (!whiteboard) return res.sendStatus('whiteboard:not-found');

        res.json(whiteboard);
    },
);

router.post('/create', validate({}), (req, res, next) => {});

export default router;
