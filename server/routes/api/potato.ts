import { resolveAll } from '../../../shared/check';
import { validate } from '../../middleware/data-type';
import Account from '../../structure/accounts';
import { Route } from '../../structure/app/app';
import { Potato } from '../../structure/cache/potato';
import Filter from 'bad-words';

export const router = new Route();

router.post('/init', async (req, res) => {
    const a = (await req.session.getAccount()).unwrap();
    if (!a) return res.sendStatus('account:not-logged-in');

    const roles = (await a.getRoles()).unwrap();
    if (roles.find(r => r.name.toLowerCase() === 'mentor'))
        return res.status(401).json({
            error: 'Mentors are not allowed to have a potato.'
        });

    const p = (await Potato.fromAccount(a.id)).unwrap();
    res.json((await p.toObject()).unwrap());

    req.io.emit('potato:new', p);
});

router.post('/leaderboard', async (req, res) => {
    const potatoes = (await Potato.all())
        .unwrap()
        .sort((a, b) => b.potatoChips - a.potatoChips);

    res.json(
        resolveAll(await Promise.all(potatoes.map(p => p.toObject()))).unwrap()
    );
});

router.post<{
    accountId: string;
    achievements: string[];
    shadowAchievements: string[];
    potatoChips: number;
    name: string;
}>(
    '/update',
    Account.allowPermissions('mentor'),
    validate({
        accountId: 'string',
        achievements: (v: unknown) =>
            Array.isArray(v) && v.every(e => typeof e === 'string'),
        shadowAchievements: (v: unknown) =>
            Array.isArray(v) && v.every(e => typeof e === 'string'),
        potatoChips: 'number',
        name: 'string'
    }),
    async (req, res) => {
        const {
            accountId,
            achievements,
            shadowAchievements,
            potatoChips,
            name
        } = req.body;

        if (req.session.accountId === accountId)
            return res.sendStatus('potato:cannot-update-self');

        const p = (await Potato.fromAccount(accountId)).unwrap();
        p.update({
            achievements: JSON.stringify(achievements),
            shadowAchievements: JSON.stringify(shadowAchievements),
            potatoChips,
            name
        });

        res.sendStatus('potato:updated');

        req.io.emit('potato:update', p);
    }
);

router.post<{
    name: string;
}>('/change-name', async (req, res) => {
    const { name } = req.body;
    const filter = new Filter();
    if (filter.isProfane(name)) return res.sendStatus('profanity:detected');

    const id = req.session.accountId;
    if (!id) return res.sendStatus('account:not-logged-in');

    const p = (await Potato.fromAccount(id)).unwrap();
    if (p.potatoChips < 1000) {
        return res.sendStatus('potato:not-enough-chips');
    }
    p.update({ name });

    res.sendStatus('potato:updated');
});