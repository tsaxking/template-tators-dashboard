import { Route } from '../../structure/app/app.ts';
import Account from '../../structure/accounts.ts';
import { QuestionOptions } from '../../../shared/db-types-extended.ts';
import { validate } from '../../middleware/data-type.ts';
import { DB } from '../../utilities/databases.ts';
import { uuid } from '../../utilities/uuid.ts';

export const router = new Route();

router.post('/get-sections', async (req, res) => {
    const sections = await DB.all('scouting-questions/all-sections');

    if (sections.isErr()) return res.sendStatus('server:unknown-server-error');

    res.json(sections.value);
});

router.post<{
    section: string;
    eventKey: string;
}>(
    '/get-groups',
    validate({
        section: 'string',
        eventKey: 'string',
    }),
    async (req, res) => {
        const { section, eventKey } = req.body;

        const groups = await DB.all('scouting-questions/groups-from-section', {
            section,
            eventKey,
        });

        if (groups.isErr()) {
            return res.sendStatus('server:unknown-server-error');
        }

        res.json(groups.value);
    },
);

router.post<{
    group: string;
}>(
    '/get-questions',
    validate({
        group: 'string',
    }),
    async (req, res) => {
        const { group } = req.body;

        const questions = await DB.all(
            'scouting-questions/questions-from-group',
            {
                groupId: group,
            },
        );

        if (questions.isErr()) {
            return res.sendStatus('server:unknown-server-error');
        }

        res.json(questions.value);
    },
);

router.post<{
    teamNumber: number;
    eventKey: string;
}>(
    '/get-team-answers',
    validate({
        teamNumber: 'number',
        eventKey: 'string',
    }),
    async (req, res) => {
        const { teamNumber, eventKey } = req.body;

        const answers = await DB.all('scouting-questions/answer-from-team', {
            teamNumber,
            eventKey,
        });

        if (answers.isErr()) {
            return res.sendStatus('server:unknown-server-error');
        }

        res.json(answers.value);
    },
);

router.post<{
    questionId: string;
}>(
    '/edit-history',
    validate({
        questionId: 'string',
    }),
    async (req, res) => {
        const { questionId } = req.body;

        const history = await DB.all('scouting-questions/get-answer-history', {
            questionId,
        });

        if (history.isErr()) {
            return res.sendStatus('server:unknown-server-error');
        }

        res.json(history.value);
    },
);

// ensure user is signed in
router.post(Account.isSignedIn);

router.post<{
    question: string;
    answer: string[];
    team: number;
    eventKey: string;
}>(
    '/submit-answer',
    Account.allowPermissions('submitScoutingAnswers'),
    validate({
        question: 'string',
        answer: (value) =>
            Array.isArray(value) && value.every((v) => typeof v === 'string'),
        team: 'number',
        eventKey: 'string',
    }),
    async (req, res) => {
        const { question, answer, team, eventKey } = req.body;

        const { accountId } = req.session;

        if (!accountId) return res.sendStatus('account:not-logged-in');

        const date = Date.now();
        const id = uuid();
        const str = JSON.stringify(answer);

        const currentAnswer = await DB.all(
            'scouting-questions/answer-from-team',
            {
                teamNumber: team,
                eventKey,
            },
        );

        if (currentAnswer.isErr()) {
            return res.sendStatus('server:unknown-server-error');
        }

        const a = currentAnswer.value.find((a) => a.questionId === question);
        if (a) {
            // update
            DB.run('scouting-questions/update-answer', {
                id: a.id,
                questionId: question,
                answer: str,
                teamNumber: team,
                accountId,
                date,
            });

            res.sendStatus('scouting-question:update-answer', {
                id,
                questionId: question,
                answer: str,
                teamNumber: team,
                accountId,
                date,
            });

            req.io.emit(
                'scouting-question:update-answer',
                {
                    id,
                    questionId: question,
                    answer: str,
                    teamNumber: team,
                    accountId,
                    date,
                    eventKey,
                },
            );
        } else {
            DB.run('scouting-questions/new-answer', {
                id,
                questionId: question,
                answer: str,
                teamNumber: team,
                accountId,
                date,
            });

            res.sendStatus('scouting-question:new-answer', {
                id,
                questionId: question,
                answer: str,
                teamNumber: team,
                accountId,
                date,
            });

            req.io.emit(
                'scouting-question:new-answer',
                {
                    id,
                    questionId: question,
                    answer: str,
                    teamNumber: team,
                    accountId,
                    date,
                    eventKey,
                },
            );
        }
    },
);

