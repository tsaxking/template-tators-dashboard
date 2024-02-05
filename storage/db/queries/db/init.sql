CREATE TABLE IF NOT EXISTS Accounts (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    key TEXT NOT NULL,
    salt TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordChange TEXT,
    picture TEXT,
    verified INTEGER NOT NULL DEFAULT 0,
    verification TEXT,
    emailChange TEXT,
    passwordChangeDate INTEGER,
    phoneNumber TEXT,
    created INTEGER NOT NULL,
    discordId TEXT
);

CREATE TABLE IF NOT EXISTS DiscordAccount (
    key TEXT PRIMARY KEY, -- url key
    id TEXT NOT NULL,
    date INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS Members (
    id TEXT PRIMARY KEY,
    title TEXT,
    status TEXT DEFAULT 'pending',
    bio TEXT,
    resume TEXT,
    board INTEGER NOT NULL DEFAULT 0
);


CREATE TABLE IF NOT EXISTS Roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    rank INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS AccountRoles (
    accountId TEXT NOT NULL,
    roleId TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Permissions (
    -- removed in 1-2-0.sql
    roleId TEXT NOT NULL,
    permission TEXT NOT NULL,
    description TEXT
);


-- CREATE TABLE IF NOT EXISTS Limit (
--     ip TEXT PRIMARY KEY,
--     limitStart INTEGER NOT NULL,
--     limitTime INTEGER NOT NULL
-- );


CREATE TABLE IF NOT EXISTS Version (
    major INTEGER NOT NULL DEFAULT 1,
    minor INTEGER NOT NULL DEFAULT 0,
    patch INTEGER NOT NULL DEFAULT 0
);


CREATE TABLE IF NOT EXISTS Sessions (
    id TEXT PRIMARY KEY,
    accountId TEXT,
    ip TEXT,
    userAgent TEXT,
    latestActivity INTEGER,
    requests INTEGER NOT NULL DEFAULT 0,
    created INTEGER NOT NULL,
    prevUrl TEXT
);

CREATE TABLE IF NOT EXISTS AccountSettings (
    accountId TEXT NOT NULL PRIMARY KEY,
    settings TEXT NOT NULL -- JSON
);

-- CREATE TABLE IF NOT EXISTS BlockList (
--     ip TEXT PRIMARY KEY,
--     created INTEGER NOT NULL
-- );



-- Reset the version number
DELETE FROM Version;

INSERT INTO Version (
    major,
    minor,
    patch
) VALUES (
    1,
    0,
    0
);











-- FIRST ROBOTICS

CREATE TABLE IF NOT EXISTS Events (
    eventKey TEXT PRIMARY KEY,
    -- FIELD Orientation: (default blue alliance on left)
    flipX INTEGER NOT NULL DEFAULT 0,
    flipY INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Teams (
    number INTEGER NOT NULL UNIQUE,
    eventKey TEXT NOT NULL,
    watchPriority INTEGER NOT NULL DEFAULT 0 -- 0 - 10
);




CREATE TABLE IF NOT EXISTS Matches (
    id TEXT PRIMARY KEY,
    eventKey TEXT NOT NULL,
    matchNumber INTEGER NOT NULL,
    compLevel TEXT NOT NULL
);



CREATE TABLE IF NOT EXISTS CustomMatches (
    id TEXT PRIMARY KEY,
    eventKey TEXT NOT NULL,
    matchNumber INTEGER NOT NULL,
    compLevel TEXT NOT NULL,
    red1 INTEGER NOT NULL, 
    red2 INTEGER NOT NULL, 
    red3 INTEGER NOT NULL, 
    blue1 INTEGER NOT NULL,
    blue2 INTEGER NOT NULL,
    blue3 INTEGER NOT NULL
    -- added name column in 1-0-2.sql
);



CREATE TABLE IF NOT EXISTS Whiteboards (
    id TEXT PRIMARY KEY,
    eventKey TEXT NOT NULL,
    name TEXT NOT NULL,
    matchId TEXT, -- NULL if no match (custom whiteboard)
    customMatchId TEXT, -- NULL if no custom match (match whiteboard)
    board TEXT NOT NULL DEFAULT '[]' -- JSON array of objects for canvas
);


CREATE TABLE IF NOT EXISTS MatchScouting (
    id TEXT PRIMARY KEY,
    matchId TEXT NOT NULL, -- removed NOT NULL in 1-0-4.sql in case of prescouting
    team INTEGER NOT NULL,
    scoutId TEXT NOT NULL, -- account id of scout, removed NOT NULL in 1-0-4.sql in case of prescouting
    scoutGroup INTEGER NOT NULL, -- 0 thru 5
    time INTEGER NOT NULL, -- time of submission (in ms), changed to TEXT in 1-0-4.sql
    prescouting INTEGER NOT NULL DEFAULT 0, -- changed to TEXT in 1-0-4.sql for event key. Renamed to preScouting



    trace TEXT NOT NULL DEFAULT '[]' -- JSON array of objects

    -- added checks column in 1-1-1.sql
);


-- Renamed to TeamComments in 1-0-4.sql
CREATE TABLE IF NOT EXISTS MatchComments (
    id TEXT PRIMARY KEY,
    matchId TEXT NOT NULL, -- now matchScoutingId
    accountId TEXT NOT NULL,
    team INTEGER NOT NULL,
    comment TEXT NOT NULL,
    time INTEGER NOT NULL -- time of submission (in ms)
    -- added type column in 1-0-4.sql
    -- added eventKey column in 1-1-1.sql
);


CREATE TABLE IF NOT EXISTS ScoutingQuestionSections (
    name TEXT NOT NULL UNIQUE,
    multiple INTEGER NOT NULL DEFAULT 0 -- 0 = there cannot be multiple answers for a submission
    -- id column added in 1-0-5.sql
    -- dateAdded column added in 1-0-5.sql
    -- accountId column added in 1-0-5.sql
);



-- Group of questions
CREATE TABLE IF NOT EXISTS ScoutingQuestionGroups (
    id TEXT PRIMARY KEY,
    eventKey TEXT NOT NULL,
    section TEXT NOT NULL, -- section name (references ScoutingQuestionSections)
    name TEXT NOT NULL
    -- added dateAdded column in 1-0-5.sql
    -- added accountId column in 1-0-5.sql
);

CREATE TABLE IF NOT EXISTS ScoutingQuestions (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    key TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL, -- boolean/number/text/textarea etc.
    groupId TEXT NOT NULL -- group id
    -- added dateAdded column in 1-0-5.sql
    -- added accountId column in 1-0-5.sql
    -- added options column in 1-0-5.sql (JSON)
);

-- Added table for select/checkbox/radio etc. options in 1-0-4.sql

CREATE TABLE IF NOT EXISTS ScoutingAnswers (
    id TEXT PRIMARY KEY,
    questionId TEXT NOT NULL,
    answer TEXT NOT NULL,
    teamNumber INTEGER NOT NULL
    -- added date column in 1-0-5.sql
    -- added accountId column in 1-0-5.sql
);

CREATE TABLE IF NOT EXISTS TBARequests (
    url TEXT PRIMARY KEY,
    response TEXT, -- JSON
    updated INTEGER NOT NULL, -- Date of last update (in ms)
    'update' INTEGER NOT NULL DEFAULT 0
);









CREATE TABLE IF NOT EXISTS Checklists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    eventKey TEXT NOT NULL,
    description TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS ChecklistQuestions (
    id TEXT PRIMARY KEY,
    checklistId TEXT NOT NULL,
    question TEXT NOT NULL,
    interval INTEGER NOT NULL -- positive integer for how often the question should be asked (in matches)
);


CREATE TABLE IF NOT EXISTS ChecklistAssignments (
    checklistId TEXT NOT NULL,
    accountId TEXT NOT NULL
);

-- Only need to record that someone responded, not what they responded with (it's always yes)
CREATE TABLE IF NOT EXISTS ChecklistAnswers (
    id TEXT PRIMARY KEY,
    accountId TEXT NOT NULL, -- the account may not be the one assigned to the checklist
    questionId TEXT NOT NULL,
    matchId TEXT NOT NULL
);




CREATE TABLE Alliances (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    eventKey TEXT NOT NULL,
    team1 INTEGER NOT NULL,
    team2 INTEGER NOT NULL,
    team3 INTEGER NOT NULL
);





CREATE TABLE IF NOT EXISTS Strategy (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    time INTEGER NOT NULL, -- time of submission (in ms)
    createdBy TEXT NOT NULL, -- account id
    whiteboardId TEXT, -- If paired with a whiteboard
    matchId TEXT, -- If paired with a match
    customMatchId TEXT, -- If paired with a custom match

    -- Auto


    -- Teleop


    -- Endgame


    -- Misc

    comment TEXT NOT NULL
);

-- END OF FIRST ROBOTICS
