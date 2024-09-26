UPDATE ScoutingQuestionSections
SET
    name = :name,
    multiple = :multiple,
    dateAdded = :dateAdded,
    accountId = :accountId
WHERE id = :id;