UPDATE Strategy
SET 
    name = :name,
    time = :time,
    createdBy = :createdBy,
    whiteboardId = :whiteboardId,
    matchId = :matchId,
    customMatchId = :customMatchId,
    comment = :comment
WHERE id = :id;
