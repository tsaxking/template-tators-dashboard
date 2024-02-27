import { validate } from '../../middleware/data-type.ts';
import { Route } from '../../structure/app/app.ts';
import { DB } from '../../utilities/databases.ts';
import { fileStream } from '../../middleware/stream.ts';
import Account from '../../structure/accounts.ts';
import { readDir } from '../../utilities/files.ts';
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

        res.stream(comments.value);
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

        res.json(scouting.value);
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

router.post<{
    teamNumber: number;
    eventKey: string;
}>(
    '/get-pictures',
    validate({
        teamNumber: 'number',
        eventKey: 'string',
    }),
    async (req, res) => {
        const { teamNumber, eventKey } = req.body;

        const pictures = await DB.all('teams/get-pictures', {
            eventKey,
            teamNumber,
        });

        if (pictures.isErr()) return res.sendStatus('unknown:error');

        const uploads = await readDir('storage/uploads');

        if (uploads.isErr()) return res.sendStatus('unknown:error');

        const files = uploads.value.map((f) => f.name);

        res.json(pictures.value.filter((p) => files.includes(p.picture)));
    },
);

router.post<{
    eventKey: string;
    teamNumber: number;
}>(
    '/upload-pictures',
    validate({
        eventKey: 'string',
        teamNumber: 'number',
    }),
    Account.isSignedIn,
    Account.allowPermissions('submitScoutingAnswers'),
    fileStream({
        maxFiles: 10,
        maxFileSize: 5 * 1024 * 1024, // 5MB
    }),
    async (req, res) => {
        const { files } = req;
        const { eventKey, teamNumber } = req.body;
        const { accountId } = req.session;

        if (!accountId) return res.sendStatus('unknown:error');

        if (!files) return res.sendStatus('unknown:error');
        const time = Date.now();

        const results = await Promise.all(
            files.map(async (f) => {
                const { id } = f;
                return DB.run('teams/new-picture', {
                    eventKey,
                    teamNumber,
                    picture: id,
                    accountId,
                    time,
                });
            }),
        );

        if (results.some((r) => r.isErr())) {
            return res.sendStatus('unknown:error');
        }

        res.sendStatus('teams:pictures-uploaded');

        req.io.emit(
            'teams:pictures-uploaded',
            files.map((f) => ({
                eventKey,
                teamNumber,
                picture: f.id,
                accountId,
                time,
            })),
        );
    },
);
