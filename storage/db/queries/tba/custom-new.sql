INSERT INTO CustomTBARequests (
    url,
    response,
    updated,
    update
) VALUES (
    :url,
    :response,
    :updated,
    :update
) ON CONFLICT (url) DO UPDATE SET
    response = :response,
    updated = :updated,
    update = :update