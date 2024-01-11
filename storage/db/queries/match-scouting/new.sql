INSERT INTO MatchScouting (
    id,
    matchId,
    team,
    scoutId,
    scoutGroup,
    time,
    preScouting,
    trace
) VALUES (
    :id,
    :matchId,
    :team,
    :scoutId,
    :scoutGroup,
    :time,
    :preScouting,
    :trace
);