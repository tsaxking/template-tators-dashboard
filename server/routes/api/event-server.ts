import { App, Route } from '../../structure/app/app.ts';
import env from '../../utilities/env.ts';
import { validate } from '../../middleware/data-type.ts';

export const router = new Route();

if (!env.EVENT_API_KEY) env.EVENT_API_KEY = 'test';

router.post('/*', App.headerAuth('x-api-key', env.EVENT_API_KEY));

router.post<{
    eventKey: string;
    matchKey: string;
    compLevel: string;
    data: any; // TODO: add event server data type
}>(
    '/submit-match',
    validate({
        eventKey: 'string',
        matchKey: 'string',
        compLevel: ['pr', 'qm', 'qf', 'sf', 'f'],
        data: (v) => typeof v === 'object', // could do more validation here
    }),
    async (req, res, next) => {
        // TODO: Implement match submission from event server
    },
);
