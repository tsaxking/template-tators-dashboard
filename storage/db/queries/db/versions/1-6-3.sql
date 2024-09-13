CREATE TABLE IF NOT EXISTS CustomTBARequests (
    url TEXT PRIMARY KEY,
    response TEXT,
    updated BIGINT NOT NULL,
    update INTEGER NOT NULL
);