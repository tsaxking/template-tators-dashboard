// This file was generated by a script, please do not modify it. If you see any problems, please raise an issue on  https://github.com/tsaxking/webpack-template/issues

export type Accounts = {
    id: string;
    username: string;
    key: string;
    salt: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordChange: string | undefined;
    picture: string | undefined;
    verified: number;
    verification: string | undefined;
    emailChange: string | undefined;
    passwordChangeDate: number | undefined;
    phoneNumber: string | undefined;
    created: number;
    discordId: string | undefined;
};

export type Members = {
    id: string;
    title: string | undefined;
    status: string | undefined;
    bio: string | undefined;
    resume: string | undefined;
    board: number;
};

export type Roles = {
    id: string;
    name: string;
    description: string | undefined;
    rank: number;
};

export type AccountRoles = {
    accountId: string;
    roleId: string;
};

export type Permissions = {
    roleId: string;
    permission: string;
    description: string | undefined;
};

export type Version = {
    major: number;
    minor: number;
    patch: number;
};

export type Sessions = {
    id: string;
    accountId: string | undefined;
    ip: string | undefined;
    userAgent: string | undefined;
    latestActivity: number | undefined;
    requests: number;
    created: number;
    prevUrl: string | undefined;
};

export type Blacklist = {
    id: string;
    ip: string;
    created: number;
    accountId: string | undefined;
    reason: string;
};

export type AccountSettings = {
    accountId: string;
    settings: string;
};

export type Select_permissions_all = undefined;

export type Select_roles_from_name = {
    name: string;
};

export type Delete_roles_delete = {
    id: string;
};

export type Update_roles_update = {
    name: string;
    description: string | undefined;
    rank: number;
    id: string;
};

export type Insert_roles_new = {
    id: string;
    name: string;
    description: string | undefined;
    rank: number;
};

export type Select_roles_from_id = {
    id: string;
};

export type Select_roles_all = undefined;

export type Delete_sessions_delete = {
    id: string;
};

export type Delete_sessions_delete_all = undefined;

export type Update_sessions_update = {
    accountId: string | undefined;
    userAgent: string | undefined;
    latestActivity: number | undefined;
    requests: number;
    ip: string | undefined;
    prevUrl: string | undefined;
    id: string;
    customData: string;
};

export type Insert_sessions_new = {
    id: string;
    accountId: string | undefined;
    userAgent: string | undefined;
    latestActivity: number | undefined;
    requests: number;
    created: number;
    ip: string | undefined;
    prevUrl: string | undefined;
    customData: string;
};

export type Select_sessions_get = {
    id: string;
};

export type Select_sessions_all = undefined;

export type Delete_member_delete = {
    id: string;
};

export type Update_member_update_title = {
    title: string | undefined;
    id: string;
};

export type Update_member_update_status = {
    id: string;
    status: string | undefined;
};

export type Update_member_update_resume = {
    id: string;
    resume: string | undefined;
};

export type Update_member_remove_from_board = {
    id: string;
};

export type Insert_member_new = {
    id: string;
    status: string | undefined;
};

export type Update_member_update_bio = {
    bio: string | undefined;
    id: string;
};

export type Update_member_add_to_board = {
    id: string;
};

export type Select_member_all = undefined;

export type Update_account_unverify = {
    id: string;
};

export type Update_account_set_verification = {
    verification: string | undefined;
    id: string;
};

export type Delete_account_delete = {
    id: string;
};

export type Select_account_unverified = undefined;

export type Update_account_change_password = {
    salt: string;
    passwordChange: string | undefined;
    id: string;
    key: string;
};

export type Insert_account_save_settings = {
    accountId: string;
    settings: string;
};

export type Select_account_from_username = {
    username: string;
};

export type Update_account_update_picture = {
    picture: string | undefined;
    id: string;
};

export type Select_account_from_verification_key = {
    verification: string | undefined;
};

export type Select_account_verified = undefined;

