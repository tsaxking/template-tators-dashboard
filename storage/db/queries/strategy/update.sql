UPDATE Strategy
SET 
    name = :name,
    time = :time,
    createdBy = :createdBy,
    whiteboardId = :whiteboardId,
    matchId = :matchId,
    customMatchId = :customMatchId,
    comment = :comment,
    checks = :checks
WHERE id = :id;
