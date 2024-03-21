-- Change MatchScouting.preScouting from text to number

ALTER TABLE MatchScouting
    DROP COLUMN preScouting;

ALTER TABLE MatchScouting
    ADD COLUMN preScouting INTEGER NOT NULL DEFAULT 0;