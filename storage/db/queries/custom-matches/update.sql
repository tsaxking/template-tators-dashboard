UPDATE CustomMatches
SET
    eventKey = :eventKey,
    matchNumber = :matchNumber,
    compLevel = :compLevel,
    red1 = :red1,
    red2 = :red2,
    red3 = :red3,
    red4 = :red4,
    blue1 = :blue1,
    blue2 = :blue2,
    blue3 = :blue3,
    blue4 = :blue4,
    name = :name,
    archive = :archive
WHERE
    id = :id;