SELECT * FROM TeamComments
WHERE matchScoutingId = :matchScoutingId
AND archived = 0;