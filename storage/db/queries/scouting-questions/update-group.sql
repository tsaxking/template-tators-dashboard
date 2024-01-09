UPDATE ScoutingQuestionGroups
SET
    eventKey = :eventKey,
    name = :name
    section = :section
WHERE id = :id;