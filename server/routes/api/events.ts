import { Route } from '../../structure/app/app.ts';
import { DB } from '../../utilities/databases.ts';
import { validate } from '../../middleware/data-type.ts';
import { string } from 'https://esm.sh/v132/postcss-selector-parser@6.0.13/denonext/postcss-selector-parser.mjs';
import { TBA } from '../../utilities/tba/tba.ts';
import {
    TBAMatch,
    TBATeam,
} from '../../../shared/submodules/tatorscout-calculations/tba.ts';

export const router = new Route();

router.post<{
    eventKey: string;
}>(
    '/properties',
    validate({
        eventKey: 'string',
    }),
    (req, res) => {
        const p = DB.get('events/from-key', {
            eventKey: req.body.eventKey,
        });
        res.json(p);
    },
);

router.post<{
    eventKey: string;
}>(
    '/checklist',
    validate({
        eventKey: 'string',
    }),
    async (req, res) => {},
);

router.post<{
    eventKey: string;
}>(
    '/status',
    validate({
        eventKey: 'string',
    }),
    async (req, res) => {
        const [matchScouting, answers, questions, pictures, teams, matches] =
            await Promise.all([
                DB.all('match-scouting/from-event', req.body),
                DB.all('scouting-questions/answers-from-event', req.body),
                DB.all('scouting-questions/questions-from-event', req.body),
                DB.all('teams/pictures-from-event', req.body),
                TBA.get<TBATeam[]>('/event/' + req.body.eventKey + '/teams'),
                TBA.get<TBAMatch[]>('/event/' + req.body.eventKey + '/matches'),
            ]);

        if (matchScouting.isErr()) return res.sendStatus('unknown:error');
        if (answers.isErr()) return res.sendStatus('unknown:error');
        if (questions.isErr()) return res.sendStatus('unknown:error');
        if (pictures.isErr()) return res.sendStatus('unknown:error');
        if (teams.isErr()) return res.sendStatus('unknown:error');
        if (matches.isErr()) return res.sendStatus('unknown:error');

        const matchScoutingData = matchScouting.value;
        const answersData = answers.value;
        const questionsData = questions.value;
        const picturesData = pictures.value;
        const teamsData = teams.value;
        const matchesData = matches.value;

        if (!teamsData) return res.sendStatus('tba:invalid-path');
        if (!matchesData) return res.sendStatus('tba:invalid-path');

        const picturesLeft = teamsData.filter((t) => {
            return !picturesData.find((p) => p.teamNumber === t.team_number);
        });

        const matchesLeft = matchesData.map((m) => {
            const find = (t: number): number | null => {
                // return team if not found in matchScoutingData
                return matchScoutingData.find(
                        (s) =>
                            s.team === t &&
                            s.matchNumber === m.match_number &&
                            s.compLevel === m.comp_level,
                    )
                    ? null
                    : t;
            };

            return {
                match: m.match_number,
                compLevel: m.comp_level,
                teams: [
                    ...m.alliances.blue.team_keys
                        .map((t) => parseInt(t.substring(3)))
                        .map(find)
                        .filter(Boolean),
                    ...m.alliances.red.team_keys
                        .map((t) => parseInt(t.substring(3)))
                        .map(find)
                        .filter(Boolean),
                ],
            };
        }) as {
            match: number;
            compLevel: string;
            teams: number[];
        }[];

        const questionsLeft = teamsData.map((t) => {
            return {
                team: t.team_number,
                questions: questionsData
                    .filter(
                        (q) =>
                            !answersData.find(
                                (a) =>
                                    a.teamNumber === t.team_number &&
                                    a.questionId === q.id,
                            ),
                    )
                    .map((q) => q.key),
            };
        });

        res.json({
            pictures: picturesLeft,
            matches: matchesLeft,
            questions: questionsLeft,
        });
    },
);
