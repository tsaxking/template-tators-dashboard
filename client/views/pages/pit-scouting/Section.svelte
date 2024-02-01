<script lang="ts">
    import { Group } from "../../../models/FIRST/question-scouting/group";
    import { Section } from "../../../models/FIRST/question-scouting/section";
    import G from './Group.svelte';
    import { prompt, alert } from "../../../utilities/notifications";
    import { FIRSTEvent } from "../../../models/FIRST/event";

    export let section: Section | undefined = undefined;
    let groups: Group[] = [];

    const getGroups = async (s: Section | undefined) => {
        if (!s) return;
        const res = await s.getGroups();
        groups = res.isOk() ? res.value : [];
    }

    $: {
        getGroups(section);
    }

    const createGroup = async () => {
        if (!FIRSTEvent.current) return alert('No event selected, cannot create group');
        if (!section) return alert('No section selected, cannot create group');
        const name = await prompt('Group Name');
        if (!name) return;
        const res = await section.addGroup({
            name,
            eventKey: FIRSTEvent.current.tba.key
        });

        if (res.isOk()) {
            groups = [...groups, res.value];
        }
    }
</script>

<div class="container">
    {#each groups as group}
        <div class="row">
            <G bind:group={group} />
        </div>
    {/each}
    <div class="row">
        <div class="col">
            <button class="btn btn-primary" on:click="{createGroup}">
                Create Group
            </button>
        </div>
    </div>
</div>