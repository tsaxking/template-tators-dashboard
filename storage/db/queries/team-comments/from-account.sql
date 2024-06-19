SELECT * FROM TeamComments
WHERE accountId = :accountId
AND archived = 0;