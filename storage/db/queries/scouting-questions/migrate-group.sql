INSERT INTO ScoutingQuestionGroupHistory (
    id,
    eventKey,
    section,
    name,
    dateAdded,
    accountId
) VALUES (
    (SELECT id FROM ScoutingQuestionGroup WHERE id = :id),
    (SELECT eventKey FROM ScoutingQuestionGroup WHERE id = :id),
    (SELECT section FROM ScoutingQuestionGroup WHERE id = :id),
    (SELECT name FROM ScoutingQuestionGroup WHERE id = :id),
    (SELECT dateAdded FROM ScoutingQuestionGroup WHERE id = :id),
    (SELECT accountId FROM ScoutingQuestionGroup WHERE id = :id)
);