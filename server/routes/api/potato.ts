import { State } from "../../../shared/potato-types";
import { validate } from "../../middleware/data-type";
import { Route } from "../../structure/app/app";
import { Potato } from "../../structure/cache/potato";

export const router = new Route();


router.post('/init', async (req, res) => {
    if (!req.session.accountId) return res.sendStatus('account:not-logged-in');

    const p = (await Potato.fromAccount(req.session.accountId)).unwrap();
    res.json(p.state);
});

router.post<State>('/save', validate({
    achievements: (data: unknown) => {
        if (typeof data !== 'object' || Array.isArray(data)) return false;
        if (data === null) return false;
        return Object.entries(data).every(([k, v]) => {
            if (!['normal', 'shadow'].includes(k)) return false;
            if (!Array.isArray(v)) return false;
            return v.every(val => typeof val === 'string');
        });
    },
    level: 'number'
}), async (req, res) => {
    if (!req.session.accountId) return res.sendStatus('account:not-logged-in');

    const p = (await Potato.fromAccount(req.session.accountId)).unwrap();

    p.save(req.body);

    // TODO: status
});