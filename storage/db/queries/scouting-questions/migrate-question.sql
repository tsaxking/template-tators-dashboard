INSERT INTO ScoutingQuestionHistory (
    id,
    question,
    key,
    description,
    type,
    groupid,
    dateAdded,
    accountId
) VALUES (
    (SELECT id FROM ScoutingQuestion WHERE id = :id),
    (SELECT question FROM ScoutingQuestion WHERE id = :id),
    (SELECT key FROM ScoutingQuestion WHERE id = :id),
    (SELECT description FROM ScoutingQuestion WHERE id = :id),
    (SELECT type FROM ScoutingQuestion WHERE id = :id),
    (SELECT groupid FROM ScoutingQuestion WHERE id = :id),
    (SELECT dateAdded FROM ScoutingQuestion WHERE id = :id),
    (SELECT accountId FROM ScoutingQuestion WHERE id = :id)
);