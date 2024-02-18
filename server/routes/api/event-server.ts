import { App, Route } from '../../structure/app/app.ts';
import env from '../../utilities/env.ts';
import { validate } from '../../middleware/data-type.ts';
import { TBA } from '../../utilities/tba/tba.ts';
import {
    TBAMatch,
    TBATeam,
} from '../../../shared/submodules/tatorscout-calculations/tba.ts';
import { generateScoutGroups } from '../../../shared/submodules/tatorscout-calculations/scout-groups.ts';
import { attemptAsync } from '../../../shared/check.ts';
import { TBAEvent } from '../../../shared/submodules/tatorscout-calculations/tba.ts';
import Account from '../../structure/accounts.ts';
import {
    Match,
    validateObj,
} from '../../../shared/submodules/tatorscout-calculations/trace.ts';
import { uuid } from '../../utilities/uuid.ts';
import { DB } from '../../utilities/databases.ts';
import { bigIntEncode } from '../../../shared/objects.ts';

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
        } = req.body;

        const matchScoutingId = uuid();
        const traceStr = JSON.stringify(trace);

        const matchesRes = await DB.all('matches/from-event', {
            eventKey,
        });

        if (matchesRes.isErr()) return res.sendStatus('unknown:error');
        const matches = matchesRes.value;

        const m = matches.find(
            (m) => m.matchNumber === matchNumber && m.compLevel === compLevel,
        );
        if (!m) {
            return res.json({
                success: false,
                error: 'Match not found',
            });
        }

        // check if duplicate
        const existingRes = await DB.get('match-scouting/from-match', {
            matchId: m.id,
        });

        if (existingRes.isErr()) return res.sendStatus('unknown:error');

        if (existingRes.value) {
            DB.run('match-scouting/archive', {
                content: JSON.parse(bigIntEncode(req.body)),
                created: Date.now(),
                compLevel,
                eventKey,
                matchNumber,
                teamNumber,
            });
            return res.json({
                success: false,
                error: 'Match already scouted',
            });
        }

        let scoutId = '';
        const s = await Account.fromUsername(scout);
        if (s) scoutId = s.id;

        DB.run('match-scouting/new', {
            id: matchScoutingId,
            matchId: m.id,
            team: teamNumber,
            scoutId,
            scoutGroup: group,
            trace: traceStr,
            preScouting: undefined,
            time: date,
            checks: JSON.stringify(checks),
            scoutName: scout // in case there is no scout id
        });

        for (const [key, value] of Object.entries(comments)) {
            const matchId = uuid();
            DB.run('team-comments/new', {
                id: matchId,
                accountId: scoutId,
                matchScoutingId,
                comment: value,
                type: key,
                eventKey,
                team: teamNumber,
                time: date,
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
            success: true,
        });


        req.io.emit('match-scouting:new', {
            id: matchScoutingId,
            matchId: m.id,
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
            compLevel,
        });
    },
);

router.post<{
    eventKey: string;
}>(
    '/scout-groups',
    auth,
    validate({
        eventKey: 'string',
    }),
    async (req, res) => {
        const result = await attemptAsync(async () => {
            const [teamsRes, matchesRes, eventRes] = await Promise.all([
                TBA.get<TBATeam[]>('/event/' + req.body.eventKey + '/teams'),
                TBA.get<TBAMatch[]>('/event/' + req.body.eventKey + '/matches'),
                TBA.get<TBAEvent>('/event/' + req.body.eventKey),
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
                    event,
                };
            } else {
                throw new Error('Error fetching data from TBA ' + JSON.stringify([teamsRes, matchesRes, eventRes]))
            }
        });

        if (result.isOk()) {
            if (!result.value) return res.sendStatus('unknown:error');
            res.json(result.value);
        } else {
            res.status(500).json({ error: result.error });
            throw result.error;
        }
    },
);

router.post('/get-accounts', auth, async (_req, res) => {
    const accounts = await Account.getAll();
    res.json(
        accounts.map((a) => ({
            username: a.username,
            firstName: a.firstName,
            lastName: a.lastName,
            email: a.email,
        })),
    );
});

router.post<{
    username: string;
    password: string;
}>(
    '/sign-in',
    auth,
    validate({
        username: 'string',
        password: 'string',
    }),
    async (req, res) => {
        const { username, password } = req.body;
        let a = await Account.fromUsername(username);
        if (!a) a = await Account.fromEmail(username);

        // account does not exist
        if (!a) return res.json(false);

        res.json(a.testPassword(password));
    },
);

router.post('/ping', auth, (_req, res) => {
    res.json(true);
});
