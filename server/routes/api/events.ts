import { Route } from '../../structure/app/app';
import { DB } from '../../utilities/databases';
import { validate } from '../../middleware/data-type';
import { TBA } from '../../utilities/tba/tba';
import {
    TBAMatch,
    TBATeam,
    matchSort
} from '../../../shared/submodules/tatorscout-calculations/tba';
import { RetrievedMatchScouting } from '../../utilities/tables';
import { Status } from '../../utilities/status';
import { TraceArray } from '../../../shared/submodules/tatorscout-calculations/trace';

export const router = new Route();

router.post<{
    eventKey: string;
}>(
    '/properties',
    validate({
        eventKey: 'string'
    }),
    (req, res) => {
        const p = DB.get('events/from-key', {
            eventKey: req.body.eventKey
        });
        res.json(p);
    }
);

router.post<{
    eventKey: string;
}>(
    '/status',
    validate({
        eventKey: 'string'
    }),
    async (req, res) => {
        const [matchScouting, answers, questions, pictures, teams, matches] =
            await Promise.all([
                DB.all('match-scouting/from-event', req.body),
                DB.all('scouting-questions/answers-from-event', req.body),
                DB.all('scouting-questions/questions-from-event', req.body),
                DB.all('teams/pictures-from-event', req.body),
                TBA.get<TBATeam[]>('/event/' + req.body.eventKey + '/teams'),
                TBA.get<TBAMatch[]>('/event/' + req.body.eventKey + '/matches')
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

        const picturesLeft = teamsData.filter(t => {
            return picturesData.find(p => p.teamNumber === t.team_number);
        });

        const matchesLeft = matchesData.sort(matchSort).map(m => {
            const find = (t: number): number | null => {
                // return team if not found in matchScoutingData
                return matchScoutingData.find(
                    s =>
                        s.team === t &&
                        s.matchNumber === m.match_number &&
                        s.compLevel === m.comp_level
                )
                    ? null
                    : t;
            };

            return {
                match: m.match_number,
                compLevel: m.comp_level,
                teams: [
                    ...m.alliances.blue.team_keys
                        .map(t => parseInt(t.substring(3)))
                        .map(find)
                        .filter(Boolean),
                    ...m.alliances.red.team_keys
                        .map(t => parseInt(t.substring(3)))
                        .map(find)
                        .filter(Boolean)
                ]
            };
        }) as {
            match: number;
            compLevel: string;
            teams: number[];
        }[];

        const questionsLeft = teamsData.map(t => {
            const answers = answersData.filter(
                a => a.teamNumber === t.team_number
            );
            const questions = questionsData.filter(
                q => !answers.find(a => a.questionId === q.id)
            );

            return {
                team: t.team_number,
                questions: questions.map(q => q.key)
            };
        });

        res.json({
            pictures: picturesLeft.map(t => t.team_number),
            matches: matchesLeft,
            questions: questionsLeft
        });
    }
);


router.post<{
    key: string;
}>('/summary', validate({ key: 'string' }), async (req, res) => {
    const { key } = req.body;
    const year = key.match(/\d+/)?.[0];
    if (!year) return res.sendStatus('event:invalid-key');

    const [matchScouting, teamsResult] = await Promise.all([
        DB.all('match-scouting/from-event', { eventKey: key }),
        TBA.get<TBATeam[]>('/event/' + key + '/teams')
    ]);

    if (matchScouting.isErr()) return res.sendStatus('unknown:error');
    if (teamsResult.isErr()) return res.sendStatus('unknown:error');
    if (!teamsResult.value) return res.sendStatus('tba:invalid-path');

    const teams: {
        number: number;
        traces: TraceArray[];
    }[] = teamsResult.value.map((t) => ({
        number: t.team_number,
        traces: matchScouting.value.filter((s) => s.team === t.team_number).map(s => JSON.parse(s.trace) as TraceArray)
    }));

    const returnValue: {
        title: string;
        labels: string[]; // same length as data
        data: {
            [key: number]: number[]; // same length as name
        }
    }[] = [
        {
            title: 'Autonomous Points',
            labels: ['Speaker', 'Amp', 'Mobility'],
            data: teams.reduce((acc, team) => {
                
            }, {} as { [key: number]: number[] })
        }
    ];
});