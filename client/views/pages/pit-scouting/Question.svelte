<script lang="ts">
    import { Question } from "../../../models/FIRST/question-scouting/question";
    import type { QuestionOptions, QuestionType } from "../../../../shared/db-types-extended";
    import O from './Option.svelte';
    import { alert } from "../../../utilities/notifications";

    export let question: Question | undefined = undefined;

    let type: QuestionType,
        options: QuestionOptions,
        description: string,
        key: string,
        questionText: string,
        optionsData: string[] = [];
    $: {
        if (question) {
            type = question.type;
            options = question.options;
            description = question.description;
            key = question.key;
            questionText = question.question;

            if (type === 'select') {
                optionsData = options.select || [];
            }

            if (type === 'checkbox') {
                optionsData = options.checkbox || [];
            }

            if (type === 'radio') {
                optionsData = options.radio || [];
            }
        }
    }

    // to not have svelte complain about too many variables
    const fns = {
        update: () => {
            question.type = type;
            question.description = description;
            question.options.checkbox = options.checkbox;
            question.options.radio = options.radio;
            question.options.select = options.select;
            question.key = key;
            question.question = questionText;

            question.update();
        },
        addOption: () => {
            if (type === 'select') {
                options.select = [...options.select, ''];
            }

            if (type === 'checkbox') {
                options.checkbox = [...options.checkbox, ''];
            }

            if (type === 'radio') {
                options.radio = [...options.radio, ''];
            }

            // reassign to trigger svelte reactivity
            options = options;
        },
        deleteOption: () => {
            if (type === 'select') {
                options.select = options.select.slice(0, options.select.length - 1);
            }

            if (type === 'checkbox') {
                options.checkbox = options.checkbox.slice(0, options.checkbox.length - 1);
            }

            if (type === 'radio') {
                options.radio = options.radio.slice(0, options.radio.length - 1);
            }

            // reassign to trigger svelte reactivity
            options = options;
        },
        delete: async () => {
            const res = await question.delete();
            if (res.isOk()) {
                question = undefined;
            }

            if (res.isErr()) {
                alert(res.error.message);
            }
        }
    }
</script>

{#if !!question}
    <div class="card">
        <div class="card-body">
            <div class="container">
                <div class="row mb-3">
                    <label for="{question.id}-text">Question Text</label>
                    <input type="text" class="form-control" id="{question.id}-text" bind:value="{questionText}" />
                </div>
                <div class="row mb-3">
                    <label for="{question.id}-key">Question Key</label>
                    <input type="text" class="form-control" id="{question.id}-key" bind:value="{key}" />
                </div>
                <div class="row mb-3">
                    <label for="{question.id}-description">Question Description</label>
                    <textarea class="form-control" id="{question.id}-description" bind:value="{description}"></textarea>
                </div>
                <div class="row mb-3">
                    <label for="{question.id}-type">Question Type</label>
                    <select class="form-control" id="{question.id}-type" bind:value="{type}">
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="select">Select</option>
                        <option value="checkbox">Checkbox</option>
                    </select>
                </div>
                {#if type === 'select' || type === 'checkbox' || type === 'radio'}
                    {#each optionsData as o}
                        <O text={o} />
                    {/each}
                    <div class="row mb-3">
                        <button class="btn btn-primary" on:click="{fns.addOption}">
                            Add Option
                        </button>
                    </div>
                {/if}
                <div class="btn-group">
                    <button class="btn btn-primary" on:click="{fns.update}">
                        Save <i class="material-icons">
                            save
                        </i>
                    </button>
                    <button class="btn btn-danger" on:click="{fns.delete}">
                        Delete Question <i class="material-icons">
                            delete
                        </i>
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}