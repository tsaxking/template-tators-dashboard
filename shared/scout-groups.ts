import { TBAMatch } from './tba.ts';
import { TBATeam } from './tba.ts';

/**
 * Returns an array of team numbers from a match
 *
 * @param {TBAMatch} match The match to destructure
 *
 * @returns {[number, number, number, number, number, number]} The team numbers
 */
export const destructureMatch = (
    match: TBAMatch,
): [number, number, number, number, number, number] => {
    return [
        ...match.alliances.red.team_keys.map((t) => parseInt(t.substring(3))),
        ...match.alliances.blue.team_keys.map((t) => parseInt(t.substring(3))),
    ] as [number, number, number, number, number, number];
};

/**
 * Assignment of teams to scout groups and matches
 *
 * @typedef {Assignment}
 */
type Assignment = {
    groups: number[][];
    matchAssignments: number[][];
};

/**
 * Generates scout groups from a list of teams and matches
 *
 * @param {TBATeam[]} teams The teams to generate scout groups for
 * @param {TBAMatch[]} matches The matches to generate scout groups for
 *
 * @returns {Assignment} The generated assignment
 */
export const generateScoutGroups = (
    teams: TBATeam[],
    matches: TBAMatch[],
): Assignment => {
    let interferences = 0;

    // only use qualification matches
    matches = matches.filter((m) => m.comp_level === 'qm').sort((a, b) =>
        a.match_number - b.match_number
    );
    teams = teams.sort((a, b) => a.team_number - b.team_number);

    // unique teams for each scout group
    const scoutGroups: TBATeam[][] = new Array(6).fill(0).map(() =>
        new Array<TBATeam>()
    );

    const tempTeams: TBATeam[] = JSON.parse(JSON.stringify(teams));

    for (const match of matches) {
        const mTeams = destructureMatch(match);

        for (let i = 0; i < mTeams.length; i++) {
            const team = tempTeams.find((t) => t.team_number === mTeams[i]);
            if (team) {
                scoutGroups[i].push(team);
                tempTeams.splice(tempTeams.indexOf(team), 1);
            }
        }

        if (tempTeams.length === 0) break;
    }

    const conflicts = new Array(matches.length).fill(0).map(() =>
        new Array<TBATeam>()
    );

    const scoutLists = scoutGroups.map((scoutTeams, ti, ta) => {
        return matches.map((m, mi) => {
            const mTeams = destructureMatch(m);
            const teams = scoutTeams.filter((t) =>
                mTeams.includes(t.team_number)
            );

            const [t, ...rest] = teams;

            for (const r of rest) {
                conflicts[mi].push(r);
                interferences++;
            }

            return t;
        });
    });

    for (const scout of scoutLists) {
        scout.forEach((t, i) => {
            if (!t) {
                const t = conflicts[i].shift();
                if (!t) throw new Error('Failed to generate scout groups'); // should never happen
                scout[i] = t;
            }
        });
    }

    return {
        groups: scoutGroups.map((g) => g.map((t) => t.team_number)),
        matchAssignments: scoutLists.map((s) => s.map((t) => t.team_number)),
    };
};

/**
 * Status of an assignment
 *
 * @typedef {AssignmentStatus}
 */
type AssignmentStatus =
    | 'duplicate-in-group'
    | 'duplicate-between-groups'
    | 'incorrect-match-length'
    | 'missing-team-in-match'
    | 'duplicate-between-matches';

/**
 * Status of an assignment, including data
 *
 * @typedef {Status}
 */
type Status = {
    status: 'ok';
} | {
    status: 'error';
    error: Error;
} | {
    status: AssignmentStatus;
    data: any;
};

/**
 * Tests an assignment for errors
 *
 * @param {Assignment} assignment The assignment to test
 *
 * @returns {Status} The status of the assignment
 */
export const testAssignments = (assignment: Assignment): Status => {
    // ensure no duplicates in scout lists
    const { groups, matchAssignments } = assignment;

    for (let i = 0; i < groups.length; i++) {
        // ensure all teams are unique
        const teams = groups[i];
        const unique = new Set(teams);
        if (unique.size !== teams.length) {
            return {
                status: 'duplicate-in-group',
                data: {
                    group: i,
                },
            };
        }

        // ensure no duplicates between groups
        for (let j = 0; j < groups.length; j++) {
            if (i === j) continue;
            if (teams.some((t) => groups[j].includes(t))) {
                return {
                    status: 'duplicate-between-groups',
                    data: {
                        group1: i,
                        group2: j,
                    },
                };
            }
        }
    }

    // ensure all matches are the same length
    const isCorrectLength = matchAssignments.every((m) =>
        m.length === matchAssignments[0].length
    );
    if (!isCorrectLength) {
        return {
            status: 'incorrect-match-length',
            data: {
                expectedLength: matchAssignments[0].length,
                actualLengths: matchAssignments.map((m) => m.length),
            },
        };
    }

    // ensure no teams are missing from matches
    for (let i = 0; i < matchAssignments.length; i++) {
        const matches = matchAssignments[i];
        // ensure a team is populated for each match
        if (matches.some((t) => !t)) {
            return {
                status: 'missing-team-in-match',
                data: {
                    match: i,
                },
            };
        }

        for (let j = 0; j < matchAssignments.length; j++) {
            if (i === j) continue;
            if (matches.some((t, i) => matchAssignments[j][i] === t)) {
                return {
                    status: 'duplicate-between-matches',
                    data: {
                        match1: i,
                        match2: j,
                    },
                };
            }
        }
    }

    return {
        status: 'ok',
    };
};
