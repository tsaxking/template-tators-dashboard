import { validate } from '../../middleware/data-type';
import { Route } from '../../structure/app/app';
import { DB } from '../../utilities/databases';

export const router = new Route();

router.post<{
    eventKey: string;
    teamNumber: number;
}>(
    '/from-team',
    validate({
        eventKey: 'string',
        teamNumber: 'number'
    }),
    async (req, res) => {
        const { eventKey, teamNumber } = req.body;

        const matchScoutingResult = await DB.all('match-scouting/from-team', {
            eventKey,
            team: teamNumber
        });

        if (matchScoutingResult.isErr()) {
            return res.sendStatus('server:unknown-server-error');
        }

        return res.json(
            await Promise.all(
                matchScoutingResult.value
                    .filter(m => m.compLevel !== 'pr')
                    .map(async m => {
                        const comments = await DB.all(
                            'team-comments/from-match-scouting',
                            {
                                matchScoutingId: m.id
                            }
                        );

                        if (comments.isErr()) {
                            return {
                                ...m,
                                comments: []
                            };
                        } else {
                            return {
                                ...m,
                                comments: comments.value
                            };
                        }
                    })
            )
        );
    }
);

router.post<{
    eventKey: string;
    teamNumber: number;
}>(
    '/practice-matches-from-team',
    validate({
        eventKey: 'string',
        teamNumber: 'number'
    }),
    async (req, res) => {
        const { eventKey, teamNumber } = req.body;

        const result = await DB.all('match-scouting/team-custom-match', {
            team: teamNumber,
            eventKey
        });

        if (result.isErr()) {
            return res.sendStatus('server:unknown-server-error');
        }

        return res.json(
            await Promise.all(
                result.value.map(async m => {
                    const comments = await DB.all(
                        'team-comments/from-match-scouting',
                        {
                            matchScoutingId: m.id
                        }
                    );

                    if (comments.isErr()) {
                        return {
                            ...m,
                            comments: []
                        };
                    } else {
                        return {
                            ...m,
                            comments: comments.value
                        };
                    }
                })
            )
        );
    }
);

router.post<{
    eventKey: string;
    teamNumber: number;
}>(
    '/pre-from-team',
    validate({
        eventKey: 'string',
        teamNumber: 'number'
    }),
    async (req, res) => {

        const { eventKey, teamNumber } = req.body;
        const result = await DB.all('match-scouting/teams-pre-scouting', {
            team: teamNumber,
            eventKey
        });

        if (result.isErr()) {
            return res.sendStatus('server:unknown-server-error');
        }

        return res.json(
            await Promise.all(
                result.value.map(async m => {
                    const comments = await DB.all(
                        'team-comments/from-match-scouting',
                        {
                            matchScoutingId: m.id
                        }
                    );

                    if (comments.isErr()) {
                        return {
                            ...m,
                            comments: []
                        };
                    } else {
                        return {
                            ...m,
                            comments: comments.value
                        };
                    }
                })
            )
        );
    }
);

// TODO: migrate prescouting