INSERT INTO MatchComments (
    id,
    matchId,
    accountId,
    team,
    comment,
    time
) VALUES (
    :id,
    :matchId,
    :accountId,
    :team,
    :comment,
    :time
);