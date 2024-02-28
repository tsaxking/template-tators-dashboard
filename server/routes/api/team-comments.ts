import Account from '../../structure/accounts.ts';
import { Route } from '../../structure/app/app.ts';
import { DB } from '../../utilities/databases.ts';
import { validate } from '../../middleware/data-type.ts';
import { attemptAsync } from '../../../shared/check.ts';
import { uuid } from '../../utilities/uuid.ts';

export const router = new Route();

router.post(Account.isSignedIn);

router.post<{
    teamNumber: number;
    eventKey: string;
    comment: string;
    type: string;
}>(
    '/new',
    validate({
        teamNumber: 'number',
        eventKey: 'string',
        comment: 'string',
        type: 'string',
    }),
    (req, res) => {
        const time = Date.now();
        const id = uuid();
        const { accountId } = req.session;
        const { teamNumber, eventKey, comment, type } = req.body;

        DB.run('team-comments/new', {
            id,
            team: teamNumber,
            eventKey,
            comment,
            type,
            time,
            accountId,
            matchScoutingId: '',
        });

        res.sendStatus('team-comment:new');

        req.io.emit('team-comment:new', {
            id,
            team: teamNumber,
            eventKey,
            comment,
            type,
            time,
            accountId,
            matchScoutingId: '',
        });
    },
);

router.post<{
    team: number;
    eventKey: string;
}>(
    '/get',
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

        if (comments.isErr()) {
            return res.sendStatus('server:unknown-server-error');
        }

        res.json(comments.value);
    },
);
