INSERT INTO MatchScouting (
    id,
    matchId,
    team,
    scoutId,
    scoutGroup,
    time,
    preScouting,
    trace,
    checks,
    scoutName
) VALUES (
    :id,
    :matchId,
    :team,
    :scoutId,
    :scoutGroup,
    :time,
    :preScouting,
    :trace,
    :checks,
    :scoutName
);