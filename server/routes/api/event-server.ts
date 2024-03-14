import { App, Route } from '../../structure/app/app';
import env from '../../utilities/env';
import { validate } from '../../middleware/data-type';
import { TBA } from '../../utilities/tba/tba';
import {
    TBAMatch,
    TBATeam,
    teamsFromMatch
} from '../../../shared/submodules/tatorscout-calculations/tba';
import { generateScoutGroups } from '../../../shared/submodules/tatorscout-calculations/scout-groups';
import { attemptAsync } from '../../../shared/check';
import { TBAEvent } from '../../../shared/submodules/tatorscout-calculations/tba';
import Account from '../../structure/accounts';
import {
    Match,
    validateObj
} from '../../../shared/submodules/tatorscout-calculations/trace';
import { uuid } from '../../utilities/uuid';
import { DB } from '../../utilities/databases';
import { bigIntEncode } from '../../../shared/objects';
import Filter from 'bad-words';

export const router = new Route();

if (!env.EVENT_API_KEY) env.EVENT_API_KEY = 'test';

const auth = App.headerAuth('x-auth-key', env.EVENT_API_KEY);

router.post<Match>(
    '/submit-match',
    auth,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(validateObj as any), // TODO: export IsValid type
    async (req, res) => {
        const {
            eventKey,
            checks,
            comments,
            matchNumber,
            teamNumber,
            compLevel,
            group,
            scout,
            date,
            trace,
            preScouting
        } = req.body;

        const matchScoutingId = uuid();
        const traceStr = JSON.stringify(trace);

        if (preScouting) {
            console.log('Is prescouting');
            const matches = await TBA.get<TBAMatch[]>(
                `/event/${eventKey}/matches`
            );
            if (matches.isErr() || !matches.value)
                return res.status(500).json({ error: 'Error fetching matches' });

            console.log({ matches });

            const m = matches.value.find(
                m =>
                    m.match_number === matchNumber && m.comp_level === compLevel
            );

            if (!m) return res.status(500).json({ error: 'Match not found' });

            const [r1, r2, r3, b1, b2, b3] = teamsFromMatch(m);

            const customMatchId = uuid();

            DB.run('custom-matches/new', {
                id: customMatchId,
                eventKey,
                matchNumber,
                compLevel,
                created: Date.now(),
                name: `Prscouting match ${eventKey} ${matchNumber} for ${teamNumber}`,
                red1: r1,
                red2: r2,
                red3: r3,
                blue1: b1,
                blue2: b2,
                blue3: b3
            });

            DB.run('match-scouting/new', {
                id: matchScoutingId,
                matchId: customMatchId,
                team: teamNumber,
                scoutId: scout,
                scoutGroup: group,
                trace: traceStr,
                preScouting: +preScouting,
                time: date,
                checks: JSON.stringify(checks),
                scoutName: scout
            });

            return res.json({
                success: true
            });
        }

        const matchesRes = await DB.all('matches/from-event', {
            eventKey
        });

        if (matchesRes.isErr()) return res.status(500).json({ error: 'Error' });
        const matches = matchesRes.value;

        const m = matches.find(
            m => m.matchNumber === matchNumber && m.compLevel === compLevel
        );

        // if official match and match is not found in the tba database
        if (!m && compLevel !== 'pr') {
            return res.json({
                success: false,
                error: 'Match not found'
            });
        }

        let matchId = '';
        if (m) {
            // this is a real match
            matchId = m.id;
            // check if duplicate
            const existingRes = await DB.get('match-scouting/from-match', {
                matchId: m.id
            });

            if (existingRes.isErr()) return res.status(500).json({ error: 'Error' });

            if (existingRes.value) {
                DB.run('match-scouting/archive', {
                    content: JSON.stringify(bigIntEncode(req.body)),
                    created: Date.now(),
                    compLevel,
                    eventKey,
                    matchNumber,
                    teamNumber
                });
                return res.json({
                    success: false,
                    error: 'Match already scouted'
                });
            }
        } else {
            // this is a practice match
            matchId = uuid();
            DB.run('custom-matches/new', {
                id: matchId,
                eventKey,
                matchNumber,
                compLevel,
                created: Date.now(),
                name: `Practice match ${eventKey} ${matchNumber} for ${teamNumber}`,
                red1: teamNumber,
                red2: 0,
                red3: 0,
                blue1: 0,
                blue2: 0,
                blue3: 0
            });
        }

        let scoutId = scout;
        const s = await Account.fromUsername(scout);
        if (s) scoutId = s.id;

        DB.run('match-scouting/new', {
            id: matchScoutingId,
            matchId,
            team: teamNumber,
            scoutId,
            scoutGroup: group,
            trace: traceStr,
            preScouting: 0,
            time: date,
            checks: JSON.stringify(checks),
            scoutName: scout // in case there is no scout id
        });

        for (const [key, value] of Object.entries(comments)) {
            if (value === '') continue; // ignore empty comments
            const commentId = uuid();
            const filter = new Filter();

            const filtered = filter.clean(value);

            DB.run('team-comments/new', {
                id: commentId,
                accountId: scoutId,
                matchScoutingId,
                comment: filtered.trim(),
                type: key,
                eventKey,
                team: teamNumber,
                time: date
            });

            // socket for each comment
            // req.io.emit('team-comments:new', {
            //     id: matchId,
            //     accountId: scoutId,
            //     matchScoutingId,
            //     comment: value,
            //     type: key,
            //     eventKey,
            //     team: teamNumber,
            //     time: date,
            // });
        }

        res.json({
            success: true
        });

        req.io.emit('match-scouting:new', {
            id: matchScoutingId,
            matchId: matchId,
            team: teamNumber,
            scoutId,
            scoutGroup: group,
            trace: traceStr,
            preScouting: undefined,
            time: date,
            checks: JSON.stringify(checks),
            scoutName: scout,
            eventKey,
            matchNumber,
            compLevel
        });
    }
);

