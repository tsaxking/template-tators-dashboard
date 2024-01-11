import { transfer } from '../../../../scripts/transfer-db.ts';

const res = prompt(
    'This version is the latest that will work with the current database transfer script. Would you like to transfer the database? (y/n)',
);
if (res === 'y') {
    prompt(
        'Alright, please place the old database file in /scripts/old.db and press enter.',
    );
    transfer();
}
