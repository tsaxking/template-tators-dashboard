INSERT INTO MatchScouting (
    id,
    matchId,
    team,
    scoutId,
    scoutGroup,
    time,
    preScouting,
    trace,
    checks
) VALUES (
    :id,
    :matchId,
    :team,
    :scoutId,
    :scoutGroup,
    :time,
    :preScouting,
    :trace,
    :checks
);