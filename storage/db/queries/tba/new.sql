INSERT INTO TBARequests (
    url,
    response,
    updated,
    update,
    override
) VALUES (
    :url,
    :response,
    :updated,
    :update,
    :override
) ON CONFLICT (url) DO UPDATE SET
    response = :response,
    updated = :updated,
    update = :update,
    override = :override;