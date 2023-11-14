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
    passwordChangeDate TEXT,
    phoneNumber TEXT,
    created TEXT NOT NULL,
    discordId TEXT
);

CREATE TABLE IF NOT EXISTS DiscordAccount (
    key TEXT PRIMARY KEY, -- url key
    id TEXT NOT NULL,
    date TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS Members (
    id TEXT PRIMARY KEY,
    title TEXT,
    status TEXT,
    bio TEXT,
    resume TEXT,
    board INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (id) REFERENCES Accounts(id)
);


CREATE TABLE IF NOT EXISTS Roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    rank INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS AccountRoles (
    accountId TEXT NOT NULL,
    roleId TEXT NOT NULL,
    FOREIGN KEY (accountId) REFERENCES Accounts(id),
    FOREIGN KEY (roleId) REFERENCES Roles(id)
);

CREATE TABLE IF NOT EXISTS Permissions (
    roleId TEXT NOT NULL,
    permission TEXT NOT NULL,
    FOREIGN KEY (roleId) REFERENCES Roles(id)
);


-- CREATE TABLE IF NOT EXISTS Limit (
--     ip TEXT PRIMARY KEY,
--     limitStart INTEGER NOT NULL,
--     limitTime INTEGER NOT NULL
-- );


CREATE TABLE IF NOT EXISTS Version (
    version INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS Sessions (
    id TEXT PRIMARY KEY,
    accountId TEXT,
    ip TEXT,
    userAgent TEXT,
    latestActivity TEXT,
    requests INTEGER NOT NULL DEFAULT 0,
    created INTEGER NOT NULL,
    prevUrl TEXT
);


-- CREATE TABLE IF NOT EXISTS BlockList (
--     ip TEXT PRIMARY KEY,
--     created INTEGER NOT NULL
-- );



-- Reset the version number
DELETE FROM Version;


INSERT INTO Version (
    version
) VALUES (
    1
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
    watchPriority INTEGER NOT NULL DEFAULT 0, -- 0 - 10

    FOREIGN KEY (eventKey) REFERENCES Events(eventKey)
);




CREATE TABLE IF NOT EXISTS Matches (
    id TEXT PRIMARY KEY,
    eventKey TEXT NOT NULL,
    matchNumber INTEGER NOT NULL,
    compLevel TEXT NOT NULL,

    FOREIGN KEY (eventKey) REFERENCES Events(eventKey)
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

    FOREIGN KEY (eventKey) REFERENCES Events(eventKey),
    FOREIGN KEY (red1) REFERENCES Teams(number),
    FOREIGN KEY (red2) REFERENCES Teams(number),
    FOREIGN KEY (red3) REFERENCES Teams(number),
    FOREIGN KEY (blue1) REFERENCES Teams(number),
    FOREIGN KEY (blue2) REFERENCES Teams(number),
    FOREIGN KEY (blue3) REFERENCES Teams(number)
);



CREATE TABLE IF NOT EXISTS Whiteboards (
    id TEXT PRIMARY KEY,
    eventKey TEXT NOT NULL,
    name TEXT NOT NULL,
    matchId TEXT, -- NULL if no match (custom whiteboard)
    customMatchId TEXT, -- NULL if no custom match (match whiteboard)
    board TEXT NOT NULL DEFAULT '[]', -- JSON array of objects for canvas
    FOREIGN KEY (eventKey) REFERENCES Events(eventKey),
    FOREIGN KEY (matchId) REFERENCES Matches(id),
    FOREIGN KEY (customMatchId) REFERENCES CustomMatch(id)
);


CREATE TABLE IF NOT EXISTS MatchScouting (
    id TEXT PRIMARY KEY,
    matchId TEXT NOT NULL,
    team INTEGER NOT NULL,
    scoutId TEXT NOT NULL, -- account id
    scoutGroup INTEGER NOT NULL, -- 0 thru 5
    time INTEGER NOT NULL, -- time of submission (in ms)
    prescouting INTEGER NOT NULL DEFAULT 0, -- 0 = not prescouting, 1 = prescouting

    -- Auto


    -- Teleop


    -- Endgame


    -- Misc



    trace TEXT NOT NULL DEFAULT '[]', -- JSON array of objects


    FOREIGN KEY (matchId) REFERENCES Matches(id),
    FOREIGN KEY (team) REFERENCES Teams(number),
    FOREIGN KEY (scoutId) REFERENCES Accounts(id)
);



CREATE TABLE IF NOT EXISTS MatchComments (
    id TEXT PRIMARY KEY,
    matchId TEXT NOT NULL,
    accountId TEXT NOT NULL,
    team INTEGER NOT NULL,
    comment TEXT NOT NULL,
    time INTEGER NOT NULL, -- time of submission (in ms)
    FOREIGN KEY (matchId) REFERENCES Matches(id),
    FOREIGN KEY (accountId) REFERENCES Accounts(id),
    FOREIGN KEY (team) REFERENCES Teams(number)
);


CREATE TABLE ScoutingQuestionSections (
    name TEXT NOT NULL UNIQUE,
    multiple INTEGER NOT NULL DEFAULT 0 -- 0 = there cannot be multiple answers for a submission
);



-- Group of questions
CREATE TABLE ScoutingQuestionGroups (
    id TEXT PRIMARY KEY,
    eventKey TEXT NOT NULL,
    section TEXT NOT NULL, -- section name
    name TEXT NOT NULL,
    FOREIGN KEY (eventKey) REFERENCES Events(eventKey),
    FOREIGN KEY (section) REFERENCES ScoutingQuestionSections(name)
);

CREATE TABLE ScoutingQuestions (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    key TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL, -- boolean/number/text/textarea etc.
    groupId TEXT NOT NULL, -- group id
    FOREIGN KEY (groupId) REFERENCES ScoutingQuestionGroups(id)
);

CREATE TABLE ScoutingAnswers (
    id TEXT PRIMARY KEY,
    questionId TEXT NOT NULL,
    answer TEXT NOT NULL,
    teamNumber INTEGER NOT NULL,
    FOREIGN KEY (questionId) REFERENCES ScoutingQuestions(id),
    FOREIGN KEY (teamNumber) REFERENCES Teams(number)
);

CREATE TABLE IF NOT EXISTS TBARequests (
    url TEXT PRIMARY KEY,
    response TEXT, -- JSON
    updated INTEGER NOT NULL, -- Date of last update (in ms)
    update INTEGER NOT NULL DEFAULT 0
);









CREATE TABLE IF NOT EXISTS Checklists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    eventKey TEXT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (eventKey) REFERENCES Events(eventKey)
);


CREATE TABLE IF NOT EXISTS ChecklistQuestions (
    id TEXT PRIMARY KEY,
    checklistId TEXT NOT NULL,
    question TEXT NOT NULL,
    interval INTEGER NOT NULL, -- positive integer for how often the question should be asked (in matches)
    FOREIGN KEY (checklistId) REFERENCES Checklists(id)
);


CREATE TABLE IF NOT EXISTS ChecklistAssignments (
    checklistId TEXT NOT NULL,
    accountId TEXT NOT NULL,
    FOREIGN KEY (checklistId) REFERENCES Checklists(id),
    FOREIGN KEY (accountId) REFERENCES Accounts(id)
);

-- Only need to record that someone responded, not what they responded with (it's always yes)
CREATE TABLE IF NOT EXISTS ChecklistAnswers (
    id TEXT PRIMARY KEY,
    accountId TEXT NOT NULL, -- the account may not be the one assigned to the checklist
    questionId TEXT NOT NULL,
    matchId TEXT NOT NULL,
    FOREIGN KEY (questionId) REFERENCES ChecklistQuestions(id),
    FOREIGN KEY (matchId) REFERENCES Matches(id),
    FOREIGN KEY (accountId) REFERENCES Accounts(id)
);




CREATE TABLE Alliances (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    eventKey TEXT NOT NULL,
    team1 INTEGER NOT NULL,
    team2 INTEGER NOT NULL,
    team3 INTEGER NOT NULL,

    FOREIGN KEY (eventKey) REFERENCES Events(eventKey),
    FOREIGN KEY (team1) REFERENCES Teams(number),
    FOREIGN KEY (team2) REFERENCES Teams(number),
    FOREIGN KEY (team3) REFERENCES Teams(number)
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

    comment TEXT NOT NULL,


    FOREIGN KEY (whiteboardId) REFERENCES Whiteboards(id),
    FOREIGN KEY (matchId) REFERENCES Matches(id),
    FOREIGN KEY (customMatchId) REFERENCES CustomMatch(id),
    FOREIGN KEY (createdBy) REFERENCES Accounts(id)
);

-- END OF FIRST ROBOTICS