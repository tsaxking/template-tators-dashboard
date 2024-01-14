SELECT 
    MatchScouting.*
FROM MatchScouting
INNER JOIN ON Matches
    WHERE Matches.id = MatchScouting.matchId
    AND MatchScouting.scoutId = :scoutId;