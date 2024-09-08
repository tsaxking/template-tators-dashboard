<script lang="ts">
import { createEventDispatcher } from 'svelte';
import { FIRSTTeam } from '../../../models/FIRST/team';
import { Account } from '../../../models/account';
import { resolveAll } from '../../../../shared/check';
import DashboardCard from '../main/DashboardCard.svelte';

const d = createEventDispatcher();

export let team: FIRSTTeam | undefined = undefined;
let scoutingSections: {
    section: string;
    groups: {
        name: string;
        questions: {
            question: string;
            answer: string;
            account: string;
        }[];
    }[];
}[] = [];

const fns = {
    pullScouting: async (t: FIRSTTeam | undefined) => {
        if (!t) return console.log('no team selected');

        scoutingSections = [];

        const res = await t.getPitScouting();

        if (res.isErr()) return console.error(res.error);

        const questionsRes = resolveAll(
            await Promise.all(res.value.map(s => s.getQuestion()))
        );

        if (questionsRes.isErr()) return console.error(questionsRes.error);
        const questions = questionsRes.value.filter(
            (d, i, a) => a.findIndex(_s => _s.id === d.id) === i
        );

        const groupsRes = resolveAll(
            await Promise.all(questions.map(q => q.getGroup()))
        );

        if (groupsRes.isErr()) return console.error(groupsRes.error);
        const groups = groupsRes.value.filter(
            (d, i, a) => a.findIndex(_s => _s.id === d.id) === i
        );

        const sectionsRes = resolveAll(
            await Promise.all(groups.map(g => g.getSection()))
        );

        if (sectionsRes.isErr()) return console.error(sectionsRes.error);
        const sections = sectionsRes.value.filter(
            (d, i, a) => a.findIndex(_s => _s.id === d.id) === i
        );

        const accounts: {
            [key: string]: Account;
        } = (await Account.get(res.value.map(a => a.accountId))).reduce(
            (a, c) => {
                if (c) a[c.id] = c;
                return a;
            },
            {} as { [key: string]: Account }
        );

        scoutingSections = await Promise.all(
            sections.map(async s => ({
                section: s.name,
                groups: await Promise.all(
                    groups
                        .filter(g => g.section === s.id)
                        // filter duplicates
                        .filter((g, i, a) => a.indexOf(g) === i)
                        .map(async g => ({
                            name: g.name,
                            questions: await Promise.all(
                                questions
                                    .filter(q => q.groupId === g.id)
                                    // filter duplicates
                                    .filter((q, i, a) => a.indexOf(q) === i)
                                    .map(async q => ({
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
                                                            a =>
                                                                a.questionId ===
                                                                q.id
                                                        )?.answer[0] || ''
                                                    );
                                                case 'checkbox':
                                                    return res.value
                                                        .filter(
                                                            a =>
                                                                a.questionId ===
                                                                q.id
                                                        )
                                                        .map(a => a.answer[0])
                                                        .join(', ');
                                                case 'boolean':
                                                    return res.value.find(
                                                        a =>
                                                            a.questionId ===
                                                            q.id
                                                    )?.answer[0] === 'true'
                                                        ? 'Yes'
                                                        : 'No';
                                                default:
                                                    return '';
                                            }
                                        })(),
                                        account:
                                            accounts[
                                                res.value.find(
                                                    a =>
                                                        a.questionId === q.id &&
                                                        a.teamNumber ===
                                                            t.number
                                                )?.accountId || ''
                                            ]?.name || 'Unknown'
                                    }))
                            )
                        }))
                )
            }))
        );
    }
};

$: fns.pullScouting(team);
</script>

{#each scoutingSections as section}
    <DashboardCard expandable="{true}" title="{section.section}">
        <table class="table table-striped">
            {#each section.groups as group}
                <thead>
                    <tr>
                        <th class="text-center" colspan="3">{group.name}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each group.questions as question}
                        <tr>
                            <td>{question.question}</td>
                            <td>{question.answer}</td>
                            <td>{question.account}</td>
                        </tr>
                    {/each}
                </tbody>
            {/each}
        </table>
    </DashboardCard>
{/each}
