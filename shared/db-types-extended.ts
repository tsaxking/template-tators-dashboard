/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {Event}
 */
export type Event = {
    eventKey: string;
    flipX: 0 | 1;
    flipY: 0 | 1;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {Team}
 */
export type Team = {
    number: number;
    watchPriority: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    eventKey: string;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {CompLevel}
 */
export type CompLevel = 'pr' | 'qm' | 'ef' | 'qf' | 'sf' | 'f';

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {Match}
 */
export type Match = {
    id: string;
    eventKey: string;
    matchNumber: number;
    compLevel: CompLevel;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {CustomMatch}
 */
export type CustomMatch = {
    id: string;
    eventKey: string;
    matchNumber: number;
    compLevel: CompLevel;
    name: string | null;

    red1: number;
    red2: number;
    red3: number;
    blue1: number;
    blue2: number;
    blue3: number;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {ScoutingSection}
 */
export type ScoutingSection = {
    name: string;
    multiple: 0 | 1;
    dateAdded: string;
    accountId: string;
    id: string;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {Whiteboard}
 */
export type Whiteboard = {
    id: string;
    eventKey: string;
    name: string;
    board: string; // json array
    matchId?: string;
    customMatchId?: string;
};

export type QuestionHistory = {
    questionId: string;
    answer: string;
    teamNumber: number;
    date: string;
    accountId: string;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {MatchScoutingComments}
 */
export type MatchScoutingComments = {
    id: string;
    matchId: string;
    accountId: string;
    team: number;
    comment: string;
    time: string;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {ScoutingQuestionGroup}
 */
export type ScoutingQuestionGroup = {
    id: string;
    eventKey: string;
    section: string;
    name: string;
    dateAdded: string;
    accountId: string;
};

export type ScoutingQuestionGroupExtended = ScoutingQuestionGroup & {
    questions: ScoutingQuestion[];
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {ScoutingQuestion}
 */
export type ScoutingQuestion = {
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
    dateAdded: string;
    accountId: string;
    options: string; // json
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {ScoutingAnswer}
 */
export type ScoutingAnswer = {
    id: string;
    questionId: string;
    answer: string;
    teamNumber: number;
    dateAdded: string;
    accountId: string;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {TBARequest}
 */
export type TBARequest = {
    url: string;
    response: string;
    updated: number;
    update: 0 | 1;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {Checklist}
 */
export type Checklist = {
    id: string;
    name: string;
    eventKey: string;
    description: string;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {ChecklistQuestion}
 */
export type ChecklistQuestion = {
    id: string;
    checklistId: string;
    question: string;
    interval: number;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {CheckListAssignment}
 */
export type CheckListAssignment = {
    checklistId: string;
    accountId: string;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {ChecklistAnswer}
 */
export type ChecklistAnswer = {
    id: string;
    accountId: string;
    questionId: string;
    matchId: string;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {Alliance}
 */
export type Alliance = {
    id: string;
    name: string;
    eventKey: string;
    team1: number;
    team2: number;
    team3: number;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {Strategy}
 */
export type Strategy = {
    id: string;
    time: string;
    name: string;
    createdBy: string;
    whiteboardId: string | null;
    matchId: string | null;
    customMatchId: string | null;
    comment: string;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {MatchScouting}
 */
export type MatchScouting = {
    id: string;
    matchId: string;
    team: number;
    scoutId: string;
    scoutGroup: string;
    time: number;
    preScouting: 0 | 1;
    trace: string; // json array
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {RetrievedMatchScouting}
 */
export type RetrievedMatchScouting = {
    id: string;
    team: number;
    matchId: string;
    scoutId: string;
    time: number;
    scoutGroup: 0 | 1 | 2 | 3 | 4 | 5;
    prescouting: null;
    trace: string; // json array
    eventKey: string;
    matchNumber: number;
    compLevel: string;
    checks: string; // json array
};

export type QuestionType = 'text' | 'number' | 'boolean' | 'select' | 'checkbox' | 'radio' | 'textarea';

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {RetrievedScoutingAnswer}
 */
export type RetrievedScoutingAnswer = {
    id: string;
    teamNumber: number;
    questionId: string;
    answer: string;
    question: string;
    questionKey: string;
    questionDescription: string;
    questionType: QuestionType;
    groupId: string;
    eventKey: string;
    section: string;
    groupName: string;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:57 AM
 *
 * @export
 * @typedef {DiscordPair}
 */
export type DiscordPair = {
    key: string;
    id: string;
    date: string;
};

export type TeamComment = {
    id: string;
    team: string;
    comment: string;
    type: string;
    matchScoutingId: string | null;
    time: string;
    eventKey: string;
};

export type QuestionOptions = Partial<{
    select: string[];
    checkbox: string[];
    radio: string[];
}>;