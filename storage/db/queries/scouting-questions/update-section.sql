INSERT INTO ScoutingQuestionSectionsHistory (
    name,
    multiple,
    dateAdded,
    accountId,
    id
) VALUES (
    (SELECT name FROM ScoutingQuestionSections WHERE id = :id),
    (SELECT multiple FROM ScoutingQuestionSections WHERE id = :id),
    (SELECT dateAdded FROM ScoutingQuestionSections WHERE id = :id),
    (SELECT accountId FROM ScoutingQuestionSections WHERE id = :id),
    (SELECT id FROM ScoutingQuestionSections WHERE id = :id)
);

UPDATE ScoutingQuestionSections
SET
    name = :name,
    multiple = :multiple,
    dateAdded = :dateAdded,
    accountId = :accountId
WHERE id = :id;