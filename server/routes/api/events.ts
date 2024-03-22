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
import {
    Trace,
    TraceArray
} from '../../../shared/submodules/tatorscout-calculations/trace';

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
    eventKey: string;
}>('/summary', validate({ eventKey: 'string' }), async (req, res) => {
    const { eventKey } = req.body;
    const year = Number(eventKey.match(/\d+/)?.[0]);
    if (!year) return res.sendStatus('event:invalid-key');

    if (!Trace.builtYears.includes(year))
        return res.sendStatus('trace:year-not-supported');

    const [matchScouting, teamsResult, matchesResult] = await Promise.all([
        DB.all('match-scouting/from-event', { eventKey: eventKey }),
        TBA.get<TBATeam[]>('/event/' + eventKey + '/teams'),
        TBA.get<TBAMatch[]>('/event/' + eventKey + '/matches')
    ]);

    if (matchScouting.isErr()) {console.error(matchScouting.error); return res.sendStatus('unknown:error');}
    if (teamsResult.isErr()) {console.error(teamsResult.error); return res.sendStatus('unknown:error');}
    if (!teamsResult.value) return res.sendStatus('tba:invalid-path');
    if (matchesResult.isErr()) {console.error(matchesResult.error); return res.sendStatus('unknown:error');}
    if (!matchesResult.value) return res.sendStatus('tba:invalid-path');

    const matches = matchesResult.value.sort(matchSort);

    const teams: {
        number: number;
        traces: { trace: TraceArray; alliance: 'red' | 'blue' }[];
    }[] = teamsResult.value.map(t => ({
        number: t.team_number,
        traces: matchScouting.value
            .filter(s => s.team === t.team_number)
            .map(s => {
                const match = matches.find(
                    m =>
                        m.match_number === s.matchNumber &&
                        m.comp_level === s.compLevel
                );
                return {
                    trace: JSON.parse(s.trace) as TraceArray,
                    alliance: match?.alliances.blue.team_keys.includes(
                        'frc' + t.team_number
                    )
                        ? 'blue'
                        : 'red'
                };
            })
    }));

    const data = teams.map(t => {
        return {
            number: t.number,
            // TODO: type strict this
            data: Trace.yearInfo[
                year as keyof typeof Trace.yearInfo
            ]?.summarize(t.traces)
        };
    });

    const returnData: {
        labels: string[];
        title: string;
        data: {
            [key: number]: number[];
        };
    }[] = [];

    const [team] = data;

    if (team) {
        returnData.push(
            ...team.data.map(d => ({
                title: d.title,
                labels: d.labels,
                data: {}
            }))
        );
    }

    for (const team of data) {
        for (const d of team.data) {
            const found = returnData.find(r => r.title === d.title);
            if (!found) continue;
            found.data[team.number] = d.data;
        }
    }

    res.json(returnData);
});
