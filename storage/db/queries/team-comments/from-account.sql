SELECT * FROM TeamComments
WHERE accountId = :accountId
AND archived = false;