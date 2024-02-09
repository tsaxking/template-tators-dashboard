<script lang="ts">
import { Question } from '../../../models/FIRST/question-scouting/question';
import { FIRSTTeam } from '../../../models/FIRST/team';
// import { createEventDispatcher } from 'svelte';

export let question: Question;
export let value: string[] = [];
    export let team: FIRSTTeam | undefined = undefined;

$: {
    fns.getValue(question);
}

const fns = {
    getValue: async (q: Question) => {
        if (!team) return console.error('Team not defined');
        const res = await q.getAnswer(team);
        if (res.isOk()) {
            value = res.value;
        } else {
            console.error(res.error);
        }
    },
    setValue: async (q: Question) => {
        if (!team) return console.error('Team not defined');
        const res = await q.saveAnswer(team, value);
        if (res.isErr()) {
            console.error(res.error);
        }
    }
};

// const dispatch = createEventDispatcher();
</script>

<div class="mb-3">
    <label for="q-{question.id}">
        {question.question}
    </label>

    {#if question.type === 'text'}
        <input 
            type="text" 
            id="q-{question.id}" 
            class="form-control" 
            on:change={(event) => {
                value = [event.currentTarget.value];
            }}
            value={value[0] || ''}>
    {:else if question.type === 'textarea'}
        <textarea 
            id="q-{question.id}" 
            class="form-control"
            on:change={(event) => {
                value = [event.currentTarget.value];
            }}
            value={value[0] || ''}></textarea>
    {:else if question.type === 'number'}
        <input 
            type="number" 
            id="q-{question.id}" 
            class="form-control" 
            on:change={(event) => {
                value = [event.currentTarget.value];
            }}
            value={value[0] || ''}>
    {:else if question.type === 'checkbox'}
        {#each question.options.checkbox as option, i}
            <div class="form-check">
                <input 
                    type="checkbox" 
                    id="q-{question.id}-{i}" 
                    class="form-check-input"
                    on:change={(event) => {
                        if (event.currentTarget.checked) {
                            value = [...value, option];
                        } else {
                            value = value.filter(v => v !== option);
                        }
                    }}
                    checked={value.includes(option)}
                    >
                <label 
                    for="q-{question.id}-{i}" 
                    class="form-check-label">
                    {option}
                </label>
            </div>
        {/each}
    {:else if question.type === 'radio'}
        {#each question.options.radio as option, i}
            <div class="form-check
                    form-check-inline">
                <input 
                    type="radio" 
                    id="q-{question.id}-{i}" 
                    class="form-check-input"
                    on:change={(event) => {
                        value = [option];
                    }}
                    checked={value[0] === option}
                    >
                <label 
                    for="q-{question.id}-{i}" 
                    class="form-check-label">
                    {option}
                </label>
            </div>
        {/each}
    {:else if question.type === 'select'}
        <select 
            id="q-{question.id}" 
            class="form-control" 
            on:change={(event) => {
                value = [event.currentTarget.value];
            }}
            value={value[0] || ''}
        >
            {#each question.options.select as option}
                <option value={option}>
                    {option}
                </option>
            {/each}
        </select>
    {/if}

    {#if question.description}
        <small>
            {question.description}
        </small>
    {/if}
</div>