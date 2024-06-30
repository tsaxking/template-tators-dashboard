UPDATE Potato
SET 
    lastAccessed = :lastAccessed,
    achievements = :achievements,
    shadowAchievements = :shadowAchievements,
    potatoChips = :potatoChips,
    name = :name
WHERE accountId = :accountId;