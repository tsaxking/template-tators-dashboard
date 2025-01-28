<script lang="ts">
import UploadPicture from '../main/UploadPicture.svelte';
import { FIRSTTeam } from '../../../models/FIRST/team';
import { onMount } from 'svelte';
import { Modal } from '../../../utilities/modals';
import { alert } from '../../../utilities/notifications';

export let team: FIRSTTeam | undefined = undefined;
let fileList: FileList;

let me: HTMLDivElement;

const open = () => {
    if (!team) return alert('No team selected!');

    const m = new Modal();
    const upload = new UploadPicture({
        target: m.target.querySelector('.modal-body') as HTMLElement
    });

    upload.$on('change', (e: CustomEvent) => {
        fileList = e.detail.fileList;
    });

    m.show();

    const close = document.createElement('button');
    close.classList.add('btn', 'btn-secondary');
    close.textContent = 'Close';
    close.addEventListener('click', () => m.hide());

    const submit = document.createElement('button');
    submit.classList.add('btn', 'btn-success');
    submit.textContent = 'Submit';
    submit.addEventListener('click', () => {
        if (fileList.length === 0) return;
        if (!team) return console.error('No team');
        team.savePictures(fileList);
        m.hide();
    });

    const group = document.createElement('div');
    group.classList.add('btn-group', 'd-flex', 'justify-content-between');
    group.appendChild(close);
    group.appendChild(submit);

    m.setFooter(group);

    m.on('hide', () => {
        m.destroy();
        upload.$destroy();
    });
};
</script>

<div bind:this="{me}">
    <button class="btn btn-primary" type="button" on:click="{open}"
        >Upload Pictures</button
    >
</div>
