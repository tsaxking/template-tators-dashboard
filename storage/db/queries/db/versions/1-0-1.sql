ALTER TABLE Version RENAME COLUMN version TO major;
ALTER TABLE Version ADD COLUMN minor INTEGER NOT NULL DEFAULT 0;
ALTER TABLE Version ADD COLUMN patch INTEGER NOT NULL DEFAULT 0;