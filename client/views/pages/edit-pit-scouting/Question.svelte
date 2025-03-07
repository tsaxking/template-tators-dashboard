<script lang="ts">
import { Question } from '../../../models/FIRST/question-scouting/question';
import type {
    QuestionOptions,
    QuestionType
} from '../../../../shared/db-types-extended';
import { alert, confirm } from '../../../utilities/notifications';
import O from './Option.svelte';

export let question: Question;

let type: QuestionType,
    options: QuestionOptions,
    description: string,
    key: string,
    questionText: string,
    optionsData: string[] = []; //,
// isEdited = false
$: {
    fns.setQuestion(question);
    // isEdited = question?.type === type &&
    //     question?.description === description &&
    //     question?.key === key &&
    //     question?.question === questionText &&
    //     JSON.stringify(question?.options) === JSON.stringify(options);
}

// to not have svelte complain about too many variables
const fns = {
    update: async () => {
        console.log('updating...');
        question.type = type;
        question.description = description.trim();
        question.options.checkbox = options.checkbox;
        question.options.radio = options.radio;
        question.options.select = options.select;
        question.key = key.trim();
        question.question = questionText.trim();

        const res = await question.update();
        if (res.isErr()) console.error(res.error);
    },
    addOption: () => {
        if (type === 'select') {
            options.select = [...(options.select || []), ''];
            optionsData = options.select;
        }

        if (type === 'checkbox') {
            options.checkbox = [...(options.checkbox || []), ''];
            optionsData = options.checkbox;
        }

        if (type === 'radio') {
            options.radio = [...(options.radio || []), ''];
            optionsData = options.radio;
        }

        // reassign to trigger svelte reactivity
        options = options;
    },
    deleteOption: () => {
        if (type === 'select') {
            options.select = options.select.slice(0, options.select.length - 1);
        }

        if (type === 'checkbox') {
            options.checkbox = options.checkbox.slice(
                0,
                options.checkbox.length - 1
            );
        }

        if (type === 'radio') {
            options.radio = options.radio.slice(0, options.radio.length - 1);
        }

        // reassign to trigger svelte reactivity
        options = options;
    },
    delete: async () => {
        if (!question) return alert('Cannot delete undefined question');

        const doDelete = await confirm(
            'Are you sure you want to delete this question?'
        );
        if (!doDelete) return;

        const res = await question.delete();
        if (res.isOk()) {
            question = undefined;
        }

        if (res.isErr()) {
            alert(res.error.message);
        }
    },
    setQuestion: (q: Question | undefined) => {
        if (q) {
            type = question.type;
            options = question.options;
            description = question.description.trim();
            key = question.key.trim();
            questionText = question.question.trim();

            if (type === 'select') {
                optionsData = options.select?.map(o => o.trim()) || [];
            }

            if (type === 'checkbox') {
                optionsData = options.checkbox?.map(o => o.trim()) || [];
            }

            if (type === 'radio') {
                optionsData = options.radio?.map(o => o.trim()) || [];
            }

            // q.on('update', () => {})
        }
    }
};
</script>

<div class="card">
    <div class="card-body">
        <div class="container">
            <div class="row mb-3">
                <label for="{question.id}-text">Question Text</label>
                <small class="mb-2">
                    This is the question that will be displayed to the scout for
                    them to ask.
                </small>
                <input
                    id="{question.id}-text"
                    class="form-control"
                    type="text"
                    bind:value="{questionText}"
                    on:change="{fns.update}"
                />
            </div>
            <div class="row mb-3">
                <label for="{question.id}-key">Question Key</label>
                <small class="mb-2">
                    This is just a unique identifier to summarize the question
                    to make reading summaries easier. (e.g. How heavy is the
                    robot? <i class="material-icons">arrow_right</i>
                    weight)
                    <br />
                    This will initialize as a random key, please change it.
                </small>
                <input
                    id="{question.id}-key"
                    class="form-control"
                    type="text"
                    bind:value="{key}"
                    on:change="{fns.update}"
                />
            </div>
            <div class="row mb-3">
                <label for="{question.id}-description"
                    >Question Description</label
                >
                <small class="mb-2">
                    In case of any confusion, please write a description of the
                    question. This could be good to explain why we're asking it
                    in case that is brought up by the team's representative.
                </small>
                <textarea
                    id="{question.id}-description"
                    class="form-control"
                    bind:value="{description}"
                    on:change="{fns.update}"
                ></textarea>
            </div>
            <div class="row mb-3">
                <label for="{question.id}-type">Question Type</label>
                <small class="mb-2">
                    This is the type of question, if it's a text input, a number
                    input, a boolean input, a select input, a checkbox input, or
                    a radio input.
                </small>
                <select
                    id="{question.id}-type"
                    class="form-control"
                    bind:value="{type}"
                    on:change="{fns.update}"
                >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="select">Select</option>
                    <option value="checkbox">Checkbox</option>
                </select>
            </div>
            {#if type === 'select' || type === 'checkbox' || type === 'radio'}
                <small class="mb-2">
                    These are the options that will be displayed to the scout
                    for them to select from.
                </small>
                {#each optionsData as o, index}
                    <O
                        text="{o}"
                        on:update="{({ detail: { text } }) => {
                            optionsData = optionsData.map((op, i) =>
                                i === index ? text : op
                            );
                            if (type === 'select') options.select = optionsData;
                            if (type === 'checkbox')
                                options.checkbox = optionsData;
                            if (type === 'radio') options.radio = optionsData;
                            fns.update();
                        }}"
                    />
                {/each}
                <div class="row mb-3">
                    <button class="btn btn-primary" on:click="{fns.addOption}">
                        Add Option
                    </button>
                </div>
            {/if}
            <div class="btn-group">
                <!-- {#if isEdited} -->
                <button class="btn btn-success" on:click="{fns.update}">
                    Save <i class="material-icons"> save </i>
                </button>
                <!-- {/if} -->
                <button class="btn btn-danger" on:click="{fns.delete}">
                    Delete Question <i class="material-icons"> delete </i>
                </button>
            </div>
        </div>
    </div>
</div>
