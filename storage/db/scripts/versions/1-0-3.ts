import { DB } from '../../../../server/utilities/databases.ts';
import { Team } from '../../../../shared/db-types-extended.ts';

const teams = DB.unsafe.all('SELECT * FROM Teams') as Team[];

DB.unsafe.run(`
    DROP TABLE Teams;
`);

DB.unsafe.run(`
    CREATE TABLE Teams (
        number INTEGER,
        eventKey TEXT,
        watchPriority INTEGER NOT NULL DEFAULT 0,

        FOREIGN KEY (eventKey) REFERENCES Events (eventKey)
    );
`);

for (const team of teams) DB.run('teams/new', team);
