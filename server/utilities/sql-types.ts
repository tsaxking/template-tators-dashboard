// This file is used to typesafe queries to the database
// The array is the parameters for the query, and the second parameter is the return type

import { __root } from './env.ts';
import {
    Account,
    AccountSettings,
    Member,
    MembershipStatus,
    Role,
    RolePermission,
} from '../../shared/db-types.ts';
import { SessionObj } from '../structure/sessions.ts';
import {
    Alliance,
    Checklist,
    CheckListAssignment,
    ChecklistQuestion,
    CompLevel,
    CustomMatch,
    DiscordPair,
    Event,
    Match,
    QuestionHistory,
    RetrievedMatchScouting,
    RetrievedScoutingAnswer,
    ScoutingQuestion,
    ScoutingQuestionGroup,
    ScoutingSection,
    Strategy,
    TBARequest,
    Team,
    TeamComment,
    Whiteboard,
} from '../../shared/db-types-extended.ts';
import { ScoutingAnswer } from '../../shared/db-types-extended.ts';

export type Queries = {
    // ▄▀▀ ██▀ ▄▀▀ ▄▀▀ █ ▄▀▄ █▄ █ ▄▀▀
    // ▄█▀ █▄▄ ▄█▀ ▄█▀ █ ▀▄▀ █ ▀█ ▄█▀

    'sessions/delete': [
        [
            {
                id: string;
            },
        ],
        unknown,
    ];
    'sessions/delete-all': [[], unknown];
    'sessions/update': [
        [
            {
                id: string;
                ip: string;
                latestActivity: number;
                accountId: string;
                userAgent: string;
                requests: number;
                prevUrl: string;
            },
        ],
        unknown,
    ];
    'sessions/all': [[], SessionObj];
    'sessions/get': [
        [
            {
                id: string;
            },
        ],
        SessionObj,
    ];
    'sessions/new': [
        [
            {
                id: string;
                ip: string;
                latestActivity: number;
                accountId: string;
                userAgent: string;
                prevUrl: string;
                requests: number;
                created: number;
            },
        ],
        unknown,
    ];

    // █▀▄ ██▄
    // █▄▀ █▄█
    'db/get-version': [
        [],
        {
            major: number;
            minor: number;
            patch: number;
        },
    ];

    // █▀▄ ▄▀▄ █   ██▀ ▄▀▀
    // █▀▄ ▀▄▀ █▄▄ █▄▄ ▄█▀
    'roles/from-id': [
        [
            {
                id: string;
            },
        ],
        Role,
    ];
    'roles/from-name': [
        [
            {
                name: string;
            },
        ],
        Role,
    ];
    'roles/all': [[], Role];
    'permissions/from-role': [
        [
            {
                role: string;
            },
        ],
        RolePermission,
    ];

    // ▄▀▄ ▄▀▀ ▄▀▀ ▄▀▄ █ █ █▄ █ ▀█▀ ▄▀▀
    // █▀█ ▀▄▄ ▀▄▄ ▀▄▀ ▀▄█ █ ▀█  █  ▄█▀
    'account/from-username': [
        [
            {
                username: string;
            },
        ],
        Account,
    ];
    'account/from-email': [
        [
            {
                email: string;
            },
        ],
        Account,
    ];
    'account/from-verification-key': [
        [
            {
                verification: string;
            },
        ],
        Account,
    ];
    'account/from-password-change': [
        [
            {
                passwordChange: string;
            },
        ],
        Account,
    ];
    'account/unverified': [[], Account];
    'account/all': [[], Account];
    'account/new': [
        [
            {
                id: string;
                username: string;
                key: string;
                salt: string;
                firstName: string;
                lastName: string;
                email: string;
                verified: 0 | 1;
                verification: string;
                created: number;
                phoneNumber: string;
            },
        ],
        unknown,
    ];
    'account/save-settings': [[AccountSettings], unknown];
    'account/get-settings': [
        [
            {
                accountId: string;
            },
        ],
        AccountSettings,
    ];
    'account/unverify': [
        [
            {
                id: string;
            },
        ],
        unknown,
    ];
    'account/delete': [
        [
            {
                id: string;
            },
        ],
        unknown,
    ];
    'account/from-id': [
        [
            {
                id: string;
            },
        ],
        Account,
    ];
    'account/change-email': [
        [
            {
                id: string;
                email: string;
            },
        ],
        unknown,
    ];
    'account/verify': [
        [
            {
                id: string;
            },
        ],
        unknown,
    ];
    'account/set-verification': [
        [
            {
                id: string;
                verification: string;
            },
        ],
        unknown,
    ];
    'account/roles': [
        [
            {
                id: string;
            },
        ],
        Role,
    ];
    'account/add-role': [
        [
            {
                accountId: string;
                roleId: string;
            },
        ],
        unknown,
    ];
    'account/remove-role': [
        [
            {
                accountId: string;
                roleId: string;
            },
        ],
        unknown,
    ];
    'account/update-picture': [
        [
            {
                id: string;
                picture: string;
            },
        ],
        unknown,
    ];
    'account/change-username': [
        [
            {
                id: string;
                username: string;
            },
        ],
        unknown,
    ];
    'account/request-email-change': [
        [
            {
                id: string;
                emailChange: string;
            },
        ],
        unknown,
    ];
    'account/change-password': [
        [
            {
                id: string;
                salt: string;
                key: string;
                passwordChange: null;
            },
        ],
        unknown,
    ];
    'account/request-password-change': [
        [
            {
                id: string;
                passwordChange: string;
            },
        ],
        unknown,
    ];
    'account/from-discord-id': [
        [
            {
                discordId: string;
            },
        ],
        Account,
    ];
    'account/set-discord-id': [
        [
            {
                discordId: string;
                id: string;
            },
        ],
        unknown,
    ];

    // █▀▄ █ ▄▀▀ ▄▀▀ ▄▀▄ █▀▄ █▀▄
    // █▄▀ █ ▄█▀ ▀▄▄ ▀▄▀ █▀▄ █▄▀
    'discord/get': [
        [
            {
                key: string;
            },
        ],
        DiscordPair,
    ];
    'discord/insert': [
        [
            {
                key: string;
                id: string;
                date: string;
            },
        ],
        unknown,
    ];
    'discord/delete': [
        [
            {
                key: string;
            },
        ],
        unknown,
    ];

    // █▄ ▄█ ██▀ █▄ ▄█ ██▄ ██▀ █▀▄ ▄▀▀
    // █ ▀ █ █▄▄ █ ▀ █ █▄█ █▄▄ █▀▄ ▄█▀

    'member/from-username': [
        [
            {
                username: string;
            },
        ],
        Member,
    ];
    'member/all': [[], Member];
    'member/update-status': [
        [
            {
                status: MembershipStatus;
                id: string;
            },
        ],
        unknown,
    ];
    'member/new': [
        [
            {
                id: string;
                status: MembershipStatus;
            },
        ],
        unknown,
    ];
    'member/delete': [
        [
            {
                id: string;
            },
        ],
        unknown,
    ];
    'member/update-bio': [
        [
            {
                id: string;
                bio: string;
            },
        ],
        unknown,
    ];
    'member/update-title': [
        [
            {
                id: string;
                title: string;
            },
        ],
        unknown,
    ];
    'member/update-resume': [
        [
            {
                id: string;
                resume: string;
            },
        ],
        unknown,
    ];
    'member/add-to-board': [
        [
            {
                id: string;
            },
        ],
        unknown,
    ];
    'member/remove-from-board': [
        [
            {
                id: string;
            },
        ],
        unknown,
    ];

    // ██▀ █ █ ██▀ █▄ █ ▀█▀ ▄▀▀
    // █▄▄ ▀▄▀ █▄▄ █ ▀█  █  ▄█▀
    'events/new-event': [
        [
            {
                eventKey: string;
                flipX: boolean;
                flipY: boolean;
            },
        ],
        unknown,
    ];
    'events/delete-event': [
        [
            {
                eventKey: string;
            },
        ],
        unknown,
    ];
    'events/from-key': [
        [
            {
                eventKey: string;
            },
        ],
        Event,
    ];
    'events/all-alliances': [
        [
            {
                eventKey: string;
            },
        ],
        Alliance,
    ];
    'events/delete-alliance': [
        [
            {
                id: string;
            },
        ],
        unknown,
    ];
    'events/new-alliance': [
        [
            {
                id: string;
                eventKey: string;
                name: string;
                team1: number;
                team2: number;
                team3: number;
            },
        ],
        unknown,
    ];

    // ▀█▀ ██▀ ▄▀▄ █▄ ▄█ ▄▀▀
    //  █  █▄▄ █▀█ █ ▀ █ ▄█▀
    'teams/from-event': [
        [
            {
                eventKey: string;
            },
        ],
        Team,
    ];
    'teams/new': [
        [
            {
                number: number;
                watchPriority: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
                eventKey: string;
            },
        ],
        unknown,
    ];

    // █▄ ▄█ ▄▀▄ ▀█▀ ▄▀▀ █▄█ ██▀ ▄▀▀
    // █ ▀ █ █▀█  █  ▀▄▄ █ █ █▄▄ ▄█▀
    'matches/from-event': [
        [
            {
                eventKey: string;
            },
        ],
        Match,
    ];
    'matches/new': [
        [
            {
                id: string;
                eventKey: string;
                matchNumber: number;
                compLevel: CompLevel;
            },
        ],
        unknown,
    ];
    'matches/from-id': [
        [
            {
                id: string;
            },
        ],
        Match,
    ];

    // ▄▀▀ █ █ ▄▀▀ ▀█▀ ▄▀▄ █▄ ▄█    █▄ ▄█ ▄▀▄ ▀█▀ ▄▀▀ █▄█ ██▀ ▄▀▀
    // ▀▄▄ ▀▄█ ▄█▀  █  ▀▄▀ █ ▀ █    █ ▀ █ █▀█  █  ▀▄▄ █ █ █▄▄ ▄█▀
    'custom-matches/from-event': [
        [
            {
                eventKey: string;
            },
        ],
        CustomMatch,
    ];
    'custom-matches/new': [
        [
            {
                id: string;
                eventKey: string;
                matchNumber: number;
                compLevel: CompLevel;
                red1: number;
                red2: number;
                red3: number;
                blue1: number;
                blue2: number;
                blue3: number;
            },
        ],
        unknown,
    ];
    'custom-matches/from-id': [
        [
            {
                id: string;
            },
        ],
        Match,
    ];

    // █   █ █▄█ █ ▀█▀ ██▀ ██▄ ▄▀▄ ▄▀▄ █▀▄ █▀▄ ▄▀▀
    // ▀▄▀▄▀ █ █ █  █  █▄▄ █▄█ ▀▄▀ █▀█ █▀▄ █▄▀ ▄█▀

    'whiteboards/change-custom-match': [
        [
            {
                id: string;
                customMatchId: string;
            },
        ],
        unknown,
    ];
    'whiteboards/change-match': [
        [
            {
                id: string;
                matchId: string;
            },
        ],
        unknown,
    ];
    'whiteboards/from-custom-match': [
        [
            {
                customMatchId: string;
            },
        ],
        Whiteboard,
    ];
    'whiteboards/from-match': [
        [
            {
                matchId: string;
            },
        ],
        Whiteboard,
    ];
    'whiteboards/from-event': [
        [
            {
                eventKey: string;
            },
        ],
        Whiteboard,
    ];
    'whiteboards/from-id': [
        [
            {
                id: string;
            },
        ],
        Whiteboard,
    ];
    'whiteboards/new': [
        [
            {
                id: string;
                eventKey: string;
                name: string;
                matchId: string | null;
                customMatchId: string | null;
                board: string; // json array
            },
        ],
        unknown,
    ];
    'whiteboards/update-board': [
        [
            {
                id: string;
                board: string;
            },
        ],
        unknown,
    ];
    'whiteboards/update-name': [
        [
            {
                id: string;
                name: string;
            },
        ],
        unknown,
    ];
    'whiteboards/delete': [
        [
            {
                id: string;
            },
        ],
        unknown,
    ];

    // █▄ ▄█ ▄▀▄ ▀█▀ ▄▀▀ █▄█ ▄▀▀ ▄▀▀ ▄▀▄ █ █ ▀█▀ █ █▄ █ ▄▀
    // █ ▀ █ █▀█  █  ▀▄▄ █ █ ▄█▀ ▀▄▄ ▀▄▀ ▀▄█  █  █ █ ▀█ ▀▄█

    'match-scouting/new': [
        [
            {
                id: string;
                matchId: string;
                team: number;
                scoutId: string;
                scoutGroup: 0 | 1 | 2 | 3 | 4 | 5;
                time: string;
                preScouting: null;
                trace: string; // json array
                checks: string; // json array
            },
        ],
        unknown,
    ];
    'match-scouting/from-id': [
        [
            {
                id: string;
            },
        ],
        RetrievedMatchScouting,
    ];
    'match-scouting/from-match': [
        [
            {
                matchId: string;
            },
        ],
        RetrievedMatchScouting,
    ];
    'match-scouting/from-team': [
        [
            {
                team: number;
                eventKey: string;
            },
        ],
        RetrievedMatchScouting,
    ];
    'match-scouting/from-scout': [
        [
            {
                scoutId: string;
                eventKey: string;
            },
        ],
        RetrievedMatchScouting,
    ];
    'match-scouting/from-scout-group': [
        [
            {
                scoutGroup: string;
                eventKey: string;
            },
        ],
        RetrievedMatchScouting,
    ];
    'match-scouting/from-event': [
        [
            {
                eventKey: string;
            },
        ],
        RetrievedMatchScouting,
    ];
    'match-scouting/update': [
        [
            {
                id: string;
                matchId: string;
                team: number;
                scoutId: string;
                scoutGroup: string;
                time: string;
                preScouting: null;
                trace: string; // json array
                checks: string; // json array
            },
        ],
        unknown,
    ];

    // // █▄ ▄█ ▄▀▄ ▀█▀ ▄▀▀ █▄█ ▄▀▀ ▄▀▄ █▄ ▄█ █▄ ▄█ ██▀ █▄ █ ▀█▀ ▄▀▀
    // // █ ▀ █ █▀█  █  ▀▄▄ █ █ ▀▄▄ ▀▄▀ █ ▀ █ █ ▀ █ █▄▄ █ ▀█  █  ▄█▀
    'team-comments/new': [
        [{
            id: string;
            team: number;
            comment: string;
            type: string;
            matchScoutingId: string | null;
            accountId: string | null;
            time: string;
            eventKey: string;
        }],
        unknown,
    ];
    'team-comments/update': [
        [{
            team: number;
            comment: string;
            type: string;
            matchScoutingId: string | null;
            accountId: string | null;
            time: string;
            eventKey: string;
            id: string;
        }],
        unknown,
    ];
    'team-comments/from-event': [
        [{
            eventKey: string;
        }],
        TeamComment,
    ];
    'team-comments/from-team': [
        [{
            team: number;
            eventKey: string;
        }],
        TeamComment,
    ];
    'team-comment/from-match-scouting': [
        [{
            matchScoutingId: string | null;
        }],
        TeamComment,
    ];
    'team-comment/from-account': [
        [{
            accountId: string | null;
        }],
        TeamComment,
    ];
    'team-comment/delete': [
        [{
            id: string;
        }],
        unknown,
    ];

    // // ▄▀▀ ▄▀▀ ▄▀▄ █ █ ▀█▀ █ █▄ █ ▄▀  ▄▀▄ █ █ ██▀ ▄▀▀ ▀█▀ █ ▄▀▄ █▄ █ ▄▀▀
    // // ▄█▀ ▀▄▄ ▀▄▀ ▀▄█  █  █ █ ▀█ ▀▄█ ▀▄█ ▀▄█ █▄▄ ▄█▀  █  █ ▀▄▀ █ ▀█ ▄█▀
    'scouting-questions/all-sections': [[], ScoutingSection];
    'scouting-questions/answer-from-team': [
        [
            {
                eventKey: string;
                teamNumber: number;
            },
        ],
        RetrievedScoutingAnswer,
    ];
    'scouting-questions/get-answer-history': [
        [{
            questionId: string;
        }],
        QuestionHistory,
    ];
    'scouting-questions/groups-from-event': [
        [
            {
                eventKey: string;
            },
        ],
        ScoutingQuestionGroup,
    ];
    'scouting-questions/new-answer': [
        [
            {
                id: string;
                questionId: string;
                answer: string;
                teamNumber: number;
                accountId: string;
                date: string;
            },
        ],
        unknown,
    ];
    'scouting-questions/new-group': [
        [
            {
                id: string;
                eventKey: string;
                section: string;
                name: string;
                accountId: string;
                dateAdded: string;
            },
        ],
        unknown,
    ];
    'scouting-questions/new-question': [
        [
            {
                id: string;
                question: string;
                type:
                    | 'text'
                    | 'number'
                    | 'boolean'
                    | 'select'
                    | 'checkbox'
                    | 'radio'
                    | 'textarea';
                section: string;
                key: string;
                description: string;
                groupId: string;
                accountId: string;
                dateAdded: string;
                options: string;
            },
        ],
        unknown,
    ];
    'scouting-questions/answer-from-id': [
        [{
            id: string;
        }],
        ScoutingAnswer,
    ];
    'scouting-questions/new-section': [
        [
            {
                name: string;
                multiple: 0 | 1;
                dateAdded: string;
                accountId: string;
                id: string;
            },
        ],
        unknown,
    ];
    'scouting-questions/questions-from-group': [
        [
            {
                groupId: string;
            },
        ],
        ScoutingQuestion,
    ];
    'scouting-questions/update-group': [
        [
            {
                id: string;
                eventKey: string;
                section: string; // section id
                name: string;
                accountId: string;
            },
        ],
        unknown,
    ];
    'scouting-questions/update-question': [
        [
            {
                id: string;
                question: string;
                type:
                    | 'text'
                    | 'number'
                    | 'boolean'
                    | 'select'
                    | 'checkbox'
                    | 'radio'
                    | 'textarea';
                key: string;
                description: string;
                groupId: string;
                accountId: string;
            },
        ],
        unknown,
    ];
    'scouting-questions/update-section': [
        [
            {
                name: string;
                multiple: 0 | 1;
                accountId: string;
                dateAdded: string;
                id: string;
            },
        ],
        unknown,
    ];
    'scouting-questions/delete-group': [
        [
            {
                id: string;
            },
        ],
        unknown,
    ];
    'scouting-questions/delete-question': [
        [
            {
                id: string;
            },
        ],
        unknown,
    ];
    'scouting-questions/delete-section': [
        [
            {
                id: string;
            },
        ],
        unknown,
    ];
    'scouting-questions/delete-answer': [
        [
            {
                id: string;
            },
        ],
        unknown,
    ];
    'scouting-questions/update-answer': [
        [
            {
                id: string;
                questionId: string;
                answer: string;
                teamNumber: number;
                accountId: string;
                date: string;
            },
        ],
        unknown,
    ];

    // // ▀█▀ ██▄ ▄▀▄ █▀▄ ██▀ ▄▀▄ █ █ ██▀ ▄▀▀ ▀█▀ ▄▀▀
    // //  █  █▄█ █▀█ █▀▄ █▄▄ ▀▄█ ▀▄█ █▄▄ ▄█▀  █  ▄█▀
    'tba/new': [
        // will auto update if already exists
        [
            {
                url: string;
                response: string; // json
                updated: number;
                update: 0 | 1;
            },
        ],
        unknown,
    ];
    'tba/from-url': [
        [
            {
                url: string;
            },
        ],
        TBARequest,
    ];

    // // ▄▀▀ █▄█ ██▀ ▄▀▀ █▄▀ █   █ ▄▀▀ ▀█▀ ▄▀▀
    // // ▀▄▄ █ █ █▄▄ ▀▄▄ █ █ █▄▄ █ ▄█▀  █  ▄█▀

    'checklists/checklist-from-event': [
        [
            {
                eventKey: string;
            },
        ],
        Checklist,
    ];
    'checklists/delete-answer': [
        [
            {
                id: string;
            },
        ],
        unknown,
    ];
    'checklists/delete-assignment': [
        [
            {
                accountId: string;
                checklistId: string;
            },
        ],
        unknown,
    ];
    'checklists/delete-checklist': [
        [
            {
                id: string;
            },
        ],
        unknown,
    ];
    'checklists/delete-question': [
        [
            {
                id: string;
            },
        ],
        unknown,
    ];
    'checklists/new-answer': [
        [
            {
                id: string;
                accountId: string;
                questionId: string;
                matchId: string;
            },
        ],
        unknown,
    ];
    'checklists/new-assignment': [
        [
            {
                checklistId: string;
                accountId: string;
            },
        ],
        unknown,
    ];
    'checklists/new-checklist': [
        [
            {
                id: string;
                name: string;
                eventKey: string;
                description: string;
            },
        ],
        unknown,
    ];
    'checklists/new-question': [
        [
            {
                id: string;
                checklistId: string;
                question: string;
                interval: number;
            },
        ],
        unknown,
    ];
    'checklists/questions-from-checklist': [
        [
            {
                checklistId: string;
            },
        ],
        ChecklistQuestion,
    ];
    'checklists/update-checklist': [
        [
            {
                id: string;
                name: string;
                eventKey: string;
                description: string;
            },
        ],
        unknown,
    ];
    'checklists/update-question': [
        [
            {
                id: string;
                checklistId: string;
                question: string;
                interval: number;
            },
        ],
        unknown,
    ];
    'checklists/answers-from-checklist': [
        [
            {
                checklistId: string;
                eventKey: string;
            },
        ],
        {
            id: string;
            accountId: string;
            questionId: string;
            matchId: string;
            question: string;
            interval: number;
            checklistId: string;
            checklistName: string;
            eventKey: string;
            checklistDescription: string;
        },
    ];
    'checklists/assignments-from-checklist': [
        [
            {
                checklistId: string;
            },
        ],
        CheckListAssignment,
    ];
    'checklists/questions-from-assignment': [
        [
            {
                accountId: string;
            },
        ],
        {
            checklistId: string;
            checklistName: string;
            eventKey: string;
            checklistDescription: string;
            questionId: string;
            question: string;
            interval: number;
        },
    ];

    // // ▄▀▀ ▀█▀ █▀▄ ▄▀▄ ▀█▀ ██▀ ▄▀  ▀▄▀
    // // ▄█▀  █  █▀▄ █▀█  █  █▄▄ ▀▄█  █
    'strategy/from-custom-match': [
        [
            {
                customMatchId: string;
            },
        ],
        Strategy,
    ];
    'strategy/from-match': [
        [
            {
                eventKey: string;
                matchNumber: number;
                compLevel: 'qm' | 'qf' | 'sf' | 'f';
            },
        ],
        Strategy,
    ];
    'strategy/from-id': [
        [
            {
                id: string;
            },
        ],
        Strategy,
    ];
    'strategy/from-whiteboard': [
        [
            {
                whiteboardId: string;
            },
        ],
        Strategy,
    ];
    'strategy/new': [
        [
            {
                id: string;
                name: string;
                time: number;
                createdBy: string;
                whiteboardId: string | null;
                matchId: string | null;
                customMatchId: string | null;
                comment: string;
            },
        ],
        unknown,
    ];
    'strategy/update': [
        [
            {
                id: string;
                name: string;
                time: number;
                createdBy: string;
                whiteboardId: string | null;
                matchId: string | null;
                customMatchId: string | null;
                comment: string;
            },
        ],
        unknown,
    ];
    'strategy/delete': [
        [
            {
                id: string;
            },
        ],
        unknown,
    ];
};
