UPDATE MatchScouting
SET 
    matchId = :matchId,
    team = :team,
    scoutId = :scoutId,
    scoutGroup = :scoutGroup,
    time = :time,
    preScouting = :preScouting,
    trace = :trace
WHERE id = :id;