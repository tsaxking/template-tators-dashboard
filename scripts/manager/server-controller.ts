import { TBA } from '../../server/utilities/tba/tba';
import { TBAEvent } from '../../shared/submodules/tatorscout-calculations/tba';
import { backToMain, selectFile } from '../manager';
import { confirm, search, select } from '../prompt';
import { pullEvent } from '../../server/utilities/tba/pull-event';
import { Backup, DB } from '../../server/utilities/databases';
import { runFile } from '../../server/utilities/run-task';
import { RetrievedMatchScouting } from '../../server/utilities/tables';
import { dateTime } from '../../shared/clock';

export const pullEvents = async () => {
    const year = await select(
        'Please select year',
        new Array(new Date().getFullYear() - 2006).fill(0).map((_, i) => {
            return {
                name: (new Date().getFullYear() - i).toString(),
                value: new Date().getFullYear() - i
            };
        })
    );

    if (!year) return backToMain('No year selected');

    const events = await TBA.get<TBAEvent[]>(`/team/frc2122/events/${year}`);

    if (events.isOk()) {
        if (!events.value) {
            return backToMain('No events found');
        }

        const event = await select(
            'Select an event to pull',
            events.value.map(e => ({
                name: e.name,
                value: e
            }))
        );

        if (!event) return backToMain('No event selected');

        const res = await pullEvent(event.key);
        if (res.isErr()) return backToMain('Error pulling event: ' + res.error);
        return backToMain('Event pulled successfully');
    }
    return backToMain('Error retrieving events: ' + events.error);
};

const transferDb = async (...args: string[]) => {
    const oldDb = await selectFile('..', 'Select old database to transfer', f =>
        f.endsWith('.db')
    );
    if (oldDb.isErr()) {
        return backToMain('Error selecting old database: ' + oldDb.error);
    }

    await Backup.makeBackup();

    const res = await runFile(
        'scripts/transfer-db.ts',
        'runTransfer',
        `db=${oldDb.value}`,
        ...args
    );

    if (res.isErr()) {
        return backToMain('Error transferring database: ' + res.error);
    }
    return backToMain('Database transferred successfully');
};

const transferAccounts = () => {
    transferDb('accounts');
};

const unverifyAllAccounts = async () => {
    const c = await confirm('Are you sure you want to unverify all accounts?');
    if (c) {
        await DB.unsafe.run(`
            UPDATE accounts
            SET verified = 0
        `);

        backToMain('All accounts unverified');
    } else {
        backToMain('Accounts not unverified');
    }
};

const removePassword = async () => {
    const c = await confirm('Are you sure you want to remove all passwords?');
    if (c) {
        await DB.unsafe.run(
            `
            UPDATE Accounts
                SET key = :key, salt = :salt;
        `,
            {
                key: '',
                salt: ''
            }
        );

        backToMain('All passwords removed');
    } else {
        backToMain('Passwords not removed');
    }
};

const deleteMatchScouting = async () => {
    const scoutings = await DB.unsafe.all<RetrievedMatchScouting>(`SELECT 
MatchScouting.*,
Matches.eventKey as eventKey,
Matches.matchNumber as matchNumber,
Matches.compLevel as compLevel

FROM MatchScouting
INNER JOIN Matches ON Matches.id = MatchScouting.matchId;
`);
    if (scoutings.isErr()) throw scoutings.error;

    const events = scoutings.value
        .filter(
            (s, i, a) => a.findIndex(_s => _s.eventKey === s.eventKey) === i
        )
        .map(s => s.eventKey);

    const event = await select(
        'Please select event',
        events.map(v => {
            return {
                name: v,
                value: v
            };
        })
    );

    const filteredScoutings = scoutings.value.filter(s => s.eventKey === event);

    const matches = filteredScoutings.filter(
        (s, i, a) => a.findIndex(_s => s.matchId === _s.matchId) === i
    );
    const match = await search(
        'Please select match',
        matches.map(m => m.matchNumber.toString())
    );

    if (match.isErr()) throw match.error;

    const robots = filteredScoutings.filter(
        s => s.matchNumber === +match.value
    );

    // match 8 2288

    const selectedBot = await select(
        'Please select team',
        robots.map(r => ({
            name: `${r.team} | ${r.matchNumber} | ${r.compLevel} | ${r.scoutGroup} | ${dateTime(new Date(r.time))}`,
            value: r
        }))
    );

    const confirmed = await confirm(
        'Are you sure you want to delete this match?'
    );
    if (!confirmed) return backToMain('Did not delete match');

    const result = await DB.unsafe.run(
        `
        DELETE FROM MatchScouting
        WHERE id = :id
    `,
        {
            id: selectedBot.id
        }
    );

    if (result.isErr()) throw result.error;

    backToMain('Deleted match');
};

export const serverController = [
    {
        value: pullEvents,
        icon: '🔄',
        description: 'Pull events from TBA and place into database'
    },
    // {
    //     value: transferDb,
    //     icon: '🔄',
    //     description: 'Transfer old database to new database',
    // },
    {
        value: transferAccounts,
        icon: '🔄',
        description: 'Transfer old accounts to new database'
    },
    {
        value: unverifyAllAccounts,
        icon: '❌',
        description: 'Unverify all accounts'
    },
    {
        value: removePassword,
        icon: '🗑️',
        description: 'Remove all passwords'
    },
    {
        value: deleteMatchScouting,
        icon: '🗑️',
        description: 'Deletes a specific match scouting from the database'
    }
];
