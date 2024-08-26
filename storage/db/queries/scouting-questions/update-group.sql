UPDATE ScoutingQuestionGroups
SET
    eventKey = :eventKey,
    name = :name,
    accountId = :accountId,
    dateAdded = :dateAdded
WHERE id = :id;