router.post<{
    answerId: string;
    answer: string;
}>(
    '/update-answer',
    Account.allowPermissions('submitScoutingAnswers'),
    async (req, res) => {
        const { answerId, answer } = req.body;
        const { accountId } = req.session;
        const date = Date.now();

        if (!accountId) return res.sendStatus('account:not-logged-in');

        const answerRes = await DB.get('scouting-questions/answer-from-id', {
            id: answerId,
        });

        if (answerRes.isErr()) {
            return res.sendStatus('scouting-question:answer-not-found');
        }
        const q = answerRes.value;

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

const canEdit = Account.allowPermissions('editScoutingQuestions');

// TODO: Add data to history
// user must have permissions to update scouting questions

router.post<{
    id: string;
}>(
    '/delete-section', // I don't think a user should be able to do this, but I'm implementing it anyway
    canEdit,
    validate({
        id: 'string',
    }),
    async (req, res) => {
        const { id } = req.body;

        DB.run('scouting-questions/migrate-section', { id });
        DB.run('scouting-questions/delete-section', { id });

        res.sendStatus('scouting-question:section-deleted', {
            id,
        });

        req.io.emit('scouting-question:section-deleted', id);
    },
);

router.post<{
    id: string;
}>(
    '/delete-group',
    canEdit,
    validate({
        id: 'string',
    }),
    async (req, res) => {
        const { id } = req.body;

        DB.run('scouting-questions/migrate-group', { id });
        DB.run('scouting-questions/delete-group', { id });

        res.sendStatus('scouting-question:group-deleted', {
            id,
        });

        req.io.emit('scouting-question:group-deleted', id);
    },
);

router.post<{
    id: string;
}>(
    '/delete-question',
    canEdit,
    validate({
        id: 'string',
    }),
    async (req, res) => {
        const { id } = req.body;

        DB.run('scouting-questions/migrate-question', { id });
        DB.run('scouting-questions/delete-question', { id });

        res.sendStatus('scouting-question:question-deleted', {
            id,
        });

        req.io.emit('scouting-question:question-deleted', id);
    },
);

router.post<{
    id: string;
}>(
    '/delete-answer',
    canEdit,
    validate({
        id: 'string',
    }),
    async (req, res) => {
        const { id } = req.body;

        DB.run('scouting-questions/migrate-answer', { id });
        DB.run('scouting-questions/delete-answer', { id });

        res.sendStatus('scouting-question:answer-deleted', id);
    },
);

router.post<{
    name: string;
    multiple: boolean;
}>(
    '/new-section',
    canEdit,
    validate({
        name: 'string',
        multiple: 'boolean',
    }),
    (req, res) => {
        const { name, multiple } = req.body;
        const { accountId } = req.session;

        if (!accountId) return res.sendStatus('account:not-logged-in');

        const id = uuid();
        const dateAdded = Date.now();

        DB.run('scouting-questions/new-section', {
            name,
            multiple: +multiple,
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
        const { accountId } = req.session;

        if (!accountId) return res.sendStatus('account:not-logged-in');

        const dateAdded = Date.now();

        DB.run('scouting-questions/update-section', {
            name,
            multiple: !!multiple,
            id,
            accountId,
            dateAdded,
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
        const { accountId } = req.session;
        if (!accountId) return res.sendStatus('account:not-logged-in');
        const dateAdded = Date.now();
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
    id: string;
    name: string;
    eventKey: string;
}>(
    '/update-group',
    canEdit,
    validate({
        id: 'string',
        name: 'string',
        eventKey: 'string',
    }),
    async (req, res) => {
        const { id, name, eventKey } = req.body;
        const { accountId } = req.session;
        if (!accountId) return res.sendStatus('account:not-logged-in');
        const dateAdded = Date.now();

        DB.run('scouting-questions/update-group', {
            id,
            name,
            accountId,
            dateAdded,
            eventKey,
        });

        res.sendStatus('scouting-question:group-updated', {
            id,
            name,
            accountId,
            dateAdded,
        });

        req.io.emit('scouting-question:update-group', {
            id,
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
    group: string;
    options: QuestionOptions; // TODO: add type
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
        group: 'string',
        options: (value) => value !== undefined,
    }),
    (req, res) => {
        const { question, type, section, key, description, group, options } =
            req.body;

        const { accountId } = req.session;
        if (!accountId) return res.sendStatus('account:not-logged-in');
        const dateAdded = Date.now();
        const id = uuid();

        const o = JSON.stringify(options);

        DB.run('scouting-questions/new-question', {
            id,
            question,
            type,
            key,
            description,
            groupId: group,
            accountId,
            dateAdded,
            options: o,
        });

        res.sendStatus('scouting-question:new-question', {
            id,
            question,
            type,
            section,
            key,
            description,
            groupId: group,
            accountId,
            dateAdded,
            options: o, // must be string to keep consistency
        });

        req.io.emit('scouting-question:new-question', {
            id,
            question,
            type,
            section,
            key,
            description,
            groupId: group,
            accountId,
            dateAdded,
            options: o,
        });
    },
);

router.post<{
    id: string;
    question: string;
    type:
        | 'text'
        | 'number'
        | 'boolean'
        | 'select'
        | 'checkbox'
        | 'radio'
        | 'textarea';
    key: string;
    description: string;
    options: QuestionOptions;
}>(
    '/update-question',
    canEdit,
    validate({
        id: 'string',
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
        key: 'string',
        description: 'string',
        options: (value) => value !== undefined,
    }),
    async (req, res) => {
        const { id, question, type, key, description, options } = req.body;

        const { accountId } = req.session;
        if (!accountId) return res.sendStatus('account:not-logged-in');

        const dateAdded = Date.now();

        const o = JSON.stringify(options);

        const q = await DB.get('scouting-questions/question-from-id', {
            id,
        });

        if (q.isErr()) return res.sendStatus('server:unknown-server-error');

        if (!q.value) {
            return res.sendStatus('scouting-question:question-not-found');
        }

        DB.run('scouting-questions/update-question', {
            id,
            question,
            type,
            key,
            description,
            accountId,
            dateAdded,
            options: o,
            groupId: q.value.groupId,
        });

        res.sendStatus('scouting-question:question-updated', {
            id,
            question,
            type,
            key,
            description,
            accountId,
            dateAdded,
            options: o,
        });

        req.io.emit('scouting-question:update-question', {
            id,
            question,
            type,
            key,
            description,
            accountId,
            dateAdded,
            options: o,
        });
    },
);

router.post<{
    id: string;
}>(
    '/get-group',
    validate({
        id: 'string',
    }),
    async (req, res) => {
        const { id } = req.body;

        const group = await DB.get('scouting-questions/group-from-id', {
            id,
        });

        if (group.isErr()) {
            return res.sendStatus('server:unknown-server-error');
        }

        res.json(group.value);
    },
);

router.post<{
    id: string;
}>(
    '/get-section',
    validate({
        id: 'string',
    }),
    async (req, res) => {
        const { id } = req.body;

        const section = await DB.get('scouting-questions/section-from-id', {
            id,
        });

        if (section.isErr()) {
            return res.sendStatus('server:unknown-server-error');
        }

        res.json(section.value);
    },
);

router.post<{
    id: string;
}>(
    '/get-answer',
    validate({
        id: 'string',
    }),
    async (req, res) => {
        const { id } = req.body;

        const answer = await DB.get('scouting-questions/answer-from-id', {
            id,
        });

        if (answer.isErr()) {
            return res.sendStatus('server:unknown-server-error');
        }

        res.json(answer.value);
    },
);

router.post<{
    id: string;
}>(
    '/get-question',
    validate({
        id: 'string',
    }),
    async (req, res) => {
        const { id } = req.body;

        const question = await DB.get('scouting-questions/question-from-id', {
            id,
        });

        if (question.isErr()) {
            return res.sendStatus('server:unknown-server-error');
        }

        res.json(question.value);
    },
);
