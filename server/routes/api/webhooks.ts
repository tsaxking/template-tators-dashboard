import { Route } from '../../structure/app/app.ts';
import { App } from '../../structure/app/app.ts';
import { DB } from '../../utilities/databases.ts';
import env from '../../utilities/env.ts';
import { generateScoutGroups } from '../../../shared/submodules/tatorscout-calculations/scout-groups.ts';
import { TBA } from '../../utilities/tba/tba.ts';
import {
    TBAMatch,
    TBATeam,
} from '../../../shared/submodules/tatorscout-calculations/tba.ts';

export const router = new Route();

const auth = App.headerAuth('x-auth-key', env.WEBHOOK_AUTH as string);

router.get(
    '/test',
    (req, res) => {
        res.send(JSON.stringify({ success: true }));
    }
);

router.get(
    '/event/:eventKey/teams/trace',
    auth,
    (req, res) => {
        const { eventKey } = req.params;
        if (!eventKey) return res.sendStatus('webhook:invalid-url');

        const scouting = DB.all('match-scouting/from-event', { eventKey });
        const trace = scouting.map((s) => {
            const { team, matchNumber, compLevel, trace } = s;
            return {
                team,
                matchNumber,
                compLevel,
                trace: JSON.parse(trace)
            };
        });

        res.json(trace);
    },
);

router.get(
    '/event/:eventKey/scout-groups',
    auth,
    async (req, res) => {
        const { eventKey } = req.params;

        const [teams, matches] = await Promise.all([
            TBA.get<TBATeam[]>(`/event/${eventKey}/teams`),
            TBA.get<TBAMatch[]>(`/event/${eventKey}/matches`),
        ]);

        if (teams.isOk() && matches.isOk()) {
            if (!teams.value || !matches.value) {
                return res.sendStatus('webhook:invalid-url');
            }
            const scoutGroups = generateScoutGroups(teams.value, matches.value);

            res.json(scoutGroups);
        }

        res.sendStatus('webhook:invalid-url');
    },
);

router.get(
    '/event/:eventKey/match-scouting',
    auth,
    (req, res) => {
        const { eventKey } = req.params;
        if (!eventKey) return res.sendStatus('webhook:invalid-url');

        const matches = DB.all('match-scouting/from-event', { eventKey });
    
        res.json(matches);
    }
);

router.get(
    '/event/:eventKey/team/:teamNumber/match-scouting',
    auth,
    (req, res) => {
        const { eventKey, teamNumber } = req.params;
        if (!eventKey || !teamNumber) return res.sendStatus('webhook:invalid-url');

        const matches = DB.all('match-scouting/from-team', { eventKey, team: +teamNumber });
    
        res.json(matches);
    }
);

router.get(
    '/event/:eventKey/team/:teamNumber/comments',
    auth,
    (req, res) => {
        const { eventKey, teamNumber } = req.params;
        if (!eventKey || !teamNumber) return res.sendStatus('webhook:invalid-url');

        const comments = DB.all('team-comments/from-team', { eventKey, team: +teamNumber });
    
        res.json(comments);
    }
);

router.get(
    '/event/:eventKey/comments',
    auth,
    (req, res) => {
        const { eventKey } = req.params;
        if (!eventKey) return res.sendStatus('webhook:invalid-url');

        const comments = DB.all('team-comments/from-event', { eventKey });
    
        res.json(comments);
    }
);