import { attemptAsync } from "../../../shared/check";
import { DB } from "../../utilities/databases";
import { ScoutingQuestionSections as S, ScoutingQuestionGroups as G, ScoutingQuestions as Q, ScoutingAnswers as A } from "../../utilities/tables";
import { Cache } from "./cache";
import { uuid } from '../../utilities/uuid';

export class Question extends Cache {
    public static fromGroup(groupId: string) {
        return attemptAsync(async () => {
            return (await DB.all('scouting-questions/questions-from-group', { groupId }))
                .unwrap()
                .map(q => new Question(q));
        });
    }

    public static fromId(id: string) {
        return attemptAsync(async () => {
            const q = (await DB.get('scouting-questions/question-from-id', { id })).unwrap();
            if (!q) return undefined;
            return new Question(q);
        });
    }

    public static fromEvent(eventKey: string) {
        return attemptAsync(async () => {
            return (await DB.all('scouting-questions/questions-from-event', { eventKey }))
                .unwrap()
                .map(q => new Question(
                    { ...q, eventKey }
                ));
        });
    }

    public static new(data: {
        question: string;
        key: string;
        description: string;
        type: string;
        groupId: string;
        accountId: string;
        options: string;
        eventKey: string;
    }) {
        return attemptAsync(async () => {
            const id = uuid();
            const dateAdded = Date.now();
            (await DB.run('scouting-questions/new-question', {
                ...data,
                id,
                dateAdded
            })).unwrap();
            return new Question({
                ...data,
                id,
                dateAdded,
            });
        });
    }

    id: string;
    question: string;
    key: string;
    description: string;
    type: string;
    groupId: string;
    dateAdded: number;
    accountId: string;
    options: string;
    eventKey: string;

    constructor(data: Q & { eventKey: string }) {
        super();
        this.id = data.id;
        this.question = data.question;
        this.key = data.key;
        this.description = data.description;
        this.type = data.type;
        this.groupId = data.groupId;
        this.dateAdded = data.dateAdded;
        this.accountId = data.accountId;
        this.options = data.options;
        this.eventKey = data.eventKey;
    }

    delete() {
        return DB.run('scouting-questions/delete-question', { id: this.id });
    }

    migrate() {
        return DB.run('scouting-questions/migrate-question', { id: this.id });
    }

    answer(data: {
        answer: string;
        teamNumber: number;
        accountId: string;
    }) {
        return Answer.new({
            ...data,
            questionId: this.id
        });
    }

    update(data: {
        question: string;
        key: string;
        description: string;
        type: string;
        groupId: string;
        accountId: string;
        options: string;
    }) {
        const date = Date.now();
        return DB.run('scouting-questions/update-question', { ...this, date, ...data });
    }
}


export class Group extends Cache {
    public static fromEvent(eventKey: string) {
        return attemptAsync(async () => {
            return (await DB.all('scouting-questions/groups-from-event', { eventKey }))
                .unwrap()
                .map(g => new Group(g));
        });
    }

    public static fromId(id: string) {
        return attemptAsync(async () => {
            const group = (await DB.get('scouting-questions/group-from-id', { id })).unwrap();
            if (!group) return undefined;
            return new Group(group);
        });
    }

    public static fromSection(id: string, eventKey: string) {
        return attemptAsync(async () => {
            return (await DB.all('scouting-questions/groups-from-section', { section: id, eventKey }))
                .unwrap()
                .map(g => new Group(g));
        });
    }

    public static new(data: {
        eventKey: string;
        section: string;
        name: string;
        accountId: string;
    }) {
        return attemptAsync(async () => {
            const id = uuid();
            const dateAdded = Date.now();
            (await DB.run('scouting-questions/new-group', {
                ...data,
                id,
                dateAdded
            })).unwrap();
            return new Group({
                ...data,
                id,
                dateAdded
            });
        });
    }

    id: string;
    eventKey: string;
    section: string;
    name: string;
    dateAdded: number;
    accountId: string;

