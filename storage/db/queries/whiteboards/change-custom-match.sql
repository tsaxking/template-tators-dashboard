UPDATE Whiteboards
SET customMatchId = :customMatchId
WHERE id = :id
AND archived = 0;