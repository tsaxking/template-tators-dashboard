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

$: {
    fns.setDisable(team, disabled);
    fns.getValue(team, question);
}

const fns = {
    getValue: async (team: FIRSTTeam | undefined, q: Question) => {
        if (!team) return console.error('Team not defined');
        fns.set();
        if (!FIRSTEvent.current) return console.error('Event not defined');
        const res = await q.getAnswer(team, FIRSTEvent.current);
        if (res.isOk()) {
            if (!res.value) {
                value = [];
                answer = undefined;
                return;
            }
            value = res.value.answer;
            answer = res.value;

            answer.on('update', () => {
                value = answer?.answer || [];
                fns.set();
                fns.setValue(q, value);
            });

            fns.setValue(q, value);
        } else {
            console.error(res.error);
        }
    },
    saveValue: async () => {
        if (!team) return console.error('Team not defined');
        fns.set();
        changed = false;
        const res = await question.saveAnswer(team, value);
        if (res.isErr()) {
            return console.error(res.error);
        }
    },
    setValue: (q: Question, v: string[]) => {
        const input = me.querySelector('input');
        if (!input) return;

        switch (q.type) {
            case 'text':
            case 'textarea':
            case 'number':
            case 'select':
                input.value = value[0];
                break;
            case 'checkbox':
                value.forEach(v => {
                    const checkbox = me.querySelector(
                        `input[value="${v}"]`
                    ) as HTMLInputElement;
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
                break;
            case 'radio':
                const radio = me.querySelector(
                    `input[value="${value[0]}"]`
                ) as HTMLInputElement;
                if (radio) {
                    radio.checked = true;
                }
                break;
            case 'boolean':
                const checkbox = me.querySelector('input');
                if (checkbox) {
                    checkbox.checked = value[0] === 'true';
                }
                break;
        }
    },
    change: () => {
        changed = !value.length;
        fns.set();
    },
    set: async () => {
        try {
            document
                .querySelectorAll('.tooltip.bs-tooltip-auto')
                .forEach(e => e.remove());

            jQuery(me.querySelectorAll('[data-toggle="tooltip"]')).tooltip();
        } catch {
            // console.warn('Question not mounted')
        }
    },
    setDisable: (t: FIRSTTeam | undefined, _d: boolean) => {
        disabled = !t;
        fns.set();
    }
};

FIRSTTeam.on('select', t => {
    team = t;
    fns.setDisable(t, disabled);
    fns.getValue(t, question);
});

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
            Previously answered on {dateTime(new Date(answer.date))}
        </small>
    {/if}
</div>
