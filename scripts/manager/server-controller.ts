import { TBA } from '../../server/utilities/tba/tba';
import { TBAEvent } from '../../shared/submodules/tatorscout-calculations/tba';
import { backToMain, selectFile } from '../manager';
import { confirm, select } from '../prompt';
import { pullEvent } from '../../server/utilities/tba/pull-event';
import { DB } from '../../server/utilities/databases';
import { runFile } from '../../server/utilities/run-task';

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
    } else {
        return backToMain('Error retrieving events: ' + events.error);
    }
};

const transferDb = async (...args: string[]) => {
    const oldDb = await selectFile('..', 'Select old database to transfer', f =>
        f.endsWith('.db')
    );
    if (oldDb.isErr()) {
        return backToMain('Error selecting old database: ' + oldDb.error);
    }

    await DB.makeBackup();

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
    const events = await TBA.get<TBAEvent[]>('/team/frc2122/events/2024');
    if (events.isErr()) throw events.error;
    console.log(events);
    if (!events.value) return backToMain('No events found');
    
    const event = await select(
        'Please select event',
        events.value.map(v => {
            return {
                name: v.key,
                value: v
            }
        })
    );

    if (!event) return backToMain('Event not selected');

    const scoutings = await DB.all('match-scouting/from-event', {
        eventKey: event.key
    });

    if (scoutings.isErr()) throw scoutings.error;

    const matches = scoutings.value
        .filter((s, i, a) => a.findIndex(_s => s.matchId === _s.matchId) === i);
    const match = await select(
        'Please select match',
        matches.map(m => ({ name: m.matchNumber.toString(), value: m }))
    );

    const robots = scoutings.value.filter(s => s.matchId === match.matchId);

    // match 8 2288

    const selectedBot = await select(
        'Please select team',
        robots.map(r => ({
            name: r.team.toString(),
            value: r
        }))
    );

    const confirmed = await confirm('Are you sure you want to delete this match?');
    if (!confirmed) return backToMain('Did not delete match'); 

    DB.unsafe.run(`
        DELETE FROM MatchScouting
        WHERE id = :id
    `, {
        id: selectedBot.id
    });

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
