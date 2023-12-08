UPDATE MatchComments
SET
    matchId = :matchId,
    accountId = :accountId,
    team = :team,
    comment = :comment,
    time = :time
WHERE id = :id;