import { DB } from '../server/utilities/databases';

(async () => {
    const a = await DB.get('account/from-username', {
        username: 'nate'
    });

    if (a.isOk() && a.value) {
        const id = a.value.id;

        await DB.unsafe.run(
            `
            UPDATE Accounts
            SET username = :username
            WHERE id = :id
        `,
            {
                id,
                username: 'laursengamer77'
            }
        );
    }

    process.exit(0);
})();
