<script lang="ts">
import { createEventDispatcher } from 'svelte';
import { FIRSTTeam } from '../../../models/FIRST/team';

const d = createEventDispatcher();

export let team: FIRSTTeam | undefined = undefined;
let scoutingSections: {
    section: string;
    groups: {
        name: string;
        questions: {
            question: string;
            answer: string;
        }[];
    }[];
}[] = [];

const fns = {
    pullScouting: async (t: FIRSTTeam | undefined) => {
        if (!t) return console.log('no team selected');
        console.log('retrieving pit scouting');

        const res = await t.getPitScouting();

        if (res.isErr()) return console.error(res.error);

        const questions = (
            await Promise.all(res.value.map(s => s.getQuestion()))
        ).filter((q, i, a) => a.indexOf(q) === i);
        const groups = (
            await Promise.all(questions.map(q => q.getGroup()))
        ).filter((g, i, a) => a.indexOf(g) === i);
        const sections = (
            await Promise.all(groups.map(g => g.getSection()))
        ).filter((s, i, a) => a.indexOf(s) === i);

        scoutingSections = sections.map(s => ({
            section: s.name,
            groups: groups
                .filter(g => g.section === s.id)
                .map(g => ({
                    name: g.name,
                    questions: questions
                        .filter(q => q.groupId === g.id)
                        .map(q => ({
                            question: q.key,
                            answer: (() => {
                                switch (q.type) {
                                    case 'text':
                                    case 'textarea':
                                    case 'number':
                                    case 'radio':
                                    case 'select':
                                        return (
                                            res.value.find(
                                                a => a.questionId === q.id
                                            )?.answer[0] || ''
                                        );
                                    case 'checkbox':
                                        return res.value
                                            .filter(a => a.questionId === q.id)
                                            .map(a => a.answer[0])
                                            .join(', ');
                                    case 'boolean':
                                        return res.value.find(
                                            a => a.questionId === q.id
                                        )?.answer[0] === 'true'
                                            ? 'Yes'
                                            : 'No';
                                    default:
                                        return '';
                                }
                            })()
                        }))
                }))
        }));
    }
};

$: fns.pullScouting(team);
</script>

{#each scoutingSections as section}
    <h6>{section.section}</h6>
    <table class="table table-dark table-striped">
        {#each section.groups as group}
            <thead>
                <tr>
                    <th colspan="2" class="text-center">{group.name}</th>
                </tr>
            </thead>
            <tbody>
                {#each group.questions as question}
                    <tr>
                        <td>{question.question}</td>
                        <td>{question.answer}</td>
                    </tr>
                {/each}
            </tbody>
        {/each}
    </table>
{/each}
