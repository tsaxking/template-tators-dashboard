SELECT 
    MatchScouting.*,
    CustomMatches.eventKey as eventKey,
    CustomMatches.matchNumber as matchNumber,
    CustomMatches.compLevel as compLevel


FROM MatchScouting 
INNER JOIN CustomMatches ON CustomMatches.id = MatchScouting.matchId

WHERE MatchScouting.team = :team
    AND eventKey = :eventKey
    AND MatchScouting.preScouting = 1;