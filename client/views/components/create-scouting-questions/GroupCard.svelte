<script lang="ts">
    import { dateTime } from '../../../../shared/clock';
    import QuestionCard from './QuestionCard.svelte';
    import { Group } from '../../../models/FIRST/question-scouting/group';
    import { Question } from '../../../models/FIRST/question-scouting/question';
import { onMount } from 'svelte';

    export let group: Group;

    onMount(() => {
        group.on('update', async (g) => {
            group = g;
        });

        group.on('new-question', async (q) => {
            questions = [...questions, q];
        });

        group.on('delete-question', async (id) => {
            questions = questions.filter((question) => question.id !== id);
        });
    });

    let questions: Question[] = [];


    const addQuestion = async (data: {
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
        options: any; // TODO: add type
    }) => {
        const res = await group.addQuestion({
            question: data.question,
            type: data.type,
            key: data.key,
            description: data.description,
            options: data.options,
        });

        if (res.isOk()) {
            questions = [...questions, res.value];
        }
    };

    const removeQuestion = async (id: string) => {
        const res = await group.removeQuestion(id);

        if (res.isOk()) {
            questions = questions.filter((question) => question.id !== id);
        }
    };
</script>

<div class="row mb-3">
    <div class="card">
        <div class="card-header">
            <div class="card-title d-flex justify-content-between">
                <h4>{group.name}</h4>
                <small>
                    {dateTime(group.dateAdded)}
                </small>
            </div>
        </div>
        <div class="card-body">
            {#each questions as question}
                <QuestionCard {question}/>
            {/each}
        </div>
    </div>
</div>