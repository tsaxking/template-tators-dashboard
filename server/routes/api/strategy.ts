import { validate } from '../../middleware/data-type.ts';
import { Route } from '../../structure/app/app.ts';
import { DB } from '../../utilities/databases.ts';

export const router = new Route();

router.post(
    '/whiteboards',
    validate({
        whiteboardId: (v: any) => typeof v === 'string',
    }),
    (req, res) => {
        const { whiteboardId } = req.body;

        const whiteboards = DB.all('whiteboards/from-id', {
            id: whiteboardId,
        });

        res.stream(whiteboards.map((s) => JSON.stringify(s)));
    },
);
