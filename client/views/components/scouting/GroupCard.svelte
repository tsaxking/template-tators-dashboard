<script lang="ts">
    import Card from "../bootstrap/Card.svelte";
    // import QuestionCard from "./QuestionCard.svelte";
    import Button from "../bootstrap/Button.svelte";
    // import { ScoutingQuestion } from '../../../../shared/scouting';
    import FloatingInput from "../bootstrap/FloatingInput.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let title: string;
</script>


<Card bind:title={title} classes="w-100">
    <div slot="header">
        <div class="btn-group">
            <Button color="primary" on:click={() => dispatch('addCard')}>
                <i class="material-icons">add</i>&nbsp;Add Question
            </Button>
            <Button color="primary" outline={true} on:click={() => dispatch('moveCardUp')}>
                <i class="material-icons">arrow_upward</i>
            </Button>
            <Button color="info" outline={true} on:click={() => dispatch('moveCardDown')}>
                <i class="material-icons">arrow_downward</i>
            </Button>
            <Button color="danger" on:click={() => dispatch('delete')}>
                <i class="material-icons">delete</i>&nbsp;Delete
            </Button>
        </div>
    </div>

    <div slot="body">
        <div class="mb-3">
            <FloatingInput bind:value={title} on:change={() => dispatch('changeTitle', title)} type="text" label="Group Title"></FloatingInput>
        </div>

        <!-- {#each questions as question} -->
            <!-- <QuestionCard question={question.question} key={question.key} description={question.description} type={question.type} on:delete={removeCard(question.id)} on:change={(e) => dispatch('changeCardInfo', e.detail)}></QuestionCard> -->
        <!-- {/each} -->
        <slot></slot>
    </div>
</Card>