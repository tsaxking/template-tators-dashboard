import { validate } from '../../middleware/data-type.ts';
import { Route } from '../../structure/app/app.ts';
import { DB } from '../../utilities/databases.ts';

export const router = new Route();

router.post<{
    team: number;
    eventKey: string;
}>(
    '/match-scouting',
    validate({
        team: 'number',
        eventKey: 'string',
    }),
    async (req, res) => {
        const { team, eventKey } = req.body;

        const scouting = await DB.all('match-scouting/from-team', {
            team,
            eventKey,
        });

        if (scouting.isErr()) return res.sendStatus('unknown:error');

        res.stream(scouting.value.map((s) => JSON.stringify(s)));
    },
);

router.post<{
    team: number;
    eventKey: string;
}>(
    '/match-comments',
    validate({
        team: 'number',
        eventKey: 'string',
    }),
    async (req, res) => {
        const { team, eventKey } = req.body;

        const comments = await DB.all('team-comments/from-team', {
            team,
            eventKey,
        });

        if (comments.isErr()) return res.sendStatus('unknown:error');

        res.stream(comments.value.map((s) => JSON.stringify(s)));
    },
);

router.post<{
    team: number;
    eventKey: string;
}>(
    '/pit-scouting',
    validate({
        team: 'number',
        eventKey: 'string',
    }),
    async (req, res) => {
        const { team, eventKey } = req.body;

        const scouting = await DB.all('scouting-questions/answer-from-team', {
            eventKey,
            teamNumber: team,
        });

        if (scouting.isErr()) return res.sendStatus('unknown:error');

        res.stream(scouting.value.map((s) => JSON.stringify(s)));
    },
);

router.post<{
    eventKey: string;
}>(
    '/all-from-event',
    validate({
        eventKey: 'string',
    }),
    async (req, res) => {
        const { eventKey } = req.body;

        const teams = await DB.all('teams/from-event', {
            eventKey,
        });

        if (teams.isErr()) return res.sendStatus('unknown:error');

        res.stream(teams.value.map((t) => JSON.stringify(t)));
    },
);