export type Update_account_verify = {
    id: string;
};

export type Select_account_get_settings = {
    accountId: string;
};

export type Update_account_change_email = {
    email: string;
    id: string;
};

export type Delete_account_remove_role = {
    accountId: string;
    roleId: string;
};

export type Insert_account_add_role = {
    accountId: string;
    roleId: string;
};

export type Select_account_from_email = {
    email: string;
};

export type Insert_account_new = {
    id: string;
    username: string;
    key: string;
    salt: string;
    firstName: string;
    lastName: string;
    email: string;
    verified: number;
    verification: string | undefined;
    created: number;
    phoneNumber: string | undefined;
};

export type Update_account_request_password_change = {
    passwordChange: string | undefined;
    id: string;
};

export type Select_account_from_password_change = {
    passwordChange: string | undefined;
};

export type Select_account_from_id = {
    id: string;
};

export type Select_account_all = undefined;

export type Update_account_request_email_change = {
    emailChange: string | undefined;
    id: string;
};

export type Update_account_change_username = {
    username: string;
    id: string;
};

export type Select_db_get_version = undefined;

export type Update_db_change_version = {
    major: number;
    minor: number;
    patch: number;
};

export type Insert_db_init = {
    id: string;
    username: string;
    key: string;
    salt: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordChange: string | undefined;
    picture: string | undefined;
    verified: number;
    verification: string | undefined;
    emailChange: string | undefined;
    passwordChangeDate: number | undefined;
    phoneNumber: string | undefined;
    created: number;
    discordId: string | undefined;
};

export type DiscordAccount = {
    key: string;
    id: string;
    date: number;
};

export type Events = {
    eventKey: string;
    flipX: number;
    flipY: number;
};

export type Teams = {
    number: number;
    eventKey: string;
    watchPriority: number;
};

export type Matches = {
    id: string;
    eventKey: string;
    matchNumber: number;
    compLevel: string;
};

export type CustomMatches = {
    id: string;
    eventKey: string;
    matchNumber: number;
    compLevel: string;
    red1: number;
    red2: number;
    red3: number;
    blue1: number;
    blue2: number;
    blue3: number;
    created: number;
    name: string;
};

export type Whiteboards = {
    id: string;
    eventKey: string;
    name: string;
    matchId: string | undefined;
    customMatchId: string | undefined;
    board: string;
};

export type MatchScouting = {
    id: string;
    matchId: string | undefined;
    team: number;
    scoutId: string | undefined;
    scoutGroup: number;
    trace: string;
    checks: string;
    preScouting: string | undefined;
    time: number;
    prescouting: string | undefined;
};

export type MatchComments = {
    id: string;
    team: number;
    comment: string;
    matchScoutingId: string | undefined;
    accountId: string | undefined;
    time: string | undefined;
};

export type ScoutingQuestionSections = {
    name: string;
    multiple: number;
    dateAdded: number;
    accountId: string;
    id: string;
};

export type ScoutingQuestionGroups = {
    id: string;
    eventKey: string;
    section: string;
    name: string;
    dateAdded: number;
    accountId: string;
};

export type ScoutingQuestions = {
    id: string;
    question: string;
    key: string;
    description: string;
    type: string;
    groupId: string;
    dateAdded: number;
    accountId: string;
    options: string;
};

export type ScoutingAnswers = {
    id: string;
    questionId: string;
    answer: string;
    teamNumber: number;
    date: number;
    accountId: string;
};

export type TBARequests = {
    url: string;
    response: string | undefined;
    updated: number;
    update: number;
};

export type Checklists = {
    id: string;
    name: string;
    eventKey: string;
    description: string;
};

export type ChecklistQuestions = {
    id: string;
    checklistId: string;
    question: string;
    interval: number;
};

export type ChecklistAssignments = {
    checklistId: string;
    accountId: string;
};

export type ChecklistAnswers = {
    id: string;
    accountId: string;
    questionId: string;
    matchId: string;
};

