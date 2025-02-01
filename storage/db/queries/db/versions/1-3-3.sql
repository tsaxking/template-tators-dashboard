-- New version 1.3.3

ALTER TABLE MatchScouting DROP COLUMN IF EXISTS prescouting;
ALTER TABLE MatchScouting ADD COLUMN IF NOT EXISTS preScouting TEXT;