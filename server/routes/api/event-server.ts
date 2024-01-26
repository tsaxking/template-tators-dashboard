import { App, Route } from '../../structure/app/app.ts';
import env from '../../utilities/env.ts';
import { validate } from '../../middleware/data-type.ts';
import { TBA } from '../../utilities/tba/tba.ts';
import {
    TBAMatch,
    TBATeam,
} from '../../../shared/submodules/tatorscout-calculations/tba.ts';
import { generateScoutGroups } from '../../../shared/submodules/tatorscout-calculations/scout-groups.ts';
import { attemptAsync } from '../../../shared/attempt.ts';
import { TBAEvent } from '../../../shared/submodules/tatorscout-calculations/tba.ts';
import Account from '../../structure/accounts.ts';
import {
    Match,
    validateObj,
} from '../../../shared/submodules/tatorscout-calculations/match-submission.ts';
import { uuid } from '../../utilities/uuid.ts';

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
            trace
        } = req.body;

        const id = uuid();

        const traceStr = JSON.stringify(trace);
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
            }
        });

        if (result.isOk()) {
            res.json(result.value);
        } else {
            res.status(500).json({ error: result.error });
            throw result.error;
        }
    },
);

router.post(
    '/get-accounts',
    auth,
    (_req, res) => {
        const accounts = Account.all;
        res.json(accounts.map((a) => ({
            username: a.username,
            firstName: a.firstName,
            lastName: a.lastName,
            email: a.email,
        })));
    },
);

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
    (req, res) => {
        const { username, password } = req.body;
        let a = Account.fromUsername(username);
        if (!a) a = Account.fromEmail(username);

        // account does not exist
        if (!a) return res.json(false);

        res.json(a.testPassword(password));
    },
);

router.post(
    '/ping',
    auth,
    (_req, res) => {
        res.json(true);
    },
);