export type Alliances = {
    id: string;
    name: string;
    eventKey: string;
    team1: number;
    team2: number;
    team3: number;
};

export type Strategy = {
    id: string;
    name: string;
    time: number;
    createdBy: string;
    whiteboardId: string | undefined;
    matchId: string | undefined;
    customMatchId: string | undefined;
    comment: string;
};

export type ScoutingQuestionAnswerHistory = {
    questionId: string;
    answer: string;
    teamNumber: number;
    date: string;
    accountId: string;
};

export type ScoutingQuestionHistory = {
    id: string;
    question: string;
    key: string;
    description: string;
    type: string;
    groupId: string;
    dateAdded: string;
    accountId: string;
};

export type ScoutingQuestionGroupHistory = {
    id: string;
    eventKey: string;
    section: string;
    name: string;
    dateAdded: string;
    accountId: string;
};

export type ScoutingQuestionSectionHistory = {
    id: string;
    name: string;
    multiple: number;
    dateAdded: string;
    accountId: string;
};

export type TeamCommentsHistory = {
    id: string;
    team: number;
    comment: string;
    type: string;
    matchScoutingId: string | undefined;
    accountId: string | undefined;
    time: string;
    eventKey: string;
};

export type TeamComments = {
    id: string;
    team: number;
    comment: string;
    type: string;
    matchScoutingId: string | undefined;
    accountId: string | undefined;
    time: number;
    eventKey: string;
};

export type ScoutingQuestionOptions = {
    id: string;
    questionId: string;
    option: string;
    order: number;
};

export type TeamPictures = {
    teamNumber: number;
    eventKey: string;
    picture: string;
    time: string;
    accountId: string;
};

export type MatchScouting2022 = {
    id: string;
    matchScoutingId: string;
    section: string;
    ballsHigh: number;
    ballsLow: number;
    missed: number;
    leaveTarmac: number;
    climb4: number;
    climb6: number;
    climb10: number;
    climb15: number;
    totalTime: number;
    timeStart: number;
    noClimb: number;
    fell: number;
    climbLevel: number;
    stage1Time: number;
    stage2Time: number;
    stage3Time: number;
    misses: number;
    bouncedOut: number;
    problemsDriving: number;
    dead: number;
    tippy: number;
    easilyDefended: number;
    foulsPinningOrHerdingCargo: number;
    shootsCargoOverHub: number;
    pushesBots: number;
};

export type MatchScouting2023 = {
    id: string;
    matchScoutingId: string;
    section: string;
    autoMobility: number;
    grid: string;
    parked: number;
    totalDistance: number;
    velocity: number;
    velocityNoAuto: number;
};

export type Select_checklists_checklists_from_event = {
    eventKey: string;
};

export type Update_checklists_update_checklist = {
    name: string;
    description: string;
    eventKey: string;
    id: string;
};

export type Insert_checklists_new_assignment = {
    checklistId: string;
    accountId: string;
};

export type Delete_checklists_delete_question = {
    id: string;
};

export type Insert_checklists_new_checklist = {
    id: string;
    name: string;
    eventKey: string;
    description: string;
};

export type Select_checklists_questions_from_checklist = {
    checklistId: string;
};

export type Delete_checklists_delete_assignment = {
    checklistId: string;
    accountId: string;
};

export type Update_checklists_update_question = {
    checklistId: string;
    question: string;
    interval: number;
    id: string;
};

export type Delete_checklists_delete_checklist = {
    id: string;
};

export type Insert_checklists_new_answer = {
    id: string;
    accountId: string;
    questionId: string;
    matchId: string;
};

export type Delete_checklists_delete_answer = {
    id: string;
};

export type Select_checklists_assignments_from_checklist = {
    checklistId: string;
};

export type Insert_checklists_new_question = {
    id: string;
    checklistId: string;
    question: string;
    interval: number;
};

