-- New version 1.3.1

CREATE TABLE IF NOT EXISTS MatchScoutingArchive (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    eventKey TEXT NOT NULL,
    matchNumber INTEGER NOT NULL,
    teamNumber INTEGER NOT NULL,
    compLevel TEXT NOT NULL,
    created BIGINT NOT NULL
);