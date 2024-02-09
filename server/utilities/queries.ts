// This file was generated by a script, please do not modify it. If you see any problems, please raise an issue on  https://github.com/tsaxking/webpack-template/issues

import { Accounts } from './tables.ts';
import { Members } from './tables.ts';
import { Roles } from './tables.ts';
import { AccountRoles } from './tables.ts';
import { Permissions } from './tables.ts';
import { Version } from './tables.ts';
import { Sessions } from './tables.ts';
import { AccountSettings } from './tables.ts';
import { Select_permissions_all } from './tables.ts';
import { Select_roles_from_name } from './tables.ts';
import { Delete_roles_delete } from './tables.ts';
import { Update_roles_update } from './tables.ts';
import { Insert_roles_new } from './tables.ts';
import { Select_roles_from_id } from './tables.ts';
import { Select_roles_all } from './tables.ts';
import { Delete_sessions_delete } from './tables.ts';
import { Delete_sessions_delete_all } from './tables.ts';
import { Update_sessions_update } from './tables.ts';
import { Insert_sessions_new } from './tables.ts';
import { Select_sessions_get } from './tables.ts';
import { Select_sessions_all } from './tables.ts';
import { Delete_member_delete } from './tables.ts';
import { Update_member_update_title } from './tables.ts';
import { Update_member_update_status } from './tables.ts';
import { Update_member_update_resume } from './tables.ts';
import { Update_member_remove_from_board } from './tables.ts';
import { Insert_member_new } from './tables.ts';
import { Update_member_update_bio } from './tables.ts';
import { Update_member_add_to_board } from './tables.ts';
import { Select_member_all } from './tables.ts';
import { Update_account_unverify } from './tables.ts';
import { Update_account_set_verification } from './tables.ts';
import { Delete_account_delete } from './tables.ts';
import { Select_account_unverified } from './tables.ts';
import { Update_account_change_password } from './tables.ts';
import { Insert_account_save_settings } from './tables.ts';
import { Select_account_from_username } from './tables.ts';
import { Update_account_update_picture } from './tables.ts';
import { Select_account_from_verification_key } from './tables.ts';
import { Select_account_verified } from './tables.ts';
import { Update_account_verify } from './tables.ts';
import { Select_account_get_settings } from './tables.ts';
import { Update_account_change_email } from './tables.ts';
import { Delete_account_remove_role } from './tables.ts';
import { Insert_account_add_role } from './tables.ts';
import { Select_account_from_email } from './tables.ts';
import { Insert_account_new } from './tables.ts';
import { Update_account_request_password_change } from './tables.ts';
import { Select_account_from_password_change } from './tables.ts';
import { Select_account_from_id } from './tables.ts';
import { Select_account_all } from './tables.ts';
import { Update_account_request_email_change } from './tables.ts';
import { Update_account_change_username } from './tables.ts';
import { Select_db_get_version } from './tables.ts';
import { Update_db_change_version } from './tables.ts';
import { Insert_db_init } from './tables.ts';
import { DiscordAccount } from './tables.ts';
import { Events } from './tables.ts';
import { Teams } from './tables.ts';
import { Matches } from './tables.ts';
import { CustomMatches } from './tables.ts';
import { Whiteboards } from './tables.ts';
import { MatchScouting } from './tables.ts';
import { MatchComments } from './tables.ts';
import { ScoutingQuestionSections } from './tables.ts';
import { ScoutingQuestionGroups } from './tables.ts';
import { ScoutingQuestions } from './tables.ts';
import { ScoutingAnswers } from './tables.ts';
import { TBARequests } from './tables.ts';
import { Checklists } from './tables.ts';
import { ChecklistQuestions } from './tables.ts';
import { ChecklistAssignments } from './tables.ts';
import { ChecklistAnswers } from './tables.ts';
import { Alliances } from './tables.ts';
import { Strategy } from './tables.ts';
import { ScoutingQuestionAnswerHistory } from './tables.ts';
import { ScoutingQuestionHistory } from './tables.ts';
import { ScoutingQuestionGroupHistory } from './tables.ts';
import { ScoutingQuestionSectionHistory } from './tables.ts';
import { TeamCommentsHistory } from './tables.ts';
import { TeamComments } from './tables.ts';
import { ScoutingQuestionOptions } from './tables.ts';
import { TeamPictures } from './tables.ts';
import { MatchScouting2022 } from './tables.ts';
import { MatchScouting2023 } from './tables.ts';
import { Select_checklists_checklists_from_event } from './tables.ts';
import { Update_checklists_update_checklist } from './tables.ts';
import { Insert_checklists_new_assignment } from './tables.ts';
import { Delete_checklists_delete_question } from './tables.ts';
import { Insert_checklists_new_checklist } from './tables.ts';
import { Select_checklists_questions_from_checklist } from './tables.ts';
import { Delete_checklists_delete_assignment } from './tables.ts';
import { Update_checklists_update_question } from './tables.ts';
import { Delete_checklists_delete_checklist } from './tables.ts';
import { Insert_checklists_new_answer } from './tables.ts';
import { Delete_checklists_delete_answer } from './tables.ts';
import { Select_checklists_assignments_from_checklist } from './tables.ts';
import { Insert_checklists_new_question } from './tables.ts';
import { Select_custom_matches_from_event } from './tables.ts';
import { Insert_custom_matches_new } from './tables.ts';
import { Select_custom_matches_from_id } from './tables.ts';
import { Update_scouting_questions_update_group } from './tables.ts';
import { Delete_scouting_questions_delete_question } from './tables.ts';
import { Insert_scouting_questions_new_group } from './tables.ts';
import { Select_scouting_questions_all_sections } from './tables.ts';
import { Select_scouting_questions_questions_from_group } from './tables.ts';
import { Insert_scouting_questions_new_question } from './tables.ts';
import { Delete_scouting_questions_delete_section } from './tables.ts';
import { Select_scouting_questions_answer_from_id } from './tables.ts';
import { Update_scouting_questions_update_question } from './tables.ts';
import { Select_scouting_questions_groups_from_event } from './tables.ts';
import { Select_scouting_questions_get_answer_history } from './tables.ts';
import { Insert_scouting_questions_update_answer } from './tables.ts';
import { Insert_scouting_questions_new_answer } from './tables.ts';
import { Insert_scouting_questions_delete_answer } from './tables.ts';
import { Delete_scouting_questions_delete_group } from './tables.ts';
import { Insert_scouting_questions_new_section } from './tables.ts';
import { Select_events_from_key } from './tables.ts';
import { Select_events_all_alliances } from './tables.ts';
import { Insert_events_new_event } from './tables.ts';
import { Delete_events_delete_event } from './tables.ts';
import { Insert_events_new_alliance } from './tables.ts';
import { Delete_events_delete_alliance } from './tables.ts';
import { Update_match_scouting_update } from './tables.ts';
import { Insert_match_scouting_new } from './tables.ts';
import { Select_tba_from_url } from './tables.ts';
import { Insert_tba_new } from './tables.ts';
import { Insert_discord_insert } from './tables.ts';
import { Delete_discord_delete } from './tables.ts';
import { Select_discord_get } from './tables.ts';
import { Insert_team_comments_delete } from './tables.ts';
import { Update_team_comments_update } from './tables.ts';
import { Insert_team_comments_new } from './tables.ts';
import { Select_teams_from_event } from './tables.ts';
import { Insert_teams_new } from './tables.ts';
import { Select_account_from_discord_id } from './tables.ts';
import { Update_account_set_discord_id } from './tables.ts';
import { Select_matches_from_event } from './tables.ts';
import { Insert_matches_new } from './tables.ts';
import { Select_matches_from_id } from './tables.ts';
import { Select_strategy_from_custom_match } from './tables.ts';
import { Delete_strategy_delete } from './tables.ts';
import { Select_strategy_from_whiteboard } from './tables.ts';
import { Update_strategy_update } from './tables.ts';
import { Insert_strategy_new } from './tables.ts';
import { Select_strategy_from_id } from './tables.ts';
import { Update_whiteboards_change_custom_match } from './tables.ts';
import { Select_whiteboards_from_custom_match } from './tables.ts';
import { Delete_whiteboards_delete } from './tables.ts';
import { Select_whiteboards_from_event } from './tables.ts';
import { Update_whiteboards_change_match } from './tables.ts';
import { Update_whiteboards_update_board } from './tables.ts';
import { Update_whiteboards_update_name } from './tables.ts';
import { Insert_whiteboards_new } from './tables.ts';
import { Select_whiteboards_from_match } from './tables.ts';
import { Select_whiteboards_from_id } from './tables.ts';
import { RolePermissions } from './tables.ts';
import { Select_team_comments_from_match_scouting } from './tables.ts';
import { Select_team_comments_from_event } from './tables.ts';
import { Select_team_comments_from_team } from './tables.ts';
import { Insert_team_comments_update } from './tables.ts';
import { Select_team_comments_from_account } from './tables.ts';
import { Insert_permissions_add_to_role } from './tables.ts';
import { Delete_permissions_remove_from_role } from './tables.ts';
import { RetrievedMatchScouting } from './tables.ts';

