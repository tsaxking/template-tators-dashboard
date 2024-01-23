ALTER TABLE ScoutingAnswers ADD COLUMN IF NOT EXISTS date TEXT NOT NULL DEFAULT '';
ALTER TABLE ScoutingAnswers ADD COLUMN IF NOT EXISTS accountId TEXT NOT NULL DEFAULT '';





ALTER TABLE ScoutingQuestionGroups ADD COLUMN IF NOT EXISTS dateAdded TEXT NOT NULL DEFAULT '';
ALTER TABLE ScoutingQuestionGroups ADD COLUMN IF NOT EXISTS accountId TEXT NOT NULL DEFAULT '';



ALTER TABLE ScoutingQuestions ADD COLUMN IF NOT EXISTS dateAdded TEXT NOT NULL DEFAULT '';
ALTER TABLE ScoutingQuestions ADD COLUMN IF NOT EXISTS accountId TEXT NOT NULL DEFAULT '';
ALTER TABLE ScoutingQuestions ADD COLUMN IF NOT EXISTS options TEXT NOT NULL DEFAULT ''; -- JSON

CREATE TABLE IF NOT EXISTS ScoutingQuestionAnswerHistory (
    questionId TEXT NOT NULL,
    answer TEXT NOT NULL,
    teamNumber INTEGER NOT NULL,
    date TEXT NOT NULL,
    accountId TEXT NOT NULL
);