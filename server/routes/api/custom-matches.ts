import { validate } from '../../middleware/data-type';
import { Route } from '../../structure/app/app';
import { CustomMatch } from '../../structure/cache/custom-matches';
import { CustomMatches } from '../../utilities/tables';

export const router = new Route();

router.post<Omit<CustomMatches, 'id' | 'created' | 'archive'>>(
    '/new',
    validate({
        eventKey: 'string',
        matchNumber: 'number',
        compLevel: ['pr', 'qm', 'qf', 'sf', 'f'],
        red1: 'number',
        red2: 'number',
        red3: 'number',
        red4: ['number', 'undefined'],
        blue1: 'number',
        blue2: 'number',
        blue3: 'number',
        blue4: ['number', 'undefined'],
        name: 'string'
    }),
    async (req, res) => {
        const m = (await CustomMatch.new(req.body)).unwrap();

        res.sendStatus('custom-match:created');
        req.io.emit('custom-match:new', m);
    }
);
router.post<{ id: string }>(
    '/from-id',
    validate({
        id: 'string'
    }),
    async (req, res) => {
        const m = (await CustomMatch.fromId(req.body.id)).unwrap();

        res.json(m);
    }
);

router.post<Omit<CustomMatches, 'created'>>(
    '/update',
    validate({
        id: 'string',
        eventKey: 'string',
        matchNumber: 'number',
        compLevel: ['pr', 'qm', 'qf', 'sf', 'f'],
        red1: 'number',
        red2: 'number',
        red3: 'number',
        red4: ['number', 'undefined'],
        blue1: 'number',
        blue2: 'number',
        blue3: 'number',
        blue4: ['number', 'undefined'],
        name: 'string',
        archive: 'number'
    }),
    async (req, res) => {
        const m = (await CustomMatch.fromId(req.body.id)).unwrap();
        if (!m) return res.sendStatus('custom-match:not-found');
        m.update(req.body);
    }
);
