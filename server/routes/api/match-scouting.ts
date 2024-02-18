import { validate } from '../../middleware/data-type.ts';
import { Route } from '../../structure/app/app.ts';
import { DB } from '../../utilities/databases.ts';

export const router = new Route();




router.post<{
    eventKey: string;
    teamNumber: number; 
}>(
    '/from-team',
    validate({
        eventKey: 'string',
        teamNumber: 'number',
    }),
    async (req, res) => {
        const { eventKey, teamNumber } = req.body;

        const result = await DB.all('match-scouting/from-team', {
            eventKey,
            team: teamNumber,
        });

        if (result.isErr()) {
            return res.sendStatus('server:unknown-server-error');
        }

        return res.json(result.value);
    }
);