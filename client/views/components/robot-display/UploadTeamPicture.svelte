<script lang="ts">
    import UploadPicture from "../main/UploadPicture.svelte";
import Modal from "../bootstrap/Modal.svelte";
    import { FIRSTTeam } from '../../../models/FIRST/team';    

    export let team: FIRSTTeam;
    let fileList: FileList;

</script>

<Modal title="Upload {team.number} picture">
    <UploadPicture multiple={true} on:change={({ detail: { fileList } }) => {
        fileList = fileList;
    }}/>
    <div slot="buttons">
        <button type="button" class="btn btn-primary" on:click={() => {
            if (!team) return;
            team.savePictures(fileList);
        }}>Save</button>
    </div>
</Modal>

