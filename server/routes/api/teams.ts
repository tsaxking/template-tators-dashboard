import { validate } from '../../middleware/data-type.ts';
import { Route } from '../../structure/app/app.ts';
import { DB } from '../../utilities/databases.ts';

export const router = new Route();

router.post(
    '/match-scouting',
    validate({
        team: (v: any) => typeof v === 'number',
        eventKey: (v: any) => typeof v === 'string',
    }),
    (req, res) => {
        const { team, eventKey } = req.body;

        const scouting = DB.all('match-scouting/from-team', {
            team,
            eventKey,
        });

        res.stream(scouting.map((s) => JSON.stringify(s)));
    },
);

router.post(
    '/match-comments',
    validate({
        team: (v: any) => typeof v === 'number',
        eventKey: (v: any) => typeof v === 'string',
    }),
    (req, res) => {
        const { team, eventKey } = req.body;

        const comments = DB.all('match-comments/from-team', {
            team,
            eventKey,
        });

        res.stream(comments.map((s) => JSON.stringify(s)));
    },
);

router.post(
    '/pit-scouting',
    validate({
        team: (v: any) => typeof v === 'number',
        eventKey: (v: any) => typeof v === 'string',
    }),
    (req, res) => {
        const { team, eventKey } = req.body;

        const scouting = DB.all('scouting-questions/answer-from-team', {
            eventKey,
            teamNumber: team,
        });

        res.stream(scouting.map((s) => JSON.stringify(s)));
    },
);

router.post(
    '/all-from-event',
    validate({
        eventKey: (v: any) => typeof v === 'string',
    }),
    (req, res) => {
        const { eventKey } = req.body;

        const teams = DB.all('teams/from-event', {
            eventKey,
        });

        res.stream(teams.map((t) => JSON.stringify(t)));
    },
);
