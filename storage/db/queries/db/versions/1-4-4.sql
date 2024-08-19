ALTER TABLE Strategy DROP COLUMN whiteboardId;

ALTER TABLE Whiteboards DROP COLUMN matchId;
ALTER TABLE Whiteboards DROP COLUMN customMatchId;
ALTER TABLE Whiteboards DROP COLUMN eventKey;
ALTER TABLE Whiteboards ADD COLUMN strategyId TEXT NOT NULL;