    constructor(data: G) {
        super();
        this.id = data.id;
        this.eventKey = data.eventKey;
        this.section = data.section;
        this.name = data.name;
        this.dateAdded = data.dateAdded;
        this.accountId = data.accountId;
    }

    delete() {
        return DB.run('scouting-questions/delete-group', { id: this.id });
    }

    migrate() {
        return DB.run('scouting-questions/migrate-group', { id: this.id });
    }

    update(data: {
        name: string;
        accountId: string;
    }) {
        const date = Date.now();
        return DB.run('scouting-questions/update-group', { ...this, date, ...data });
    }
}



export class Section extends Cache {
    public static all() {
        return attemptAsync(async () => {
            const all = (await DB.all('scouting-questions/all-sections')).unwrap();
            return all.map(a => new Section(a));
        });
    }

    public static new(data: {
        name: string;
        multiple: number;
        accountId: string;
    }) {
        return attemptAsync(async () => {
            const dateAdded = Date.now();
            const id = uuid();
            (await DB.run('scouting-questions/new-section', { ...data, dateAdded, id })).unwrap();
            return new Section({
                ...data,
                id,
                dateAdded
            });
        });
    }

    public static fromId(id: string) {
        return attemptAsync(async () => {
            const section = (await DB.get('scouting-questions/section-from-id', { id })).unwrap();
            if (!section) return undefined;
            return new Section(section);
        });
    }

    name: string;
    multiple: number;
    dateAdded: number;
    accountId: string;
    id: string;

    constructor(data: S) {
        super();
        this.name = data.name;
        this.multiple = data.multiple;
        this.dateAdded = data.dateAdded;
        this.accountId = data.accountId;
        this.id = data.id;
    }

    delete() {
        return DB.run('scouting-questions/delete-section', { id: this.id });
    }

    getGroups(eventKey: string) {
        return Group.fromSection(this.id, eventKey);
    }

    migrate() {
        return DB.run('scouting-questions/migrate-section', { id: this.id });
    }

    update(data: {
        name: string;
        multiple: boolean;
        accountId: string;
    }) {
        const date = Date.now();
        return DB.run('scouting-questions/update-section', { ...this, dateAdded: date, ...data });
    }
}

export class Answer extends Cache {
    public static fromId(id: string) {
        return attemptAsync(async () => {
            const data = (await DB.get('scouting-questions/answer-from-id', { id })).unwrap();
            if (!data) return null;
            return new Answer(data);
        });
    }

    // public static fromTeam(teamNumber: number, eventKey: string) {
    //     return attemptAsync(async () => {
    //         return (await DB.all('scouting-questions/answer-from-team', { teamNumber, eventKey }))
    //             .unwrap()
    //             .map(a => new Answer(a));
    //     });
    // }

    public static fromEvent(eventKey: string) {
        return attemptAsync(async () => {
            return (await DB.all('scouting-questions/answers-from-event', { eventKey }))
                .unwrap()
                .map(a => new Answer(a));
        });
    }

    public static new(data: {
        questionId: string;
        answer: string;
        teamNumber: number;
        accountId: string;
    }) {
        return attemptAsync(async () => {
            const id = uuid();
            const date = Date.now();
            (await DB.run('scouting-questions/new-answer', {
                ...data,
                id,
                date
            })).unwrap();
            return new Answer({
                ...data,
                date,
                id
            });
        });
    }

    id: string;
    questionId: string;
    answer: string;
    teamNumber: number;
    date: number;
    accountId: string;

    constructor(data: A) {
        super();
        this.id = data.id;
        this.questionId = data.questionId;
        this.answer = data.answer;
        this.teamNumber = data.teamNumber;
        this.date = data.date;
        this.accountId = data.accountId;
    }

    delete() {
        return DB.run('scouting-questions/delete-answer', { id: this.id });
    }

    migrate() {
        return DB.run('scouting-questions/migrate-answer', { id: this.id });
    }

    update(data: {
        answer: string;
        accountId: string;
    }) {
        const date = Date.now();
        return DB.run('scouting-questions/update-answer', { ...this, date, ...data });
    }
}