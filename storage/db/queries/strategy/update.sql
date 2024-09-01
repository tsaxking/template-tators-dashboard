UPDATE Strategy
SET 
    name = :name,
    time = :time,
    createdBy = :createdBy,
    matchId = :matchId,
    customMatchId = :customMatchId,
    comment = :comment,
    checks = :checks
WHERE id = :id;
