UPDATE ScoutingQuestions 
SET
    question = :question,
    key = :key,
    description = :description,
    type = :type,
    groupId = :groupId,
    accountId = :accountId,
    dateAdded = :dateAdded,
    options = :options
WHERE id = :id;