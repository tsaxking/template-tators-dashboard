import { Route } from '../../structure/app/app.ts';
import { App } from '../../structure/app/app.ts';
import env from '../../utilities/env.ts';


const route = new Route();


route.get('/event/:eventKey/teams/trace', App.headerAuth('x-webhook-auth', env.WEBHOOK_KEY as string), (req, res) => {
    const { eventKey } = req.params;
});

export default route;