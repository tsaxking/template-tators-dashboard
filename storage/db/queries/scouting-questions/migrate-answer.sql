INSERT INTO ScoutingQuestionAnswerHistory (
    id,
    questionId,
    answer,
    date,
    accountId
) VALUES (
    (SELECT id FROM ScoutingQuestionAnswer WHERE id = :id),
    (SELECT questionId FROM ScoutingQuestionAnswer WHERE id = :id),
    (SELECT answer FROM ScoutingQuestionAnswer WHERE id = :id),
    (SELECT date FROM ScoutingQuestionAnswer WHERE id = :id),
    (SELECT accountId FROM ScoutingQuestionAnswer WHERE id = :id)
);