<script lang="ts">
import { Group } from '../../../models/FIRST/question-scouting/group';
import { Section } from '../../../models/FIRST/question-scouting/section';
import G from './Group.svelte';
import { prompt, alert, confirm } from '../../../utilities/notifications';
import { FIRSTEvent } from '../../../models/FIRST/event';

export let section: Section | undefined = undefined;
let groups: Group[] = [];

const getGroups = async (s: Section | undefined, event: FIRSTEvent | null) => {
    if (!s) return;
    if (!event) return;
    const res = await s.getGroups(event);
    if (res.isOk()) {
        groups = res.value;
    } else {
        console.error(res.error);
    }

    const pull = () => {
        getGroups(s, event);
        s.off('new-group', pull);
        s.off('delete-group', pull);
    };

    s.on('new-group', pull);
    s.on('delete-group', pull);
};

const createGroup = async () => {
    if (!FIRSTEvent.current)
        return alert('No event selected, cannot create group');
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
};

$: {
    if (section) {
        getGroups(section, FIRSTEvent.current);
    }
}

FIRSTEvent.on('select', async event => {
    getGroups(section, event);
});

const deleteSection = async () => {
    if (!section) return;
    const doDelete = await confirm(
        'Are you sure you want to delete this section?'
    );
    if (!doDelete) return;

    const res = await section.delete();
    if (res.isOk()) {
        section = undefined;
    }
};
</script>

<div class="container">
    {#each groups as group, i}
        <div class="row mb-3">
            <G bind:group index="{i}" />
        </div>
    {/each}
    <div class="row">
        <div class="col">
            <button class="btn btn-primary" on:click="{createGroup}">
                <i class="material-icons">add</i> Group
            </button>
        </div>
        <div class="col">
            <button class="btn btn-danger" on:click="{deleteSection}">
                <i class="material-icons">delete</i> Delete Section
            </button>
        </div>
    </div>
</div>
