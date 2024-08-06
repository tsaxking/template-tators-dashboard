import { Route } from '../../structure/app/app';
import { validate } from '../../middleware/data-type';
import { Strategy } from '../../structure/cache/strategy';

export const router = new Route();


router.post<{
    name: string;
    time: number;
    matchId: string | undefined;
    customMatchId: string | undefined;
    comment: string;
    checks: string[];
}>('/new', validate({
    name: 'string',
    time: 'number',
    matchId: ['string', 'undefined'],
    customMatchId: ['string', 'undefined'],
    comment: 'string',
    checks: (v: unknown) => Array.isArray(v) && v.every(val => typeof val === 'string'),
}), async (req, res) => {
    const { name, time, matchId, customMatchId, comment, checks } = req.body;
    const { accountId } = req.session;
    if (!accountId) return res.sendStatus('account:not-logged-in');


    const s = (await Strategy.new({
        name, 
        time, 
        matchId, 
        customMatchId,
        comment,
        checks: JSON.stringify(checks),
        createdBy: accountId
    })).unwrap();

    res.sendStatus('strategy:new');

    req.io.emit('strategy:new', s);
});

router.post<{
    id: string;
}>('/from-id', validate({
    id: 'string'
}), async (req, res) => {
    const { id } = req.body;

    const s = (await Strategy.fromId(id)).unwrap();

    if (!s) return res.sendStatus('strategy:not-found');

    return res.json(s);
});