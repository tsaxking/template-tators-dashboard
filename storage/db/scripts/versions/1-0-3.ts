import { DB } from '../../../../server/utilities/databases.ts';
import { Team } from '../../../../shared/db-types-extended.ts';

const teams = await DB.unsafe.all<Team>('SELECT * FROM Teams');

if (teams.isErr()) throw new Error('Error getting teams from database!');

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

for (const team of teams.value) DB.run('teams/new', team);
