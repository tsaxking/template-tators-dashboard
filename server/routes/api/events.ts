import { Route } from '../../structure/app/app.ts';
import { DB } from '../../utilities/databases.ts';
import { validate } from '../../middleware/data-type.ts';

export const router = new Route();

router.post<{
    eventKey: string;
}>(
    '/properties',
    validate({
        eventKey: 'string',
    }),
    (req, res) => {
        const p = DB.get('events/from-key', {
            eventKey: req.body.eventKey,
        });
        res.json(p);
    },
);

router.post<{
    eventKey: string;
}>(
    '/checklist',
    validate({
        eventKey: 'string',
    }),
    async (req, res) => {},
);
