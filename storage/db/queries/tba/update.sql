UPDATE TBARequests
SET
    response = :response,
    updated = :updated,
    update = :update
WHERE url = :url;