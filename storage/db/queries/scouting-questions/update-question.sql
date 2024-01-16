UPDATE ScoutingQuestions 
SET
    question = :question,
    key = :key,
    description = :description,
    type = :type,
    groupId = :groupId
WHERE id = :id;