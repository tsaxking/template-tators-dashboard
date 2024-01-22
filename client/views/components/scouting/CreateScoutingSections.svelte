<script lang="ts">
import GroupCard from './GroupCard.svelte';
// import { ParsedScoutingQuestionGroup, ScoutingQuestion } from "../../../../shared/scouting";
import Button from '../bootstrap/Button.svelte';
import { createEventDispatcher } from 'svelte';
import QuestionCard from './QuestionCard.svelte';
import { Random } from '../../../../shared/math';
import { StateStack, State } from '../../../../shared/statestack';

type ScoutingQuestionGroup = {
    id: string;
    eventKey: string;
    name: string;
};

type ScoutingQuestion = {
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
    section: string;
    key: string;
    description: string;
    group: string; // id of the group
};

type ScoutingQuestionGroupState = {
    groups: ScoutingQuestionGroup[];
    questions: ScoutingQuestion[];
};

export let name: string;
export let questions: ScoutingQuestion[] = [];
export let groups: ScoutingQuestionGroup[] = [];
export let eventKey: string | undefined;

const stack = new StateStack<ScoutingQuestionGroupState>({
    groups: [],
    questions: []
});

const addGroup = () => {
    groups = [
        ...groups,
        {
            // this id will be replaced by the server
            id: Random.uuid(),
            name: 'New Section',
            eventKey
        }
    ];

    stack.add({
        groups,
        questions
    });
};

const dispatch = createEventDispatcher();

const removeGroup = (id: string) => () => {
    groups = groups.filter(group => group.id !== id);
    questions = questions.filter(question => question.group !== id);

    stack.add({
        groups,
        questions
    });
};

const addCard = (id: string) => (e: CustomEvent) => {
    questions = [
        ...questions,
        {
            group: id,
            section: id,
            key: 'new_question',
            id: Random.uuid(),
            question: 'New Question',
            type: 'text',
            description: ''
        }
    ];

    stack.add({
        groups,
        questions
    });
};

const removeCard = (id: string) => {
    questions = questions.filter(question => question.id !== id);

    stack.add({
        groups,
        questions
    });
};

const changeQuestion = () => {
    dispatch('change', questions);

    stack.add({
        groups,
        questions
    });
};

stack.on('change', (state: State<ScoutingQuestionGroupState>) => {
    groups = state.data.groups;
    questions = state.data.questions;
});

const handleKeydown = (e: KeyboardEvent) => {
    if (e.ctrlKey) {
        switch (e.key) {
            case 'z':
                stack.prev();
                break;
            case 'y':
                stack.next();
                break;
            case 's':
                e.preventDefault();
                dispatch('save');
                break;
        }
    }
};

const moveCardUp =
    (questionId: string, assign: boolean = false) =>
    () => {
        const question = questions.find(question => question.id === questionId);
        if (!question) return;

        const index = questions.indexOf(question);
        if (index === 0) return console.log('First question');

        // get the question above this one (in the same group)

        const above = questions.findLast((q, i) => {
            return q !== question && i < index && q.group === q.group;
        });

        if (!above) return console.error('No question above');

        // swap the two questions
        const temp = questions[index];
        questions[index] = above;
        questions[questions.indexOf(above)] = temp;

        if (assign) questions = questions;

        stack.add({
            groups,
            questions
        });
    };

const moveCardDown = (questionId: string) => () => {
    questions.reverse();
    moveCardUp(questionId, false)();
    questions.reverse();

    questions = questions;

    stack.add({
        groups,
        questions
    });
};
</script>

<div class="container" on:keydown="{handleKeydown}">
    <div class="row mb-3">
        <div class="col-12">
            <h3>Create {name} Sections</h3>
        </div>
    </div>

    <div class="row mb-3">
        <div class="btn-group">
            <Button color="primary" on:click="{addGroup}">
                <i class="material-icons">add</i>&nbsp;Add Group
            </Button>
            <Button color="success" on:click="{() => dispatch('save')}">
                <i class="material-icons">save</i>&nbsp;Save
            </Button>
            <Button color="danger" on:click="{() => stack.prev()}">
                <i class="material-icons">undo</i>&nbsp;Undo
            </Button>
            <Button color="warning" on:click="{() => stack.next()}">
                <i class="material-icons">redo</i>&nbsp;Redo
            </Button>
        </div>
    </div>

    {#each groups as group}
        <div class="row mb-2">
            <div class="col-12">
                <GroupCard
                    bind:title="{group.name}"
                    on:delete="{removeGroup(group.id)}"
                    on:addCard="{addCard(group.id)}"
                >
                    <div class="container">
                        {#each questions as question}
                            {#if question.group === group.id}
                                <div class="row mb-1">
                                    <div class="col-12">
                                        <QuestionCard
                                            bind:question="{question.question}"
                                            bind:key="{question.key}"
                                            bind:description="{question.description}"
                                            bind:type="{question.type}"
                                            on:change="{changeQuestion}"
                                            on:delete="{() =>
                                                removeCard(question.id)}"
                                            on:moveCardUp="{moveCardUp(
                                                question.id,
                                                true
                                            )}"
                                            on:moveCardDown="{moveCardDown(
                                                question.id
                                            )}"
                                        ></QuestionCard>
                                    </div>
                                </div>
                            {/if}
                        {/each}
                    </div>
                </GroupCard>
            </div>
        </div>
    {/each}
</div>
