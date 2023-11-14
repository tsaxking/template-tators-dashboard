SELECT * FROM MatchScouting 
WHERE matchId = :matchId
    AND eventKey = :eventKey;