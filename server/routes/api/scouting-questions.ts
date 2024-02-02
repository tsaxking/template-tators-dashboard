import { Route } from '../../structure/app/app.ts';
import Account from '../../structure/accounts.ts';
import {
    ScoutingQuestion,
    ScoutingQuestionGroup,
    ScoutingSection,
} from '../../../shared/db-types-extended.ts';
import { validate } from '../../middleware/data-type.ts';
import { DB } from '../../utilities/databases.ts';
import { uuid } from '../../utilities/uuid.ts';

const router = new Route();

router.post('/get-sections', (req, res) => {
    const sections = DB.all('scouting-questions/all-sections');

    res.json(sections);
});

router.post<{
    eventKey: string;
}>(
    '/get-groups',
    validate({
        eventKey: 'string',
    }),
    (req, res) => {
        const { eventKey } = req.body;

        const groups = DB.all('scouting-questions/groups-from-event', {
            eventKey,
        });

        res.json(groups);
    },
);

router.post<{
    group: string;
}>(
    '/get-questions',
    validate({
        group: 'string',
    }),
    (req, res) => {
        const { group } = req.body;

        const questions = DB.all('scouting-questions/questions-from-group', {
            groupId: group,
        });

        res.json(questions);
    },
);

router.post<{
    questionId: string;
}>(
    '/edit-history',
    validate({
        questionId: 'string',
    }),
    (req, res) => {
        const { questionId } = req.body;

        const history = DB.all('scouting-questions/get-answer-history', {
            questionId,
        });

        res.json(history);
    },
);

// ensure user is signed in
router.post(Account.isSignedIn);

router.post<{
    questionId: string;
    answer: string;
    teamNumber: number;
}>(
    '/submit-answer',
    Account.allowPermissions('submit-scouting-questions'),
    validate({
        questionId: 'string',
        answer: 'string',
        teamNumber: 'number',
    }),
    (req, res) => {
        const { questionId, answer, teamNumber } = req.body;

        const accountId = req.session.account?.id;

        if (!accountId) return res.sendStatus('account:not-logged-in');

        const date = Date.now().toString();
        const id = uuid();

        DB.run('scouting-questions/new-answer', {
            id,
            questionId,
            answer,
            teamNumber,
            accountId,
            date,
        });

        res.sendStatus('scouting-question:new-answer', {
            id,
            questionId,
            answer,
            teamNumber,
            accountId,
            date,
        });

        req.io.emit('scouting-question:new-answer', {
            id,
            questionId,
            answer,
            teamNumber,
            accountId,
            date,
        });
    },
);

router.post<{
    answerId: string;
    answer: string;
}>(
    '/update-answer',
    Account.allowPermissions('submit-scouting-questions'),
    (req, res) => {
        const { answerId, answer } = req.body;
        const accountId = req.session.account?.id;
        const date = Date.now().toString();

        if (!accountId) return res.sendStatus('account:not-logged-in');

        const q = DB.get('scouting-questions/answer-from-id', {
            id: answerId,
        });

        if (!q) return res.sendStatus('scouting-question:answer-not-found');

        DB.run('scouting-questions/update-answer', {
            id: answerId,
            answer,
            date,
            accountId,
            questionId: q.questionId,
            teamNumber: q.teamNumber,
        });

        res.sendStatus('scouting-question:updated-answer', {
            id: answerId,
            answer,
            date,
            accountId,
            questionId: q.questionId,
            teamNumber: q.teamNumber,
        });

        req.io.emit('scouting-question:updated-answer', {
            id: answerId,
            answer,
            date,
            accountId,
            questionId: q.questionId,
            teamNumber: q.teamNumber,
        });
    },
);

const canEdit = Account.allowPermissions('edit-scouting-questions');

// TODO: Add delete information
// user must have permissions to update scouting questions

