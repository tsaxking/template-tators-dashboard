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
    passwordChangeDate BIGINT,
    phoneNumber TEXT,
    created BIGINT NOT NULL,
    discordId TEXT
);

CREATE TABLE IF NOT EXISTS DiscordAccount (
    key TEXT PRIMARY KEY, -- url key
    id TEXT NOT NULL,
    date BIGINT NOT NULL
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
    permission TEXT NOT NULL PRIMARY KEY,
    description TEXT
);

CREATE TABLE IF NOT EXISTS RolePermissions (
    roleId TEXT NOT NULL,
    permission TEXT NOT NULL
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
    latestActivity BIGINT,
    requests INTEGER NOT NULL DEFAULT 0,
    created BIGINT NOT NULL,
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
    number INTEGER NOT NULL,
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
    blue3 INTEGER NOT NULL,
    created BIGINT NOT NULL,
    name TEXT NOT NULL
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
    matchId TEXT, -- can be null in case of prescouting
    team INTEGER NOT NULL,
    scoutId TEXT, -- account id of scout, can be null in case of prescouting
    scoutGroup INTEGER NOT NULL, -- 0 thru 5
    time BIGINT NOT NULL, -- time of submission (in ms)
    prescouting TEXT, 



    trace TEXT NOT NULL DEFAULT '[]', -- JSON array of objects
    checks TEXT NOT NULL DEFAULT '[]'
);


CREATE TABLE IF NOT EXISTS TeamComments (
    id TEXT PRIMARY KEY,
    matchScoutingId TEXT NOT NULL, -- now matchScoutingId
    accountId TEXT, -- can be null if not logged in
    team INTEGER NOT NULL,
    comment TEXT NOT NULL,
    time BIGINT NOT NULL, -- time of submission (in ms)
    type TEXT NOT NULL,
    eventKey TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS ScoutingQuestionSections (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    multiple INTEGER NOT NULL DEFAULT 0, -- 0 = there cannot be multiple answers for a submission
    dateAdded BIGINT NOT NULL,
    accountId TEXT NOT NULL
);



-- Group of questions
CREATE TABLE IF NOT EXISTS ScoutingQuestionGroups (
    id TEXT PRIMARY KEY,
    eventKey TEXT NOT NULL,
    section TEXT NOT NULL, -- section name (references ScoutingQuestionSections)
    name TEXT NOT NULL,
    dateAdded BIGINT NOT NULL,
    accountId TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ScoutingQuestions (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    key TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL, -- boolean/number/text/textarea etc.
    groupId TEXT NOT NULL, -- group id
    dateAdded BIGINT NOT NULL,
    accountId TEXT NOT NULL,
    options TEXT NOT NULL -- JSON
);


CREATE TABLE IF NOT EXISTS ScoutingAnswers (
    id TEXT PRIMARY KEY,
    questionId TEXT NOT NULL,
    answer TEXT NOT NULL,
    teamNumber INTEGER NOT NULL,
    date BIGINT NOT NULL, -- time of submission (in ms)
    accountId TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS TBARequests (
    url TEXT PRIMARY KEY,
    response TEXT, -- JSON
    updated BIGINT NOT NULL, -- Date of last update (in ms)
    update INTEGER NOT NULL DEFAULT 0
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
    comment TEXT NOT NULL

    -- checks TEXT DEFAULT '[]' -- added on 1.3.5
);





CREATE TABLE IF NOT EXISTS TeamPictures (
    teamNumber INTEGER NOT NULL,
    eventKey TEXT NOT NULL,
    picture TEXT NOT NULL,
    time TEXT NOT NULL DEFAULT '0', -- changed to bigint in 1.0.2
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



CREATE TABLE IF NOT EXISTS ScoutingQuestionAnswerHistory (
    questionId TEXT NOT NULL,
    answer TEXT NOT NULL,
    teamNumber INTEGER NOT NULL,
    date TEXT NOT NULL,
    accountId TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ScoutingQuestionHistory (
    id TEXT NOT NULL,
    question TEXT NOT NULL,
    key TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    groupId TEXT NOT NULL,
    dateAdded TEXT NOT NULL,
    accountId TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ScoutingQuestionGroupHistory (
    id TEXT NOT NULL,
    eventKey TEXT NOT NULL,
    section TEXT NOT NULL,
    name TEXT NOT NULL,
    dateAdded TEXT NOT NULL,
    accountId TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ScoutingQuestionSectionHistory (
    id TEXT NOT NULL,
    name TEXT NOT NULL,
    multiple INTEGER NOT NULL,
    dateAdded TEXT NOT NULL,
    accountId TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS TeamCommentsHistory (
    id TEXT NOT NULL,
    team INTEGER NOT NULL,
    comment TEXT NOT NULL,
    type TEXT NOT NULL,
    matchScoutingId TEXT,
    accountId TEXT,
    time TEXT NOT NULL,
    eventKey TEXT NOT NULL
);
