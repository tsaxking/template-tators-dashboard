INSERT INTO TeamComments (
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
    :team,
    :comment,
    :type,
    :matchScoutingId,
    :accountId,
    :time,
    :eventKey
);