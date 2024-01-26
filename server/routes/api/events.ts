import { Route } from '../../structure/app/app.ts';
import { DB } from '../../utilities/databases.ts';
import { validate } from '../../middleware/data-type.ts';

export const router = new Route();

router.post(
    '/properties',
    validate({
        eventKey: 'string',
    }),
    (req, res) => {
        const p = DB.get('events/from-key', req.body.eventKey);
        res.json(p);
    },
);
