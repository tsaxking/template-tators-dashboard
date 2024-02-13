UPDATE ScoutingAnswers
SET
    questionId = :questionId,
    teamNumber = :teamNumber,
    answer = :answer,
    date = :date,
    accountId = :accountId
WHERE id = :id;