import { validate } from "../../middleware/data-type.ts";
import { Route } from "../../structure/app/app.ts";
import { DB } from "../../utilities/databases.ts";

export const router = new Route();

router.post('/strategy', validate({
    eventKey: (v: any) => typeof v === 'string',
    matchNumber: (v: any) => typeof v === 'number',
    compLevel: (v: any) => ['qm', 'qf', 'sf', 'f'].includes(v)
}), (req, res) => {
    const { eventKey, matchNumber, compLevel } = req.body;

    const strategies = DB.all('strategy/from-match', {
        eventKey,
        matchNumber,
        compLevel
    });

    res.stream(strategies.map(s => JSON.stringify(s)));
});