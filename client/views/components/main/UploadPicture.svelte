<script lang="ts">
import { Random } from '../../../../shared/math';
import { abbreviate } from '../../../../shared/text';
import { createEventDispatcher } from 'svelte';
import type { Picture } from '../../../utilities/general-types';

const id = 'input-' + Random.uuid();
let input: HTMLInputElement;
export let multiple: boolean = true;

let pictures: Picture[] = [];

const dispatch = createEventDispatcher();

const onInput = async (e: Event) => {
    const { files } = input;
    if (files) {
        change([
            ...(multiple ? pictures : []),
            ...(await Promise.all(
                Array.from(files).map(
                    f =>
                        new Promise<Picture>((res, rej) => {
                            const reader = new FileReader();
                            reader.onload = async () =>
                                res({
                                    url: reader.result as string,
                                    file: f
                                });
                            reader.onerror = rej;
                            reader.readAsDataURL(f);
                        })
                )
            ))
        ]);
    }
};
const remove = (p: Picture) => {
    change(pictures.filter(p2 => p2 !== p));
};
const change = (_pictures: Picture[]) => {
    // if (compareLists(pictures, _pictures)) return; // no change
    pictures = _pictures;
    input.files = null;
    // update input.files
    const dataTransfer = new DataTransfer();
    for (const f of pictures) dataTransfer.items.add(f.file);

    input.files = dataTransfer.files;

    dispatch('change', {
        fileList: dataTransfer.files,
        pictures
    });
};

// returns true if the lists are the same
const compareLists = (a: Picture[], b: Picture[]) => {
    if (a.length !== b.length) return false;
    for (const aFile of a) {
        const s = b.some(bFile => bFile.file.name === aFile.file.name);
        if (!s) return false;
    }
    return true;
};
</script>

<div class="container-fluid">
    <div class="row mb-3">
        <input
            type="file"
            name=""
            {id}
            class="form-control"
            {multiple}
            bind:this="{input}"
            on:change="{onInput}"
            accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG"
        />
    </div>
    <div class="row">
        {#each pictures as picture, i}
            <div class="col-sm-4 col-md-3 col-lg-2 m-1 no-select">
                <div
                    class="d-flex justify-content-between align-items-center py-1"
                >
                    <p class="p-0 m-0">
                        {abbreviate(picture.file.name, 20)}
                    </p>
                    <i
                        class="material-icons text-danger cursor-pointer p-0 m-0"
                        on:click="{() => remove(picture)}"
                    >
                        close
                    </i>
                </div>
                <img
                    src="{picture.url}"
                    alt="picture {i}"
                    class="img-thumbnail p-1"
                />
            </div>
        {/each}
    </div>
</div>
