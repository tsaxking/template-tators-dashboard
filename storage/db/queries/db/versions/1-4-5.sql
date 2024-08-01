CREATE TABLE IF NOT EXISTS Potato (
    accountId TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    lastAccessed INTEGER NOT NULL,
    achievements JSON NOT NULL,
    shadowAchievements JSON NOT NULL,
    potatoChips INTEGER NOT NULL
);