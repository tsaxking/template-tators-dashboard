<script lang="ts">
import { FIRSTTeam } from '../../../models/FIRST/team';
import { Modal } from '../../../utilities/modals';
import Carousel from '../bootstrap/Carousel.svelte';
import UploadTeamPicture from './UploadTeamPicture.svelte';

type P = {
    name?: string;
    description?: string;
    url: string;
};

export let team: FIRSTTeam;
export let upload = false;
export let pictures: P[] = [];

const fns = {
    setPictures: async (team: FIRSTTeam) => {
        const ps = await team.getPictures();

        if (ps.isErr()) return console.error(ps.error);

        pictures = ps.value.map(p => ({
            url: '/uploads/' + p.picture
        }));
    }
};

$: {
    if (team) {
        fns.setPictures(team);

        team.on('new-picture', () => {
            fns.setPictures(team);
        });
    }
}
</script>

<div class="container-fluid">
    {#if pictures.length}
        <div class="row mb-3">
            {#each pictures as pic}
                <div class="col">
                    <img
                        src="{pic.url}"
                        alt="{pic.name}"
                        class="img-thumbnail team-picture cursor-pointer"
                        on:click="{() => {
                            const img = new Image();
                            img.src = pic.url;
                            img.style.width = '100%';
                            const div = document.createElement('div');
                            div.appendChild(img);
                            img.onload = () => {
                                const m = new Modal();
                                m.setTitle(String(team.number));
                                m.setBody(div);
                                m.size = 'lg';
                                m.show();
                            };
                        }}"
                    />
                </div>
            {/each}
            <!-- <Carousel bind:items={pictures} /> -->
        </div>
    {/if}
    {#if upload}
        <div class="row">
            <UploadTeamPicture bind:team />
        </div>
    {/if}
</div>

<style>
.team-picture {
    max-width: 100%;
    max-height: 100%;
    min-width: 75px;

    margin: 0 auto;
}
</style>
