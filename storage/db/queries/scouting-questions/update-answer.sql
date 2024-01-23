-- insert previous answer into history table
INSERT INTO ScoutingQuestionAnswerHistory (
    questionId,
    answer,
    teamNumber,
    date,
    accountId
) VALUES (
    -- copy from ScoutingAnswers
    (SELECT questionId FROM ScoutingAnswers WHERE id = :id),
    (SELECT answer FROM ScoutingAnswers WHERE id = :id),
    (SELECT teamNumber FROM ScoutingAnswers WHERE id = :id),
    (SELECT date FROM ScoutingAnswers WHERE id = :id),
    (SELECT accountId FROM ScoutingAnswers WHERE id = :id)
);


UPDATE ScoutingAnswers
SET
    questionId = :questionId,
    teamNumber: :teamNumber,
    answer = :answer,
    date = :date,
    accountId = :accountId
WHERE id = :id;