export type Queries = {
    'permissions/all': [[Select_permissions_all], Permissions];
    'permissions/from-role': [[{ roleId: string }], Permissions];
    'permissions/remove-from-role': [
        [Delete_permissions_remove_from_role],
        unknown,
    ];
    'permissions/add-to-role': [[Insert_permissions_add_to_role], unknown];
    'roles/from-name': [[Select_roles_from_name], Roles];
    'roles/delete': [[Delete_roles_delete], unknown];
    'roles/update': [[Update_roles_update], unknown];
    'roles/new': [[Insert_roles_new], unknown];
    'roles/from-id': [[Select_roles_from_id], Roles];
    'roles/all': [[Select_roles_all], Roles];
    'roles/from-username': [[{ username: string }], Roles];
    'sessions/delete': [[Delete_sessions_delete], unknown];
    'sessions/delete-all': [[Delete_sessions_delete_all], unknown];
    'sessions/update': [[Update_sessions_update], unknown];
    'sessions/new': [[Insert_sessions_new], unknown];
    'sessions/get': [[Select_sessions_get], Sessions];
    'sessions/all': [[Select_sessions_all], Sessions];

    'sessions/sign-in': [
        [
            {
                id: string;
                accountId: string;
            },
        ],
        unknown,
    ];

    'sessions/sign-out': [
        [
            {
                id: string;
            },
        ],
        unknown,
    ];

    'member/delete': [[Delete_member_delete], unknown];
    'member/update-title': [[Update_member_update_title], unknown];
    'member/update-status': [[Update_member_update_status], unknown];
    'member/update-resume': [[Update_member_update_resume], unknown];
    'member/remove-from-board': [[Update_member_remove_from_board], unknown];
    'member/new': [[Insert_member_new], unknown];
    'member/update-bio': [[Update_member_update_bio], unknown];
    'member/add-to-board': [[Update_member_add_to_board], unknown];
    'member/all': [[Select_member_all], Members];
    'member/from-username': [[{ username: string }], Members];
    'account/unverify': [[Update_account_unverify], unknown];
    'account/set-verification': [[Update_account_set_verification], unknown];
    'account/delete': [[Delete_account_delete], unknown];
    'account/unverified': [[Select_account_unverified], Accounts];
    'account/change-password': [[Update_account_change_password], unknown];
    'account/save-settings': [[Insert_account_save_settings], unknown];
    'account/from-username': [[Select_account_from_username], Accounts];
    'account/update-picture': [[Update_account_update_picture], unknown];
    'account/from-verification-key': [
        [Select_account_from_verification_key],
        Accounts,
    ];
    'account/verified': [[Select_account_verified], Accounts];
    'account/verify': [[Update_account_verify], unknown];
    'account/get-settings': [[Select_account_get_settings], AccountSettings];
    'account/change-email': [[Update_account_change_email], unknown];
    'account/remove-role': [[Delete_account_remove_role], unknown];
    'account/add-role': [[Insert_account_add_role], unknown];
    'account/from-email': [[Select_account_from_email], Accounts];
    'account/new': [[Insert_account_new], unknown];
    'account/request-password-change': [
        [Update_account_request_password_change],
        unknown,
    ];
    'account/from-password-change': [
        [Select_account_from_password_change],
        Accounts,
    ];
    'account/from-id': [[Select_account_from_id], Accounts];
    'account/all': [[Select_account_all], Accounts];
    'account/request-email-change': [
        [Update_account_request_email_change],
        unknown,
    ];
    'account/change-username': [[Update_account_change_username], unknown];
    'account/roles': [[{ id: string }], Roles];
    'db/get-version': [[Select_db_get_version], Version];
    'db/change-version': [[Update_db_change_version], unknown];
    'db/init': [[Insert_db_init], unknown];
    'checklists/checklists-from-event': [
        [Select_checklists_checklists_from_event],
        Checklists,
    ];
    'checklists/update-checklist': [
        [Update_checklists_update_checklist],
        unknown,
    ];
    'checklists/new-assignment': [[Insert_checklists_new_assignment], unknown];
    'checklists/delete-question': [
        [Delete_checklists_delete_question],
        unknown,
    ];
    'checklists/new-checklist': [[Insert_checklists_new_checklist], unknown];
    'checklists/questions-from-checklist': [
        [Select_checklists_questions_from_checklist],
        ChecklistQuestions,
    ];
    'checklists/questions-from-account': [
        [
            {
                accountId: string;
                eventKey: string;
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
    'checklists/delete-assignment': [
        [Delete_checklists_delete_assignment],
        unknown,
    ];
    'checklists/update-question': [
        [Update_checklists_update_question],
        unknown,
    ];
    'checklists/delete-checklist': [
        [Delete_checklists_delete_checklist],
        unknown,
    ];
    'checklists/new-answer': [[Insert_checklists_new_answer], unknown];
    'checklists/delete-answer': [[Delete_checklists_delete_answer], unknown];
    'checklists/assignments-from-checklist': [
        [Select_checklists_assignments_from_checklist],
        ChecklistAssignments,
    ];
    'checklists/new-question': [[Insert_checklists_new_question], unknown];
    'checklists/answers-from-checklist': [
        [
            {
                eventKey: string;
                checklistId: string;
            },
        ],
        ChecklistAnswers & {
            checklistName: string;
            eventkey: string;
            checklistDescription: string;
        },
    ];
    'custom-matches/from-event': [
        [Select_custom_matches_from_event],
        CustomMatches,
    ];
    'custom-matches/new': [[Insert_custom_matches_new], unknown];
    'custom-matches/from-id': [[Select_custom_matches_from_id], CustomMatches];
    'scouting-questions/update-group': [
        [Update_scouting_questions_update_group],
        unknown,
    ];
    'scouting-questions/delete-question': [
        [Delete_scouting_questions_delete_question],
        unknown,
    ];
    'scouting-questions/new-group': [
        [Insert_scouting_questions_new_group],
        unknown,
    ];
    'scouting-questions/all-sections': [
        [Select_scouting_questions_all_sections],
        ScoutingQuestionSections,
    ];
    'scouting-questions/questions-from-group': [
        [Select_scouting_questions_questions_from_group],
        ScoutingQuestions,
    ];
    'scouting-questions/question-from-id': [
        [
            {
                id: string;
            },
        ],
        ScoutingQuestions,
    ];
    'scouting-questions/new-question': [
        [Insert_scouting_questions_new_question],
        unknown,
    ];
    'scouting-questions/delete-section': [
        [Delete_scouting_questions_delete_section],
        unknown,
    ];
    'scouting-questions/answer-from-id': [
        [Select_scouting_questions_answer_from_id],
        ScoutingAnswers,
    ];
    'scouting-questions/update-question': [
        [Update_scouting_questions_update_question],
        unknown,
    ];
    'scouting-questions/groups-from-event': [
        [Select_scouting_questions_groups_from_event],
        ScoutingQuestionGroups,
    ];
    'scouting-questions/groups-from-section': [
        [{ section: string, eventKey: string }],
        ScoutingQuestionGroups,
    ];
    'scouting-questions/get-answer-history': [
        [Select_scouting_questions_get_answer_history],
        ScoutingQuestionAnswerHistory,
    ];
    'scouting-questions/update-answer': [
        [Insert_scouting_questions_update_answer],
        unknown,
    ];
    'scouting-questions/new-answer': [
        [Insert_scouting_questions_new_answer],
        unknown,
    ];
    'scouting-questions/delete-answer': [
        [Insert_scouting_questions_delete_answer],
        unknown,
    ];
    'scouting-questions/delete-group': [
        [Delete_scouting_questions_delete_group],
        unknown,
    ];
    'scouting-questions/new-section': [
        [Insert_scouting_questions_new_section],
        unknown,
    ];
    'scouting-questions/update-section': [
        [
            {
                id: string;
                name: string;
                multiple: boolean;
                accountId: string;
                dateAdded: number;
            },
        ],
        unknown,
    ];
    'scouting-questions/answer-from-team': [
        [{ teamNumber: number; eventKey: string }],
        ScoutingAnswers,
    ];
    'events/from-key': [[Select_events_from_key], Events];
    'events/all-alliances': [[Select_events_all_alliances], Alliances];
    'events/new-event': [[Insert_events_new_event], unknown];
    'events/delete-event': [[Delete_events_delete_event], unknown];
    'events/new-alliance': [[Insert_events_new_alliance], unknown];
    'events/delete-alliance': [[Delete_events_delete_alliance], unknown];
    'match-scouting/update': [[Update_match_scouting_update], unknown];
    'match-scouting/new': [[Insert_match_scouting_new], unknown];
    'match-scouting/from-match': [
        [{ matchId: string }],
        RetrievedMatchScouting,
    ];
    'match-scouting/from-team': [
        [{ team: number; eventKey: string }],
        RetrievedMatchScouting,
    ];
    'match-scouting/from-event': [
        [{ eventKey: string }],
        RetrievedMatchScouting,
    ];
    'match-scouting/from-scout': [
        [{ scoutId: string; eventKey: string }],
        RetrievedMatchScouting,
    ];
    'match-scouting/from-id': [[{ id: string }], RetrievedMatchScouting];
    'match-scouting/from-scout-group': [
        [{ eventKey: string; scoutGroup: string }],
        RetrievedMatchScouting,
    ];
    'tba/from-url': [[Select_tba_from_url], TBARequests];
    'tba/new': [[Insert_tba_new], unknown];
    'discord/insert': [[Insert_discord_insert], unknown];
    'discord/delete': [[Delete_discord_delete], unknown];
    'discord/get': [[Select_discord_get], DiscordAccount];
    'team-comments/delete': [[Insert_team_comments_delete], unknown];
    'team-comments/update': [[Insert_team_comments_update], unknown];
    'team-comments/new': [[Insert_team_comments_new], unknown];
    'team-comments/from-team': [[Select_team_comments_from_team], TeamComments];
    'team-comments/from-event': [
        [Select_team_comments_from_event],
        TeamComments,
    ];
    'teams/from-event': [[Select_teams_from_event], Teams];
    'teams/new': [[Insert_teams_new], unknown];
    'account/from-discord-id': [[Select_account_from_discord_id], Accounts];
    'account/set-discord-id': [[Update_account_set_discord_id], unknown];
    'matches/from-event': [[Select_matches_from_event], Matches];
    'matches/new': [[Insert_matches_new], unknown];
    'matches/from-id': [[Select_matches_from_id], Matches];
    'strategy/from-custom-match': [
        [Select_strategy_from_custom_match],
        Strategy,
    ];
    'strategy/from-match': [
        [{ eventKey: string; matchNumber: number; compLevel: string }],
        Strategy,
    ];
    'strategy/delete': [[Delete_strategy_delete], unknown];
    'strategy/from-whiteboard': [[Select_strategy_from_whiteboard], Strategy];
    'strategy/update': [[Update_strategy_update], unknown];
    'strategy/new': [[Insert_strategy_new], unknown];
    'strategy/from-id': [[Select_strategy_from_id], Strategy];
    'whiteboards/change-custom-match': [
        [Update_whiteboards_change_custom_match],
        unknown,
    ];
    'whiteboards/from-custom-match': [
        [Select_whiteboards_from_custom_match],
        Whiteboards,
    ];
    'whiteboards/delete': [[Delete_whiteboards_delete], unknown];
    'whiteboards/from-event': [[Select_whiteboards_from_event], Whiteboards];
    'whiteboards/change-match': [[Update_whiteboards_change_match], unknown];
    'whiteboards/update-board': [[Update_whiteboards_update_board], unknown];
    'whiteboards/update-name': [[Update_whiteboards_update_name], unknown];
    'whiteboards/new': [[Insert_whiteboards_new], unknown];
    'whiteboards/from-match': [[Select_whiteboards_from_match], Whiteboards];
    'whiteboards/from-id': [[Select_whiteboards_from_id], Whiteboards];
    'team-comments/from-match-scouting': [
        [Select_team_comments_from_match_scouting],
        TeamComments,
    ];
    'team-comments/from-account': [
        [Select_team_comments_from_account],
        TeamComments,
    ];
};
