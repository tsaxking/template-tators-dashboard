SELECT 
    Strategy.id as id,
    Strategy.name as name,
    Strategy.time as time,
    Strategy.createdBy as createdBy,
    Strategy.whiteboardId as whiteboardId,
    Strategy.matchId as matchId,
    Strategy.customMatchId as customMatchId,

    -- Auto/Teleop/Endgame/Misc

    Strategy.comment
FROM Strategy
INNER JOIN Matches ON Matches.id = Strategy.matchId
WHERE Matches.eventKey = :eventKey
    AND Matches.matchNumber = :matchNumber
    AND Matches.compLevel = :compLevel;