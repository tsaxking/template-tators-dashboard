import { Route } from '../../structure/app/app.ts';
import { DB } from '../../utilities/databases.ts';

export const router = new Route();

router.get('/link/:key', async (req, res) => {
    const { key } = req.params;

    if (!key) return res.sendStatus('discord:invalid-link');

    const result = await DB.get('discord/get', {
        key,
    });

    if (result.isOk()) {
        const pair = result.value;
        if (!pair) return res.sendStatus('discord:invalid-link');
        const now = Date.now();
        const then = +pair.date;

        if (now - then > 1000 * 60 * 60 * 24) {
            return res.sendStatus('discord:link-expired', {
                key,
            });
        } else {
            const { accountId } = req.session;
            if (!accountId) return res.sendStatus('account:not-logged-in');

            DB.run('account/set-discord-id', {
                discordId: pair.id,
                id: accountId,
            });

            DB.run('discord/delete', {
                key,
            });

            return res.sendStatus('discord:account-linked', {
                key,
            });
        }
    } else {
        res.sendStatus('discord:invalid-link');
    }
});