router.post<{
    name: string;
    multiple: 0 | 1;
}>(
    '/new-section',
    canEdit,
    validate({
        name: 'string',
        multiple: [0, 1],
    }),
    (req, res) => {
        const { name, multiple } = req.body;
        const accountId = req.session.account?.id;

        if (!accountId) return res.sendStatus('account:not-logged-in');

        const id = uuid();
        const dateAdded = Date.now().toString();

        DB.run('scouting-questions/new-section', {
            name,
            multiple,
            id,
            dateAdded,
            accountId,
        });

        res.sendStatus('scouting-question:new-section', {
            name,
            multiple,
            id,
            dateAdded,
            accountId,
        });

        req.io.emit('scouting-question:new-section', {
            name,
            multiple,
            id,
            dateAdded,
            accountId,
        });
    },
);

router.post<{
    name: string;
    multiple: 0 | 1;
    id: string;
}>(
    '/update-section',
    canEdit,
    validate({
        name: 'string',
        multiple: [0, 1],
        id: 'string',
    }),
    (req, res) => {
        const { name, multiple, id } = req.body;
        const accountId = req.session.account?.id;

        if (!accountId) return res.sendStatus('account:not-logged-in');

        const dateAdded = Date.now().toString();

        DB.run('scouting-questions/update-section', {
            name,
            multiple,
            id,
            accountId,
        });

        res.sendStatus('scouting-question:update-section', {
            name,
            multiple,
            id,
            dateAdded,
            accountId,
        });

        req.io.emit('scouting-question:update-section', {
            name,
            multiple,
            id,
            dateAdded,
            accountId,
        });
    },
);

router.post<{
    name: string;
    eventKey: string;
    section: string;
}>(
    '/new-group',
    canEdit,
    validate({
        eventKey: 'string',
        section: 'string',
        name: 'string',
    }),
    (req, res) => {
        const { eventKey, section, name } = req.body;
        const accountId = req.session.account?.id;
        if (!accountId) return res.sendStatus('account:not-logged-in');
        const dateAdded = Date.now().toString();
        const id = uuid();

        DB.run('scouting-questions/new-group', {
            id,
            eventKey,
            section,
            name,
            accountId,
            dateAdded,
        });

        res.sendStatus('scouting-question:new-group', {
            id,
            eventKey,
            section,
            name,
            accountId,
            dateAdded,
        });

        req.io.emit('scouting-question:new-group', {
            id,
            eventKey,
            section,
            name,
            accountId,
            dateAdded,
        });
    },
);

router.post<{
    question: string;
    type:
        | 'text'
        | 'number'
        | 'boolean'
        | 'select'
        | 'checkbox'
        | 'radio'
        | 'textarea';
    section: string;
    key: string;
    description: string;
    groupId: string;
    options: any; // TODO: add type
}>(
    '/new-question',
    canEdit,
    validate({
        question: 'string',
        type: [
            'text',
            'number',
            'boolean',
            'select',
            'checkbox',
            'radio',
            'textarea',
        ],
        section: 'string',
        key: 'string',
        description: 'string',
        groupId: 'string',
        options: (value) => value !== undefined,
    }),
    (req, res) => {
        const { question, type, section, key, description, groupId, options } =
            req.body;

        const accountId = req.session.account?.id;
        if (!accountId) return res.sendStatus('account:not-logged-in');
        const dateAdded = Date.now().toString();
        const id = uuid();

        DB.run('scouting-questions/new-question', {
            id,
            question,
            type,
            section,
            key,
            description,
            groupId,
            accountId,
            dateAdded,
            options,
        });

        res.sendStatus('scouting-question:new-question', {
            id,
            question,
            type,
            section,
            key,
            description,
            groupId,
            accountId,
            dateAdded,
            options,
        });

        req.io.emit('scouting-question:new-question', {
            id,
            question,
            type,
            section,
            key,
            description,
            groupId,
            accountId,
            dateAdded,
            options,
        });
    },
);

export default router;
