SELECT 
    Strategy.*,
    Matches.eventKey,
    Matches.matchNumber,
    Matches.compLevel
FROM Strategy
INNER JOIN Matches ON Matches.id = Strategy.matchId
WHERE Matches.eventKey = :eventKey
    AND Matches.matchNumber = :matchNumber
    AND Matches.compLevel = :compLevel
    AND archived = 0;