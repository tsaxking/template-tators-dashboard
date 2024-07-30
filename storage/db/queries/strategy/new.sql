INSERT INTO Strategy (
    id,
    name,
    time,
    createdBy,
    whiteboardId,
    matchId,
    customMatchId,
    comment,
    checks
) VALUES (
    :id,
    :name,
    :time,
    :createdBy,
    :whiteboardId,
    :matchId,
    :customMatchId,
    :comment,
    :checks
);