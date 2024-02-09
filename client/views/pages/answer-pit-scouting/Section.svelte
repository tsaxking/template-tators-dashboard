<script lang="ts">
    import { Group } from '../../../models/FIRST/question-scouting/group';
    import { Section } from '../../../models/FIRST/question-scouting/section';
    import G from './Group.svelte';
    import { FIRSTEvent } from '../../../models/FIRST/event';
    
    export let section: Section | undefined = undefined;
    let groups: Group[] = [];
    
    const getGroups = async (s: Section | undefined, event: FIRSTEvent | undefined) => {
        if (!s) return;
        if (!event) return;
        const res = await s.getGroups(event);
        if (res.isOk()) {
            groups = res.value;
        } else {
            console.error(res.error);
        }
        
        console.log({ groups, event, s });
    
        const pull = () => {
            getGroups(s, event);
            s.off('new-group', pull);
            s.off('delete-group', pull);
        };
    
        s.on('new-group', pull);
        s.on('delete-group', pull);
    };
    
    $: {
        if (section) {
            getGroups(section, FIRSTEvent.current);
        }
    }
    
    FIRSTEvent.on('select', async (event) => {
        getGroups(section, event);
    });
    </script>
    
<div class="container">
    {#each groups as group, i}
        <div class="row mb-3">
            <G bind:group={group} index="{i}" />
        </div>
    {/each}
</div>
