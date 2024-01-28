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

DELETE FROM ScoutingAnswers WHERE id = :id;