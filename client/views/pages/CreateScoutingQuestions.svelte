<script lang="ts">
    import NavTabs from "../components/bootstrap/NavTabs.svelte";
    import CreateScoutingSections from "../components/scouting/CreateScoutingSections.svelte";


    type ScoutingQuestionGroup = {
        id: string;
        eventKey: string;
        name: string;
    };

    type ScoutingQuestion = {
        id: string;
        question: string;
        type: 'text' | 'number' | 'boolean' | 'select' | 'checkbox' | 'radio' | 'textarea';
        section: string;
        key: string;
        description: string;
        group: string; // id of the group
    }

    
    type Type = {
        name: string;
        groups: ScoutingQuestionGroup[];
        questions: ScoutingQuestion[];
    }

    export let event: any;
    export let types: Type[] = [];
    export let active: string = '';

    const save = (type: Type) => () => {
        console.log(type);
    }
</script>

<div class="container-fluid">
    <div class="row mb-3">
        <NavTabs tabs={types.map(t => t.name)} bind:active={active} on:change={(e) => active = e.detail}></NavTabs>
    </div>
    {#each types as type}
        {#if type.name === active}
            <div class="row">
                <CreateScoutingSections name={type.name} eventKey={event?.key} bind:groups={type.groups} bind:questions={type.questions} on:save={save(type)}></CreateScoutingSections>
            </div>
        {/if}
    {/each}
</div>


