<script lang="ts">
import { attemptAsync } from '../../../../shared/check';
import FilePond, { registerPlugin } from 'svelte-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import { FIRSTTeam } from '../../../models/FIRST/team';
import { alert } from '../../../utilities/notifications';
import { getContext } from 'svelte';
import { ActualFileObject } from 'filepond';
import { onMount } from 'svelte';

registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageTransform,
    FilePondPluginImageCrop,
    FilePondPluginImageResize
);

export let team: FIRSTTeam | undefined = undefined;

let pond: FilePond;
let name = 'team-pictures';

const handleInit = async () => {
    console.log('FilePond has initialised');
};

const uploadFile = async (file: ActualFileObject) => {
    if (!team) {
        alert('No team selected!');
        return;
    }

    const fileList = new DataTransfer();
    const realFile = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified
    });
    fileList.items.add(realFile);

    const result = await team.savePictures(fileList.files, progress => {});

    if (result.isErr()) {
        alert('Failed to upload picture. Please try again.');
        console.error(result.error);
        return;
    }

    if (result.isOk()) {
        console.log(`Picture ${file.name} uploaded successfully`);
        return true;
    }
};

const handleAddFile = async (err: any, file: ActualFileObject) => {
    console.log('A file has been added', file);
    await uploadFile(file);
};

onMount(() => {
    const creditsElements = document.querySelectorAll('.filepond--credits');
    creditsElements.forEach(element => element.remove());

    // the credits don't want to style correctly, will add if I can figure out the styles
});

// TODO: https://pqina.nl/pintura/docs/v8/installation/filepond/
// filepond image editor, should be limitable to just cropping and rotation
</script>

<div class="bg-dark">
    <FilePond
        bind:this="{pond}"
        {name}
        allowMultiple="{true}"
        labelIdle="Drag & Drop your team pictures or <span class='filepond--label-action'>Browse</span>"
        oninit="{handleInit}"
        allowImageTransform="{true}"
        imageTransformOutputQuality="{25}"
        imageTransformOutputMimeType="image/jpeg"
        instantUpload="{true}"
        server="{{
            process: async (
                fieldName,
                file,
                metadata,
                load,
                error,
                progress,
                abort,
                transfer,
                options
            ) => {
                try {
                    const result = await uploadFile(file);
                    if (result) {
                        load(file);
                    } else {
                        error('Failed to upload picture. Please try again.');
                    }
                } catch (err) {
                    console.error('Error during upload:', err);
                    error('Failed to upload picture. Please try again.');
                }
            }
        }}"
    />
</div>

<style>
@import 'filepond/dist/filepond.css';
@import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

:global(.filepond--panel-root) {
    background-color: var(--bs-dark);
    border: 1px solid var(--bs-gray-dark);
    border-radius: var(--bs-border-radius);
    padding: var(--bs-spacing);
    box-shadow: var(--bs-box-shadow);
}

:global(.filepond--drop-label) {
    color: var(--bs-light);
}
</style>
