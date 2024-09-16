import { Route } from '../../structure/app/app';
import { validate } from '../../middleware/data-type';
import { Strategy } from '../../structure/cache/strategy';
import { CompLevel } from '../../../shared/db-types-extended';
import { StrategyConfig } from '../../structure/cache/strategy-configs';

export const router = new Route();

router.post<{
    name: string;
    matchId: string | undefined;
    customMatchId: string | undefined;
}>(
    '/new',
    validate(
        {
            name: 'string',
            matchId: v => typeof v === 'string' || v === undefined,
            customMatchId: v => typeof v === 'string' || v === undefined
        },
        {
            log: true
        }
    ),
    async (req, res) => {
        const { name, matchId, customMatchId } = req.body;

        if (customMatchId && matchId) return res.sendStatus('strategy:invalid');

        const { accountId } = req.session;
        if (!accountId) return res.sendStatus('account:not-logged-in');

        const s = (
            await Strategy.new({
                name,
                time: Date.now(),
                matchId,
                customMatchId,
                comment: '',
                checks: JSON.stringify([]),
                createdBy: accountId
            })
        ).unwrap();

        res.sendStatus('strategy:new');

        req.io.emit('strategy:new', s);
    }
);

router.post<{
    id: string;
}>(
    '/from-id',
    validate({
        id: 'string'
    }),
    async (req, res) => {
        const { id } = req.body;

        const s = (await Strategy.fromId(id)).unwrap();

        if (!s) return res.sendStatus('strategy:not-found');

        return res.json(s);
    }
);

router.post<{
    eventKey: string;
    matchNumber: number;
    compLevel: CompLevel;
}>(
    '/from-match',
    validate({
        eventKey: 'string',
        matchNumber: 'number',
        compLevel: 'string'
    }),
    async (req, res) => {
        const { eventKey, matchNumber, compLevel } = req.body;

        const s = (
            await Strategy.fromMatch(eventKey, matchNumber, compLevel)
        ).unwrap();

        return res.json(s);
    }
);

router.post<{
    id: string;
    name: string;
    time: number;
    matchId: string | undefined;
    customMatchId: string | undefined;
    comment: string;
    checks: string[];
}>(
    '/update',
    validate({
        id: 'string',
        name: 'string',
        time: 'number',
        matchId: v => typeof v === 'string' || v === undefined || v === null,
        customMatchId: v =>
            typeof v === 'string' || v === undefined || v === null,
        comment: 'string',
        checks: (v: unknown) =>
            Array.isArray(v) && v.every(val => typeof val === 'string')
    }),
    async (req, res) => {
        const { id, name, time, matchId, customMatchId, comment, checks } =
            req.body;
        const s = (await Strategy.fromId(id)).unwrap();
        if (!s) return res.sendStatus('strategy:not-found');

        await s.update({
            name,
            time,
            matchId,
            customMatchId,
            comment,
            checks: JSON.stringify(checks)
        });

        res.sendStatus('strategy:updated');

        req.io.emit('strategy:update', s);
    }
);

router.post<{
    strategyId: string;
    team: number;
    type: string;
    value: string;
}>('/new-config', validate({
    strategyId: 'string',
    team: 'number',
    type: 'string',
    value: 'string'
}), async (req, res) => {
    const { strategyId, team, type, value } = req.body;
    const strategy = (await Strategy.fromId(strategyId)).unwrap();
    if (!strategy) return res.sendStatus('strategy:not-found');

    const config = (await strategy.newConfig({ team, type, value })).unwrap();

    res.sendStatus('strategy-config:new');
    req.io.emit('strategy-config:new', config);
});

router.post<{
    id: string;
    team: number;
    type: string;
    value: string;
}>('/update-config', validate({
    id: 'string',
    team: 'number',
    type: 'string',
    value: 'string'
}), async (req, res) => {
    const { id, team, type, value } = req.body;
    const config = (await StrategyConfig.fromId(id)).unwrap();
    if (!config) return res.sendStatus('strategy-config:not-found');

    await config.update({ team, type, value });

    res.sendStatus('strategy-config:updated');
    req.io.emit('strategy-config:update', config);
});

router.post<{
    id: string;
}>('/delete-config', validate({
    id: 'string',
}), async (req, res) => {
    const { id } = req.body;
    const config = (await StrategyConfig.fromId(id)).unwrap();
    if (!config) return res.sendStatus('strategy-config:not-found');

    await config.delete();

    res.sendStatus('strategy-config:deleted');
    req.io.emit('strategy-config:delete', config);
});

router.post<{
    strategyId: string;
}>('/get-configs', validate({
    strategyId: 'string',
}), async (req, res) => {
    const { strategyId } = req.body;
    const strategy = (await Strategy.fromId(strategyId)).unwrap();
    if (!strategy) return res.sendStatus('strategy:not-found');

    const configs = (await strategy.getConfigs()).unwrap();

    res.json(configs);
});