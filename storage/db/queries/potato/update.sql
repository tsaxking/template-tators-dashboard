UPDATE Potato
SET json = :json,
    lastAccessed = :lastAccessed
WHERE accountId = :accountId;