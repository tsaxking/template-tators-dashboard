UPDATE Checklists
SET
    name = :name,
    description = :description,
    eventKey = :eventKey
WHERE id = :id;