router.post<{
    eventKey: string;
}>(
    '/scout-groups',
    auth,
    validate({
        eventKey: 'string'
    }),
    async (req, res) => {
        const result = await attemptAsync(async () => {
            const [teamsRes, matchesRes, eventRes] = await Promise.all([
                TBA.get<TBATeam[]>('/event/' + req.body.eventKey + '/teams'),
                TBA.get<TBAMatch[]>('/event/' + req.body.eventKey + '/matches'),
                TBA.get<TBAEvent>('/event/' + req.body.eventKey)
            ]);

            if (teamsRes.isOk() && matchesRes.isOk() && eventRes.isOk()) {
                const teams = teamsRes.value;
                const matches = matchesRes.value;
                const event = eventRes.value;
                if (!event) throw new Error('Event not found');
                if (!teams) throw new Error('Teams not found');
                if (!matches) throw new Error('Matches not found');
                return {
                    assignments: generateScoutGroups(teams, matches),
                    teams,
                    matches,
                    eventKey: req.body.eventKey,
                    event
                };
            } else {
                throw new Error(
                    'Error fetching data from TBA ' +
                        JSON.stringify([teamsRes, matchesRes, eventRes])
                );
            }
        });

        if (result.isOk()) {
            if (!result.value) return res.sendStatus('unknown:error');
            res.json(result.value);
        } else {
            res.status(500).json({ error: result.error });
            throw result.error;
        }
    }
);

router.post<{
    username: string;
    password: string;
}>(
    '/sign-in',
    auth,
    validate({
        username: 'string',
        password: 'string'
    }),
    async (req, res) => {
        const { username, password } = req.body;
        let a = await Account.fromUsername(username);
        if (!a) a = await Account.fromEmail(username);

        // account does not exist
        if (!a) return res.json(false);

        res.json(a.testPassword(password));
    }
);

router.post('/ping', auth, (_req, res) => {
    res.json(true);
});
