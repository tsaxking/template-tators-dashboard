import { validate } from '../../middleware/data-type';
import { Route } from '../../structure/app/app';
import { FIRSTWhiteboard } from '../../structure/cache/whiteboards';

export const router = new Route();

router.post<{
    name: string;
    strategyId: string;
}>(
    '/new',
    validate({
        name: 'string',
        strategyId: 'string'
    }),
    async (req, res) => {
        const { name, strategyId } = req.body;
        const wb = (
            await FIRSTWhiteboard.new({ name, board: '[]', strategyId })
        ).unwrap();
        res.sendStatus('whiteboard:created');
        req.io.emit('whiteboard:created', wb);
    }
);

router.post<{
    strategyId: string;
}>('/from-strategy', validate({ strategyId: 'string' }), async (req, res) => {
    const { strategyId } = req.body;
    const boards = (await FIRSTWhiteboard.fromStrategy(strategyId)).unwrap();
    res.json(boards);
});

router.post<{
    id: string;
    name: string;
    board: string;
    strategyId: string;
}>(
    '/update',
    validate({
        id: 'string',
        name: 'string',
        board: 'string'
    }),
    async (req, res) => {
        const { id, name, board, strategyId } = req.body;
        const wb = (await FIRSTWhiteboard.fromId(id)).unwrap();
        if (!wb) return res.sendStatus('whiteboard:not-found');

        (
            await wb.update({
                name,
                board,
                strategyId
            })
        ).unwrap();

        res.sendStatus('whiteboard:update');
        req.io.emit('whiteboard:update', wb);
    }
);
