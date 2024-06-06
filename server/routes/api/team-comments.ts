import Account from '../../structure/accounts';
import { Route } from '../../structure/app/app';
import { DB } from '../../utilities/databases';
import { validate } from '../../middleware/data-type';
import { uuid } from '../../utilities/uuid';
import Filter from 'bad-words';

export const router = new Route();

router.post('/*', Account.isSignedIn);

router.post<{
    teamNumber: number;
    eventKey: string;
    comment: string;
    type: string;
}>(
    '/new',
    Account.allowPermissions('comment'),
    validate({
        teamNumber: 'number',
        eventKey: 'string',
        comment: 'string',
        type: 'string'
    }),
    (req, res) => {
        const time = Date.now();
        const id = uuid();
        const { accountId } = req.session;
        const { teamNumber, eventKey, comment, type } = req.body;

        const filter = new Filter();
        if (filter.isProfane(comment)) {
            return res.sendStatus('profanity:detected');
        }

        DB.run('team-comments/new', {
            id,
            team: teamNumber,
            eventKey,
            comment,
            type,
            time,
            accountId,
            matchScoutingId: ''
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
            matchScoutingId: ''
        });
    }
);

router.post<{
    team: number;
    eventKey: string;
}>(
    '/get',
    validate({
        team: 'number',
        eventKey: 'string'
    }),
    async (req, res) => {
        const { team, eventKey } = req.body;

        const comments = await DB.all('team-comments/from-team', {
            team,
            eventKey
        });

        if (comments.isErr()) {
            return res.sendStatus('server:unknown-server-error');
        }

        res.json(comments.value);
    }
);
