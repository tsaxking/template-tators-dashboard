CREATE TABLE IF NOT EXISTS CustomTbaRequests (
    url TEXT PRIMARY KEY,
    response TEXT,
    updated BIGINT NOT NULL,
    update INTEGER NOT NULL
);