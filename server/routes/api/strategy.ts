import { validate } from '../../middleware/data-type';
import { Route } from '../../structure/app/app';
import { DB } from '../../utilities/databases';

export const router = new Route();

router.post<{
    whiteboardId: string;
}>(
    '/whiteboards',
    validate({
        whiteboardId: 'string'
    }),
    async (req, res) => {
        const { whiteboardId } = req.body;

        const whiteboards = await DB.all('whiteboards/from-id', {
            id: whiteboardId
        });

        if (whiteboards.isErr()) return res.sendStatus('unknown:error');

        res.stream(whiteboards.value.map(s => JSON.stringify(s)));
    }
);
