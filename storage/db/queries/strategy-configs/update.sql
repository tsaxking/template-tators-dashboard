UPDATE StrategyConfigs
SET team = :team,
    type = :type,
    value = :value
WHERE id = :id;