SELECT 
    MatchScouting.id as id,
    MatchScouting.team as team,
    MatchScouting.matchId as matchId,
    MatchScouting.scoutId as scoutId,
    MatchScouting.time as time,
    MatchScouting.scoutGroup as scoutGroup,
    MatchScouting.prescouting as prescouting,
    MatchScouting.trace as trace,
    Matches.eventKey as eventKey,
    Matches.matchNumber as matchNumber,
    Matches.compLevel as compLevel

FROM MatchScouting 
INNER JOIN Matches ON Matches.id = MatchScouting.matchId

WHERE MatchScouting.team = :team
    AND Matches.eventKey = :eventKey