import { validate } from '../../middleware/data-type.ts';
import { Route } from '../../structure/app/app.ts';
import { App } from '../../structure/app/app.ts';
import { DB } from '../../utilities/databases.ts';
import env from '../../utilities/env.ts';
import { generateScoutGroups } from '../../../shared/submodules/tatorscout-calculations/scout-groups.ts';
import { TBA } from '../../utilities/tba/tba.ts';
import { TBAMatch, TBATeam } from '../../../shared/submodules/tatorscout-calculations/tba.ts';

export const router = new Route();

router.use(App.headerAuth('x-webhook-auth', env.WEBHOOK_KEY as string));

router.get('/event/:eventKey/teams/trace', validate({
    eventKey: (v: any) => typeof v === 'string',
}), (req, res) => {
    const { eventKey } = req.params;
    if (!eventKey) return res.sendStatus('webhook:invalid-url');

    const scouting = DB.all('match-scouting/from-event', { eventKey });
    const trace = scouting.map(s => JSON.parse(s.trace));

    res.json(trace);
});

router.get('/event/:eventKey/scout-groups', async (req, res) => {
    const { eventKey } = req.params;

    const teams = await TBA.get<TBATeam[]>(`/event/${eventKey}/teams`);
    if (!teams) return res.sendStatus('webhook:invalid-url');

    const matches = await TBA.get<TBAMatch[]>(`/event/${eventKey}/matches`);
    if (!matches) return res.sendStatus('webhook:invalid-url');

    const scoutGroups = generateScoutGroups(teams, matches);

    res.json(scoutGroups);
});

