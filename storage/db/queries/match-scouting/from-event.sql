SELECT 
    MatchScouting.*,
    Matches.eventKey as eventKey,
    Matches.matchNumber as matchNumber,
    Matches.compLevel as compLevel

FROM MatchScouting
INNER JOIN Matches ON Matches.id = MatchScouting.matchId

WHERE Matches.eventKey = :eventKey
    AND MatchScouting.archived = false;