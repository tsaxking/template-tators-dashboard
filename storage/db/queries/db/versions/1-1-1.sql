CREATE TABLE IF NOT EXISTS TeamCommentsHistory (
    id TEXT NOT NULL,
    team INTEGER NOT NULL,
    comment TEXT NOT NULL,
    type TEXT NOT NULL,
    matchScoutingId TEXT,
    accountId TEXT,
    time TEXT NOT NULL,
    eventKey TEXT NOT NULL
);

ALTER TABLE TeamComments ADD COLUMN eventKey TEXT NOT NULL DEFAULT '';
ALTER TABLE MatchScouting ADD COLUMN checks TEXT NOT NULL DEFAULT '[]';