export type Select_custom_matches_from_event = {
    eventKey: string;
};

export type Insert_custom_matches_new = {
    id: string;
    eventKey: string;
    matchNumber: number;
    compLevel: string;
    created: number;
    name: string;
    red1: number;
    red2: number;
    red3: number;
    blue1: number;
    blue2: number;
    blue3: number;
};

export type Select_custom_matches_from_id = {
    id: string;
};

export type Update_scouting_questions_update_group = {
    eventKey: string;
    name: string;
    id: string;
    accountId: string;
    dateAdded: number;
};

export type Delete_scouting_questions_delete_question = {
    id: string;
};

export type Insert_scouting_questions_new_group = {
    id: string;
    eventKey: string;
    name: string;
    section: string;
    dateAdded: number;
    accountId: string;
};

export type Select_scouting_questions_all_sections = undefined;

export type Select_scouting_questions_questions_from_group = {
    groupId: string;
};

export type Insert_scouting_questions_new_question = {
    id: string;
    question: string;
    key: string;
    description: string;
    type: string;
    groupId: string;
    dateAdded: number | undefined;
    accountId: string | undefined;
    options: string | undefined;
};

export type Delete_scouting_questions_delete_section = {
    id: string;
};

export type Select_scouting_questions_answer_from_id = {
    id: string;
};

export type Update_scouting_questions_update_question = {
    question: string;
    key: string;
    description: string;
    type: string;
    groupId: string;
    id: string;
    accountId: string;
    dateAdded: number;
    options: string;
};

export type Select_scouting_questions_groups_from_event = {
    eventKey: string;
};

export type Select_scouting_questions_get_answer_history = {
    questionId: string;
};

export type Insert_scouting_questions_update_answer = {
    questionId: string;
    answer: string;
    teamNumber: number;
    date: number;
    accountId: string;
    id: string;
};

export type Insert_scouting_questions_new_answer = {
    id: string;
    questionId: string;
    answer: string;
    teamNumber: number;
    date: number;
    accountId: string;
};

export type Insert_scouting_questions_delete_answer = {
    questionId: string;
    answer: string;
    teamNumber: number;
    date: string;
    accountId: string;
};

export type Delete_scouting_questions_delete_group = {
    id: string;
};

export type Insert_scouting_questions_new_section = {
    name: string;
    multiple: number;
    dateAdded: number;
    accountId: string;
    id: string;
};

export type Select_events_from_key = {
    eventKey: string;
};

export type Select_events_all_alliances = {
    eventKey: string;
};

export type Insert_events_new_event = {
    eventKey: string;
    flipX: number;
    flipY: number;
};

export type Delete_events_delete_event = {
    eventKey: string;
};

export type Insert_events_new_alliance = {
    id: string;
    eventKey: string;
    team1: number;
    team2: number;
    team3: number;
};

export type Delete_events_delete_alliance = {
    id: string;
};

export type Update_match_scouting_update = {
    matchId: string | undefined;
    team: number;
    scoutId: string | undefined;
    scoutGroup: number;
    time: number;
    preScouting: number;
    trace: string;
    checks: string;
    id: string;
};

export type Insert_match_scouting_new = {
    id: string;
    matchId: string | undefined;
    team: number;
    scoutId: string | undefined;
    scoutGroup: number;
    time: number;
    preScouting: number;
    trace: string;
    checks: string;
    scoutName: string;
};

export type Select_tba_from_url = {
    url: string;
};

export type Insert_tba_new = {
    url: string;
    response: string | undefined;
    updated: number;
    update: number;
};

export type Insert_discord_insert = {
    key: string;
    id: string;
    date: number;
};

export type Delete_discord_delete = {
    key: string;
};

export type Select_discord_get = {
    key: string;
};

export type Insert_team_comments_delete = {
    id: string;
    team: number;
    comment: string;
    type: string;
    matchScoutingId: string | undefined;
    accountId: string | undefined;
    time: string;
    eventKey: string;
};

