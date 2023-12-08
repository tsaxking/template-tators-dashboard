import { Route } from "../../structure/app/app.ts";
import { DB } from "../../utilities/databases.ts";



export const router = new Route();


router.get('/link/:key', async (req, res, next) => {
    const { key } = req.params;

    if (!key) return res.sendStatus('discord:invalid-link');

    const pair = DB.get('discord/get', {
        key
    });

    if (pair) {
        const now = Date.now();
        const then = +pair.date;

        if (now - then > 1000 * 60 * 60 * 24) {
            return res.sendStatus('discord:link-expired', {
                key
            });
        } else {
            const act = req.session.account;
            if (!act) return res.sendStatus('account:not-logged-in');

            DB.run('account/set-discord-id', {
                discordId: pair.id,
                id: act.id
            });

            DB.run('discord/delete', {
                key
            });

            return res.sendStatus('discord:account-linked', {
                key
            });
        }
    } else {
        res.sendStatus('discord:invalid-link');
    }
});