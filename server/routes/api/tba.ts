import { Route } from '../../structure/app/app.ts';
import { TBA } from '../../utilities/tba/tba.ts';

export const router = new Route();

router.get('/*', async (req, res) => {
    let { pathname } = req;

    pathname = pathname.replace('/api/tba', '');

    const result = await TBA.get(pathname);

    if (result.isErr()) return res.json(null);

    res.json(result.value);
});
