UPDATE ScoutingAnswers
SET
    questionId = :questionId,
    teamNumber: :teamNumber,
    answer = :answer
WHERE id = :id;