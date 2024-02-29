import { validate } from '../../middleware/data-type.ts';
import { Route, ServerFunction } from '../../structure/app/app.ts';
import { DB } from '../../utilities/databases.ts';
import { RetrievedMatchScouting } from '../../utilities/tables.ts';

export const router = new Route();

const pullFilter = (filter: (m: RetrievedMatchScouting) => boolean): ServerFunction<{ eventKey: string; teamNumber: number}> => {
    return async (req, res) => {
        const { eventKey, teamNumber } = req.body;

        const matchScoutingResult = await DB.all('match-scouting/from-team', {
            eventKey,
            team: teamNumber,
        });

        if (matchScoutingResult.isErr()) {
            return res.sendStatus('server:unknown-server-error');
        }

        return res.json(
            await Promise.all(
                matchScoutingResult.value
                    .filter(filter)
                    .map(async (m) => {
                        const comments = await DB.all(
                            'team-comments/from-match-scouting',
                            {
                                matchScoutingId: m.id,
                            },
                        );

                        if (comments.isErr()) {
                            return {
                                ...m,
                                comments: [],
                            };
                        } else {
                            return {
                                ...m,
                                comments: comments.value,
                            };
                        }
                    }),
            ),
        );
    }
}


router.post<{
    eventKey: string;
    teamNumber: number;
}>(
    '/from-team',
    validate({
        eventKey: 'string',
        teamNumber: 'number',
    }),
    pullFilter((m) => m.compLevel !== 'pr'),
);

router.post<{
    eventKey: string;
    teamNumber: number;
}>(
    '/practice-matches-from-team',
    validate({
        eventKey: 'string',
        teamNumber: 'number',
    }),
    pullFilter((m) => m.compLevel === 'pr'),
);