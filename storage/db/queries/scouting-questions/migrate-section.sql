INSERT INTO ScoutingQuestionSectionHistory (
    id,
    name,
    multiple,
    dateAdded,
    accountId
) VALUES (
    (SELECT id FROM ScoutingQuestionSection WHERE id = :id),
    (SELECT name FROM ScoutingQuestionSection WHERE id = :id),
    (SELECT multiple FROM ScoutingQuestionSection WHERE id = :id),
    (SELECT dateAdded FROM ScoutingQuestionSection WHERE id = :id),
    (SELECT accountId FROM ScoutingQuestionSection WHERE id = :id)
);
