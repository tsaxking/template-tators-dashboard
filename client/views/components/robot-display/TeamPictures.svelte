<script lang="ts">
import { FIRSTTeam } from "../../../models/FIRST/team";
import Carousel from "../bootstrap/Carousel.svelte";
import UploadTeamPicture from "./UploadTeamPicture.svelte";


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
        }
    }
</script>

<div class="card">
    <div class="card-header">
        <h5 class="card-title">
            {#if team}
                {team.number} | {team.name} Pictures
            {:else}
                Pictures (No Team Selected)
            {/if}
        </h5>
    </div>
    <div class="card-body">
        <div class="container-fluid">
            {#if pictures.length}
                <div class="row mb-3">
                    {#each pictures as pic}
                        <div class="col">
                            <img src={pic.url} alt={pic.name} class="img-thumbnail" />
                        </div>
                    {/each}
                    <!-- <Carousel bind:items={pictures} /> -->
                </div>
            {/if}
            {#if upload}
                <div class="row">
                    <UploadTeamPicture bind:team={team} />
                </div>
            {/if}
        </div>
    </div>
</div>
