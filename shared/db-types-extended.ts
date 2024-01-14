export type Event = {
    eventKey: string;
    flipX: 0 | 1;
    flipY: 0 | 1;
};

export type Team = {
    number: number;
    watchPriority: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    eventKey: string;
};

export type CompLevel = 'pr' | 'qm' | 'ef' | 'qf' | 'sf' | 'f';

export type Match = {
    id: string;
    eventKey: string;
    matchNumber: number;
    compLevel: CompLevel;
};

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

export type ScoutingSection = {
    name: string;
    multiple: 0 | 1;
};

export type Whiteboard = {
    id: string;
    eventKey: string;
    name: string;
    board: string; // json array
    matchId?: string;
    customMatchId?: string;
};

export type MatchScoutingComments = {
    id: string;
    matchId: string;
    accountId: string;
    team: number;
    comment: string;
    time: string;
};

export type ScoutingQuestionSection = {
    name: string;
    multiple: boolean;
};

export type ScoutingQuestionGroup = {
    id: string;
    eventKey: string;
    section: string;
    name: string;
};

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
};

export type ScoutingAnswer = {
    id: string;
    questionId: string;
    answer: string;
    teamNumber: number;
};

export type TBARequest = {
    url: string;
    response: string;
    updated: number;
    update: 0 | 1;
};

export type Checklist = {
    id: string;
    name: string;
    eventKey: string;
    description: string;
};

export type ChecklistQuestion = {
    id: string;
    checklistId: string;
    question: string;
    interval: number;
};

export type CheckListAssignment = {
    checklistId: string;
    accountId: string;
};

export type ChecklistAnswer = {
    id: string;
    accountId: string;
    questionId: string;
    matchId: string;
};

export type Alliance = {
    id: string;
    name: string;
    eventKey: string;
    team1: number;
    team2: number;
    team3: number;
};

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

export type RetrievedMatchScouting = {
    id: string;
    team: number;
    matchId: string;
    scoutId: string;
    time: number;
    scoutGroup: string;
    prescouting: 0 | 1;
    trace: string; // json array
    eventKey: string;
    matchNumber: number;
    compLevel: string;
};

export type RetrievedScoutingAnswer = {
    id: string;
    teamNumber: number;
    questionId: string;
    answer: string;
    question: string;
    questionKey: string;
    questionDescription: string;
    questionType:
        | 'text'
        | 'number'
        | 'boolean'
        | 'select'
        | 'checkbox'
        | 'radio'
        | 'textarea';
    groupId: string;
    eventKey: string;
    section: string;
    groupName: string;
};

export type DiscordPair = {
    key: string;
    id: string;
    date: string;
};
