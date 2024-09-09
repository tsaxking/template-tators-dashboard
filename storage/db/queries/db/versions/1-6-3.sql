CREATE TABLE IF NOT EXISTS Potato (
    accountId TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    lastAccessed BIGINT NOT NULL,
    achievements TEXT NOT NULL DEFAULT '[]',
    shadowAchievements TEXT NOT NULL DEFAULT '[]',
    potatoChips INTEGER NOT NULL
);