ALTER TABLE ScoutingAnswers ADD COLUMN date TEXT NOT NULL DEFAULT '';
ALTER TABLE ScoutingAnswers ADD COLUMN accountId TEXT NOT NULL DEFAULT '';





ALTER TABLE ScoutingQuestionGroups ADD COLUMN dateAdded TEXT NOT NULL DEFAULT '';
ALTER TABLE ScoutingQuestionGroups ADD COLUMN accountId TEXT NOT NULL DEFAULT '';



ALTER TABLE ScoutingQuestions ADD COLUMN dateAdded TEXT NOT NULL DEFAULT '';
ALTER TABLE ScoutingQuestions ADD COLUMN accountId TEXT NOT NULL DEFAULT '';
ALTER TABLE ScoutingQuestions ADD COLUMN options TEXT NOT NULL DEFAULT ''; -- JSON

ALTER TABLE ScoutingQuestionSections ADD COLUMN dateAdded TEXT NOT NULL DEFAULT '';
ALTER TABLE ScoutingQuestionSections ADD COLUMN accountId TEXT NOT NULL DEFAULT '';
ALTER TABLE ScoutingQuestionSections ADD COLUMN id TEXT NOT NULL DEFAULT '';



CREATE TABLE IF NOT EXISTS ScoutingQuestionAnswerHistory (
    questionId TEXT NOT NULL,
    answer TEXT NOT NULL,
    teamNumber INTEGER NOT NULL,
    date TEXT NOT NULL,
    accountId TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ScoutingQuestionHistory (
    id TEXT NOT NULL,
    question TEXT NOT NULL,
    key TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    groupId TEXT NOT NULL,
    dateAdded TEXT NOT NULL,
    accountId TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ScoutingQuestionGroupHistory (
    id TEXT NOT NULL,
    eventKey TEXT NOT NULL,
    section TEXT NOT NULL,
    name TEXT NOT NULL,
    dateAdded TEXT NOT NULL,
    accountId TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ScoutingQuestionSectionHistory (
    id TEXT NOT NULL,
    name TEXT NOT NULL,
    multiple INTEGER NOT NULL,
    dateAdded TEXT NOT NULL,
    accountId TEXT NOT NULL
);