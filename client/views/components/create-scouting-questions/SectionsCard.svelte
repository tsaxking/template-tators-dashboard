<script lang="ts">
  import Button from '../bootstrap/Button.svelte';
  import GroupCard from './GroupCard.svelte';
  import { Section } from '../../../models/FIRST/question-scouting/section';
  import { Group } from '../../../models/FIRST/question-scouting/group';
  import { onMount } from 'svelte';
  import { Random } from '../../../../shared/math';
  import { FIRSTEvent } from '../../../models/FIRST/event';

  export let section: Section;

  let groups: Group[] = [];

  onMount(() => {
    section.on('update', async s => {
      section = s;
    });

    section.on('new-group', async g => {
      groups = [...groups, g];
    });

    section.on('delete-group', async id => {
      groups = groups.filter(group => group.id !== id);
    });
  });

  const addGroup = async (name: string) => {
    const eventKey = FIRSTEvent.current?.tba.key;
    if (!eventKey) return;

    const res = await section.addGroup({
      name,
      eventKey: eventKey
    });

    if (res.isOk()) {
      groups = [...groups, res.value];
    }
  };

  const removeGroup = async (id: string) => {
    const res = await section.removeGroup(id);

    if (res.isOk()) {
      groups = groups.filter(group => group.id !== id);
    }
  };
</script>

<div class="container">
  <div class="row mb-3">
    <div class="col-12">
      <h3>Create {section.name} Sections</h3>
    </div>
  </div>

  <div class="row mb-3">
    <div class="btn-group">
      <Button color="primary">
        <i class="material-icons">add</i>&nbsp;Add Group
      </Button>
      <Button color="success">
        <i class="material-icons">save</i>&nbsp;Save
      </Button>
      <Button color="danger">
        <i class="material-icons">undo</i>&nbsp;Undo
      </Button>
      <Button color="warning">
        <i class="material-icons">redo</i>&nbsp;Redo
      </Button>
    </div>
  </div>

  {#each groups as group}
    <GroupCard {group} />
  {/each}
</div>
