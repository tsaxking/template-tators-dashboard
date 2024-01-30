UPDATE MatchScouting
SET 
    matchId = :matchId,
    team = :team,
    scoutId = :scoutId,
    scoutGroup = :scoutGroup,
    time = :time,
    preScouting = :preScouting,
    trace = :trace,
    checks = :checks
WHERE id = :id;