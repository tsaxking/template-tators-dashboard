import { DB } from "../server/utilities/databases";

(async () => {
    const accounts = await DB.all('account/all');

    if (accounts.isErr()) throw accounts.error;

    await Promise.all(accounts.value.map(a => {
        return DB.unsafe.run('UPDATE accounts SET username = :username WHERE id = :id', {
            id: a.id,
            username: a.username.toLowerCase()
        });
    }));

    process.exit(0);
})();