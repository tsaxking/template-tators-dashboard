import { App, Route } from '../../structure/app/app';
import env from '../../utilities/env';
import { validate } from '../../middleware/data-type';
import { TBA } from '../../utilities/tba/tba';
import {
    TBAMatch,
    TBATeam
} from '../../../shared/submodules/tatorscout-calculations/tba';
import { generateScoutGroups } from '../../../shared/submodules/tatorscout-calculations/scout-groups';
import { attemptAsync } from '../../../shared/check';
import { TBAEvent } from '../../../shared/submodules/tatorscout-calculations/tba';
import Account from '../../structure/accounts';
import {
    Match as MatchObject,
    validateObj
} from '../../../shared/submodules/tatorscout-calculations/trace';
import { CustomMatch } from '../../structure/cache/custom-matches';
import { MatchScouting } from '../../structure/cache/match-scouting';
import { Match } from '../../structure/cache/matches';
import { TeamComment } from '../../structure/cache/team-comments';
import { Potato } from '../../structure/cache/potato';

export const router = new Route();

if (!env.EVENT_API_KEY) env.EVENT_API_KEY = 'test';

const auth = App.headerAuth('x-auth-key', env.EVENT_API_KEY);

router.post<MatchObject>(
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
            trace,
            preScouting
        } = req.body;
        const { stringify } = JSON;

        const addComments = (ms: MatchScouting) =>
            attemptAsync(async () => {
                const allComments = Object.entries(comments);
                for (let i = 0; i < allComments.length; i++) {
                    const [type, comment] = allComments[i];
                    (
                        await TeamComment.new({
                            team: teamNumber,
                            comment,
                            type,
                            matchScoutingId: ms.id,
                            accountId: ms.scoutId,
                            eventKey
                        })
                    ).unwrap();
                }
            });

        // award 100 potato chips to the scout
        const award = () => {
            return attemptAsync(async () => {
                const potato = (await Potato.fromUsername(scout)).unwrap();
                if (!potato) return;
                potato.give(100);
            });
        };

        const account = await Account.fromUsername(scout);
        const scoutId = account ? account.id : scout;

        if (preScouting) {
            // build a custom match
            const cm = await CustomMatch.new({
                eventKey,
                matchNumber,
                compLevel,
                red1: teamNumber,
                red2: 0,
                red3: 0,
                red4: 0,
                blue1: 0,
                blue2: 0,
                blue3: 0,
                blue4: 0,
                name: `Prescouting for ${teamNumber} in ${compLevel} ${matchNumber} at ${eventKey}`
            });

            if (cm.isErr()) return res.status(500).json({ error: cm.error });

            const ms = await MatchScouting.new({
                matchId: cm.value.id,
                team: teamNumber,
                scoutId,
                scoutGroup: group || 0,
                trace: stringify(trace),
                checks: stringify(checks),
                preScouting: 1,
                eventKey,
                matchNumber,
                compLevel
            });

            if (ms.isErr()) return res.status(500).json({ error: ms.error });

            award();

            const c = await addComments(ms.value);
            if (c.isErr()) return res.status(500).json({ error: c.error });

            return res.json({
                success: true
            });
        }

        if (compLevel === 'pr') {
            // practice match
            const cm = await CustomMatch.new({
                eventKey,
                matchNumber,
                compLevel,
                red1: teamNumber,
                red2: 0,
                red3: 0,
                red4: 0,
                blue1: 0,
                blue2: 0,
                blue3: 0,
                blue4: 0,
                name: `Practice Match ${matchNumber} for ${teamNumber} at ${eventKey}`
            });

            if (cm.isErr()) return res.status(500).json({ error: cm.error });

            const ms = await MatchScouting.new({
                matchId: cm.value.id,
                team: teamNumber,
                scoutId,
                scoutGroup: group || 0,
                trace: stringify(trace),
                checks: stringify(checks),
                preScouting: 0,
                eventKey,
                matchNumber,
                compLevel
            });

            if (ms.isErr()) return res.status(500).json({ error: ms.error });
            award();
            const c = await addComments(ms.value);
            if (c.isErr()) return res.status(500).json({ error: c.error });

            return res.json({
                success: true
            });
        }

        // official match

        const matches = await Match.fromEvent(eventKey);
        if (matches.isErr())
            return res.status(500).json({ error: matches.error });

        const match = matches.value.find(
            m => m.matchNumber === matchNumber && m.compLevel === compLevel
        );

        if (!match) {
            return res.status(404).json({
                error: 'Match not found'
            });
        }

        const exists = await MatchScouting.fromMatch(match.id);
        if (exists.isErr())
            return res.status(500).json({ error: exists.error });

        const found = exists.value.find(m => m.team === teamNumber);

        if (found) {
            // assume rescouting, overwrite old data
            const ms = await MatchScouting.new(
                {
                    matchId: match.id,
                    team: teamNumber,
                    scoutId,
                    scoutGroup: group || 0,
                    trace: stringify(trace),
                    checks: stringify(checks),
                    preScouting: 0,
                    eventKey,
                    matchNumber,
                    compLevel
                },
                true
            );
            if (ms.isErr()) return res.status(500).json({ error: ms.error });
            award();
            const c = await addComments(ms.value);
            if (c.isErr()) return res.status(500).json({ error: c.error });

            return res.json({
                success: true,
                overwrite: true
            });
        }

        const ms = await MatchScouting.new({
            matchId: match.id,
            team: teamNumber,
            scoutId,
            scoutGroup: group || 0,
            trace: stringify(trace),
            checks: stringify(checks),
            preScouting: 0,
            eventKey,
            matchNumber,
            compLevel
        });

        if (ms.isErr()) return res.status(500).json({ error: ms.error });
        award();
        const c = await addComments(ms.value);
        if (c.isErr()) return res.status(500).json({ error: c.error });

        res.json({
            success: true
        });

        req.io.emit('match-scouting:new', ms);
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
