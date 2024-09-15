CREATE TABLE IF NOT EXISTS StrategyConfigs (
    id TEXT PRIMARY KEY NOT NULL,
    strategyId TEXT NOT NULL,
    team INTEGER NOT NULL,
    type TEXT NOT NULL,
    value TEXT NOT NULL
);