export type Update_team_comments_update = {
    id: string;
    team: number;
    comment: string;
    type: string;
    matchScoutingId: string | undefined;
    accountId: string | undefined;
    time: string;
    eventKey: string;
};

export type Insert_team_comments_new = {
    id: string;
    team: number;
    comment: string;
    type: string;
    matchScoutingId: string;
    accountId: string | undefined;
    time: number;
    eventKey: string;
};

export type Select_teams_from_event = {
    eventKey: string;
};

export type Insert_teams_new = {
    number: number;
    watchPriority: number;
    eventKey: string;
};

export type Select_account_from_discord_id = {
    discordId: string | undefined;
};

export type Update_account_set_discord_id = {
    discordId: string | undefined;
    id: string;
};

export type Select_matches_from_event = {
    eventKey: string;
};

export type Insert_matches_new = {
    id: string;
    eventKey: string;
    matchNumber: number;
    compLevel: string;
};

export type Select_matches_from_id = {
    id: string;
};

export type Select_strategy_from_custom_match = {
    customMatchId: string | undefined;
};

export type Delete_strategy_delete = {
    id: string;
};

export type Select_strategy_from_whiteboard = {
    whiteboardId: string | undefined;
};

export type Update_strategy_update = {
    name: string;
    time: number;
    createdBy: string;
    whiteboardId: string | undefined;
    matchId: string | undefined;
    customMatchId: string | undefined;
    comment: string;
    id: string;
};

export type Insert_strategy_new = {
    id: string;
    name: string;
    time: number;
    createdBy: string;
    whiteboardId: string | undefined;
    matchId: string | undefined;
    customMatchId: string | undefined;
    comment: string;
};

export type Select_strategy_from_id = {
    id: string;
};

export type Update_whiteboards_change_custom_match = {
    customMatchId: string | undefined;
    id: string;
};

export type Select_whiteboards_from_custom_match = {
    customMatchId: string | undefined;
};

export type Delete_whiteboards_delete = {
    id: string;
};

export type Select_whiteboards_from_event = {
    eventKey: string;
};

export type Update_whiteboards_change_match = {
    matchId: string | undefined;
    id: string;
};

export type Update_whiteboards_update_board = {
    board: string;
    id: string;
};

export type Update_whiteboards_update_name = {
    name: string;
    id: string;
};

export type Insert_whiteboards_new = {
    id: string;
    eventKey: string;
    name: string;
    matchId: string | undefined;
    customMatchId: string | undefined;
    board: string;
};

export type Select_whiteboards_from_match = {
    matchId: string | undefined;
};

export type Select_whiteboards_from_id = {
    id: string;
};

export type RolePermissions = {
    roleId: string;
    permission: string;
};

export type Select_team_comments_from_match_scouting = {
    matchScoutingId: string;
};

export type Select_team_comments_from_event = {
    eventKey: string;
};

export type Select_team_comments_from_team = {
    team: number;
    eventKey: string;
};

export type Insert_team_comments_update = {
    id: string;
    team: number;
    comment: string;
    type: string;
    matchScoutingId: string | undefined;
    accountId: string | undefined;
    time: string;
    eventKey: string;
};

export type Select_team_comments_from_account = {
    accountId: string | undefined;
};

export type Insert_permissions_add_to_role = {
    roleId: string;
    permission: string;
};

export type Delete_permissions_remove_from_role = {
    roleId: string;
    permission: string;
};

export type RetrievedMatchScouting = MatchScouting & {
    eventKey: string;
    matchNumber: number;
    compLevel: string;
};

export type Select_blacklist_all = undefined;

export type Update_sessions_sign_in = {
    accountId: string | undefined;
    id: string;
};

export type Update_sessions_sign_out = {
    id: string;
};

export type Insert_db_change_version = {
    major: number;
    minor: number;
    patch: number;
};

export type Delete_db_delete_version = undefined;
