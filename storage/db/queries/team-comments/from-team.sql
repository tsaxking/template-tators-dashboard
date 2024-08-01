SELECT * FROM TeamComments
WHERE team = :team
    AND eventKey = :eventKey
    AND archived = false;