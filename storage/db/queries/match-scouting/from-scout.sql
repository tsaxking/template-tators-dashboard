SELECT 
    MatchScouting.*,
    Matches.eventKey as eventKey,
    Matches.matchNumber as matchNumber,
    Matches.compLevel as compLevel
FROM MatchScouting
INNER JOIN ON Matches
    WHERE Matches.id = MatchScouting.matchId
    WHERE Matches.eventKey = :eventKey
    AND MatchScouting.scoutId = :scoutId
    OR MatchScouting.scoutName = :scoutId
    AND MatchScouting.archived = false;