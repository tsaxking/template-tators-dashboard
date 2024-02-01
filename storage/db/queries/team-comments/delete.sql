INSERT INTO TeamCommentsHistory (
    id,
    team,
    comment,
    type,
    matchScoutingId,
    accountId,
    time,
    eventKey
) VALUES (
    :id,
    (SELECT team FROM TeamComments WHERE id = :id),
    (SELECT comment FROM TeamComments WHERE id = :id),
    (SELECT type FROM TeamComments WHERE id = :id),
    (SELECT matchScoutingId FROM TeamComments WHERE id = :id),
    (SELECT accountId FROM TeamComments WHERE id = :id),
    (SELECT time FROM TeamComments WHERE id = :id),
    (SELECT eventKey FROM TeamComments WHERE id = :id)
);

DELETE FROM TeamComments
WHERE id = :id;