-- when this runs, the database should be blank, so these queries should be safe to run without deleting dataS

ALTER TABLE MatchScouting DROP COLUMN prescouting;
ALTER TABLE MatchScouting ADD COLUMN preScouting TEXT; -- removing NOT NULL constraint
ALTER TABLE MatchScouting DROP COLUMN time;
ALTER TABLE MatchScouting ADD COLUMN time TEXT; -- changing to TEXT
ALTER TABLE MatchComments ADD COLUMN 'type' TEXT NOT NULL; -- comment/defensive/other
ALTER TABLE MatchComments DROP COLUMN matchId;
ALTER TABLE MatchComments ADD COLUMN matchScoutingId TEXT; -- removing NOT NULL constraint and renaming
ALTER TABLE MatchComments DROP COLUMN accountId;
ALTER TABLE MatchComments ADD COLUMN accountId TEXT; -- removing NOT NULL constraint
ALTER TABLE MatchComments DROP COLUMN time;
ALTER TABLE MatchComments ADD COLUMN time TEXT; -- changing to TEXT
ALTER TABLE MatchComments RENAME TO TeamComments;

-- Something is wrong with foreign keys, so we're dropping them and re-adding them
DROP TABLE IF EXISTS Teams;
CREATE TABLE IF NOT EXISTS Teams (
    number INTEGER NOT NULL,
    eventKey TEXT NOT NULL,
    watchPriority INTEGER NOT NULL DEFAULT 0
);


CREATE TABLE IF NOT EXISTS ScoutingQuestionOptions (
    id TEXT PRIMARY KEY,
    questionId TEXT NOT NULL,
    'option' TEXT NOT NULL,
    'order' INTEGER NOT NULL DEFAULT 0
);


CREATE TABLE IF NOT EXISTS TeamPictures (
    teamNumber INTEGER NOT NULL,
    eventKey TEXT NOT NULL,
    picture TEXT NOT NULL,
    time TEXT NOT NULL DEFAULT '0',
    accountId TEXT NOT NULL DEFAULT '0'
);


CREATE TABLE IF NOT EXISTS MatchScouting2022 (
    id TEXT PRIMARY KEY,
    matchScoutingId TEXT NOT NULL,
    section TEXT NOT NULL, -- auto, teleop, endgame, etc.
    ballsHigh INTEGER NOT NULL DEFAULT 0,
    ballsLow INTEGER NOT NULL DEFAULT 0,
    missed INTEGER NOT NULL DEFAULT 0,
    leaveTarmac INTEGER NOT NULL DEFAULT 0,
    climb4 INTEGER NOT NULL DEFAULT 0,
    climb6 INTEGER NOT NULL DEFAULT 0,
    climb10 INTEGER NOT NULL DEFAULT 0,
    climb15 INTEGER NOT NULL DEFAULT 0,
    totalTime INTEGER NOT NULL DEFAULT 0,
    timeStart INTEGER NOT NULL DEFAULT 0,
    noClimb INTEGER NOT NULL DEFAULT 0,
    fell INTEGER NOT NULL DEFAULT 0,
    climbLevel INTEGER NOT NULL DEFAULT 0,
    stage1Time INTEGER NOT NULL DEFAULT 0,
    stage2Time INTEGER NOT NULL DEFAULT 0,
    stage3Time INTEGER NOT NULL DEFAULT 0,

    misses INTEGER NOT NULL DEFAULT 0,
    bouncedOut INTEGER NOT NULL DEFAULT 0,
    problemsDriving INTEGER NOT NULL DEFAULT 0,
    dead INTEGER NOT NULL DEFAULT 0,
    tippy INTEGER NOT NULL DEFAULT 0,
    easilyDefended INTEGER NOT NULL DEFAULT 0,
    foulsPinningOrHerdingCargo INTEGER NOT NULL DEFAULT 0,
    shootsCargoOverHub INTEGER NOT NULL DEFAULT 0,
    pushesBots INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS MatchScouting2023 (
    id TEXT PRIMARY KEY,
    matchScoutingId TEXT NOT NULL,
    section TEXT NOT NULL, -- auto, teleop, endgame, etc.
    autoMobility INTEGER NOT NULL DEFAULT 0,
    grid TEXT NOT NULL DEFAULT '000000000-000000000-000000000',
    parked INTEGER NOT NULL DEFAULT 0,
    totalDistance INTEGER NOT NULL DEFAULT 0,
    velocity INTEGER NOT NULL DEFAULT 0,
    velocityNoAuto INTEGER NOT NULL DEFAULT 0
);