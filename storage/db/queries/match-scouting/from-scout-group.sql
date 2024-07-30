SELECT 
    MatchScouting.*,
    Matches.eventKey as eventKey,
    Matches.matchNumber as matchNumber,
    Matches.compLevel as compLevel
FROM MatchScouting
INNER JOIN ON Matches
    WHERE Matches.id = MatchScouting.matchId
    WHERE Matches.eventKey = :eventKey
    AND MatchScouting.scoutGroup = :scoutGroup
    AND MatchScouting.preScouting = 0
    AND MatchScouting.archived = false;