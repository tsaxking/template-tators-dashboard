<script lang="ts">
import { onMount } from 'svelte';
import { Question } from '../../../models/FIRST/question-scouting/question';
import { FIRSTTeam } from '../../../models/FIRST/team';
import { FIRSTEvent } from '../../../models/FIRST/event';
import { Answer } from '../../../models/FIRST/question-scouting/answer';
import { dateTime } from '../../../../shared/clock';
// import { createEventDispatcher } from 'svelte';

export let question: Question;
export let value: string[] = [];
export let team: FIRSTTeam | undefined = undefined;
let answer: Answer | undefined = undefined;

let changed = true,
    disabled = false,
    me: HTMLDivElement;

    // TODO: Restructure all of these functions to make more sense



const fns = {
    // submits the answer to the server
    saveValue: async () => {
        if (!team) return;
        const result = await question.saveAnswer(team, value);
        if (result.isOk()) changed = false;
    },
    // sets the changed variable to true
    change: () => {
        changed = true;
    },
    // gets the value of the question, if it exists
    getValue: async (team: FIRSTTeam | undefined, question: Question) => {
        if (!team) return;
        const answer = await question.getAnswer(team, team.event);
        if (answer.isOk()) {
            if (answer.value) {
                value = answer.value.answer;
                changed = false;
            } else {
                value = [];
                changed = true;
            }
        }
    },
    // sets the disabled variable to true if the team is undefined
    setDisable: (team: FIRSTTeam | undefined, d: boolean) => {
        disabled = !team || d;
    },
};

FIRSTTeam.on('select', t => {
    team = t;
    fns.setDisable(team, disabled);
    fns.getValue(team, question);
});

$: fns.getValue(team, question);

// const dispatch = createEventDispatcher();
</script>

<div class="mb-3" bind:this="{me}">
    <label for="q-{question.id}" class="mb-3">
        {question.question}
    </label>

    <div class="container">
        <div class="row">
            <div class="col-lg-11 col-md-10 col-sm-9 col-8">
                {#if question.type === 'text'}
                    <input
                        type="text"
                        id="q-{question.id}"
                        class="form-control"
                        on:change="{event => {
                            value = [event.currentTarget.value];
                            fns.saveValue();
                        }}"
                        {disabled}
                        on:input="{fns.change}"
                        value="{value[0] || ''}"
                    />
                {:else if question.type === 'textarea'}
                    <textarea
                        id="q-{question.id}"
                        class="form-control"
                        on:change="{event => {
                            value = [event.currentTarget.value];
                            fns.saveValue();
                        }}"
                        {disabled}
                        on:input="{fns.change}"
                        value="{value[0] || ''}"
                    ></textarea>
                {:else if question.type === 'number'}
                    <input
                        type="number"
                        id="q-{question.id}"
                        class="form-control"
                        on:change="{event => {
                            value = [event.currentTarget.value];
                            fns.saveValue();
                        }}"
                        {disabled}
                        on:input="{fns.change}"
                        value="{value[0] || ''}"
                    />
                {:else if question.type === 'checkbox'}
                    {#each question.options.checkbox || [] as option, i}
                        <div class="form-check">
                            <input
                                type="checkbox"
                                id="q-{question.id}-{i}"
                                class="form-check-input"
                                value="{option}"
                                on:change="{event => {
                                    if (event.currentTarget.checked) {
                                        value = [...value, option];
                                    } else {
                                        value = value.filter(v => v !== option);
                                    }
                                    fns.saveValue();
                                }}"
                                {disabled}
                                on:input="{fns.change}"
                                checked="{value.includes(option)}"
                            />
                            <label
                                for="q-{question.id}-{i}"
                                class="form-check-label"
                            >
                                {option}
                            </label>
                        </div>
                    {/each}
                {:else if question.type === 'radio'}
                    {#each question.options.radio || [] as option, i}
                        <div
                            class="form-check
                            form-check-inline"
                        >
                            <input
                                type="radio"
                                id="q-{question.id}-{i}"
                                class="form-check-input"
                                value="{option}"
                                on:change="{event => {
                                    value = [option];
                                    fns.saveValue();
                                }}"
                                {disabled}
                                on:input="{fns.change}"
                                checked="{value[0] === option}"
                            />
                            <label
                                for="q-{question.id}-{i}"
                                class="form-check-label"
                            >
                                {option}
                            </label>
                        </div>
                    {/each}
                {:else if question.type === 'select'}
                    <select
                        id="q-{question.id}"
                        class="form-control"
                        on:change="{event => {
                            value = [event.currentTarget.value];
                            fns.saveValue();
                        }}"
                        {disabled}
                        on:input="{fns.change}"
                        value="{value[0] || ''}"
                    >
                        {#each question.options.select || [] as option}
                            <option value="{option}">
                                {option}
                            </option>
                        {/each}
                    </select>
                {:else if question.type === 'boolean'}
                    <!-- Radio buttons -->
                    <div class="form-check">
                        <input
                            type="radio"
                            id="q-{question.id}-true"
                            class="form-check-input"
                            value="true"
                            on:change="{event => {
                                value = ['true'];
                                fns.saveValue();
                            }}"
                            {disabled}
                            on:input="{fns.change}"
                            checked="{value[0] === 'true'}"
                        />
                        <label
                            for="q-{question.id}-true"
                            class="form-check-label"
                        >
                            Yes
                        </label>
                    </div>
                    <div class="form-check">
                        <input
                            type="radio"
                            id="q-{question.id}-false"
                            class="form-check-input"
                            value="false"
                            on:change="{event => {
                                value = ['false'];
                                fns.saveValue();
                            }}"
                            {disabled}
                            on:input="{fns.change}"
                            checked="{value[0] === 'false'}"
                        />
                        <label
                            for="q-{question.id}-false"
                            class="form-check-label"
                        >
                            No
                        </label>
                    </div>
                {/if}
            </div>
            <div
                class="col-lg-1 col-md-2 col-sm-3 col-4 d-flex justify-content-between align-items-center"
            >
                {#if disabled}
                    <i
                        class="material-icons text-warning no-select"
                        data-bs-title="No team selected"
                        data-toggle="tooltip"
                    >
                        unpublished
                    </i>
                {:else if changed}
                    <i
                        class="material-icons text-danger no-select"
                        data-bs-title="Unsaved changes!"
                        data-toggle="tooltip"
                    >
                        warning
                    </i>
                    <button
                        class="btn btn-success"
                        data-bs-title="Save"
                        data-toggle="tooltip"
                    >
                        <!-- This doesn't need an on-click, it just helps the user click out of the input, which is what saves the data -->
                        <i class="material-icons">save</i>
                    </button>
                {:else}
                    <i
                        class="material-icons text-success no-select"
                        data-bs-title="No unsaved changes"
                        data-toggle="tooltip"
                    >
                        check
                    </i>
                {/if}
            </div>
        </div>
    </div>

    {#if question.description}
        <small>
            {question.description}
        </small>
    {/if}
    {#if answer}
        <small>
            Previously answered on {dateTime(answer.date)}
        </small>
    {/if}
</div>
