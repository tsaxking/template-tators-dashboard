import Account from '../../structure/accounts.ts';
import { Route } from '../../structure/app/app.ts';
import { DB } from '../../utilities/databases.ts';
import { validate } from '../../middleware/data-type.ts';
import { attemptAsync } from '../../../shared/check.ts';
import { uuid } from '../../utilities/uuid.ts';


export const router = new Route();

router.post(Account.isSignedIn);

router.post<{
    id: string,
    comment: string,
    accountId: string | undefined,
    team: number,
    type: 'match' | 'dashboard',
    matchScoutingId: string,
    eventKey: string,
    time: number
}>(
    '/new-comment',
    validate({
        id: 'string',
        comment: 'string',
        accountId: 'string',
        team: 'number',
        matchScoutingId: 'string',
        eventKey: 'string',
        time: 'number'
    }),
    (req, res) => {
        const time = Date.now();
        const id = uuid();
        const {matchScoutingId, team, comment, eventKey, type} = req.body;

        const { accountId } = req.session;
        if (!accountId) return res.sendStatus('account:not-logged-in');

        const str = JSON.stringify(comment);

        DB.run('team-comments/new', {
            id, 
            team, 
            comment: str, 
            type, 
            matchScoutingId, 
            accountId, 
            time, 
            eventKey
        });
        res.sendStatus('team-comment:new', {
            id, 
            team, 
            comment: str, 
            type, 
            matchScoutingId, 
            accountId, 
            time, 
            eventKey
        });
        req.io.emit('team-comment:new', {
            id, 
            team, 
            comment: str, 
            type, 
            matchScoutingId, 
            accountId, 
            time, 
            eventKey
        });
    }
);

router.post<{
    team: number;
    eventKey: string;
}>(
    '/get-team-comments',
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