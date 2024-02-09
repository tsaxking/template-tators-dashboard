<script lang="ts">
import { Question } from '../../../models/FIRST/question-scouting/question';
import type {
    QuestionOptions,
    QuestionType
} from '../../../../shared/db-types-extended';

export let question: Question | undefined = undefined;

let type: QuestionType,
    options: QuestionOptions,
    description: string,
    key: string,
    questionText: string,
    optionsData: string[] = []; //,
$: {
    fns.setQuestion(question);
}

// to not have svelte complain about too many variables
const fns = {
    setQuestion: (q: Question | undefined) => {
        if (q) {
            type = question.type;
            options = question.options;
            description = question.description.trim();
            key = question.key.trim();
            questionText = question.question.trim();

            if (type === 'select') {
                optionsData = options.select.map(o => o.trim()) || [];
            }

            if (type === 'checkbox') {
                optionsData = options.checkbox.map(o => o.trim()) || [];
            }

            if (type === 'radio') {
                optionsData = options.radio.map(o => o.trim()) || [];
            }

            // q.on('update', () => {})
        }
    }
};
</script>
