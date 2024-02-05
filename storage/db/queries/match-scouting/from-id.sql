SELECT 
    MatchScouting.*,
    Matches.matchNumber as matchNumber,
    Matches.compLevel as compLevel,
    MatchScouting.checks as checks

FROM MatchScouting
INNER JOIN Matches ON Matches.id = MatchScouting.matchId

WHERE MatchScouting.id = :id;