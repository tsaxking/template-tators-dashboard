<script lang="ts">
import { FIRSTMatch } from './../../../models/FIRST/match';
import { FIRSTTeam } from './../../../models/FIRST/team';
import { FIRSTEvent } from '../../../models/FIRST/event';
import { Modal } from '../../../utilities/modals';
import { onMount } from 'svelte';

const rbt = '../../../../public/pictures/icons/rbt.png';

export let team: FIRSTTeam | undefined;
export let match: number;
export let alignment: 'start' | 'end';
export let pictures: P[] = [];

let pic: P = {
    url: ''
};

type P = {
    name?: string;
    description?: string;
    url: string;
};

onMount(async () => {
    const event = await FIRSTEvent.current;
});

const fns = {
    setPictures: async (team?: FIRSTTeam) => {
        if (!team) return (pictures = []);
        pictures = [];
        await team.event.cacheTeamPictures();
        const pics = await team.getPictures();
        if (pics.isErr()) return console.error(pics.error);
        pictures = pics.value.map(p => ({
            url: '/uploads/' + p.picture
        }));
        pic = {
            url: rbt
        };
        console.log(pic.url);
        console.log(rbt);
    }
};

$: {
    if (team) {
        fns.setPictures(team);
        console.log('test');
        team.on('new-picture', () => {
            fns.setPictures(team);
        });
    }
}
</script>

<div class="mb-3 bg-gray-light flex-fill p-3 rounded w-75 position-relative">
    <div class="d-flex flex-column justify-content-between align-items-center">
        <h4 class="text-black">Robot {team?.tba.team_number}</h4>
    </div>
    <div
        class="d-flex flex-column justify-content-center align-items-center h-100 position-relative"
    >
        <!-- Apply alignment class based on the 'alignment' variable -->
        <div
            class="position-absolute top-0 start-0 end-0 d-flex justify-content-{alignment} align-items-center"
        >
            <img src="{pic.url}" alt="" class="img-fluid rounded h-75" />
        </div>
    </div>
</div>

<style>
.bg-gray-light {
    background-color: rgba(200, 200, 200, 0.7);
}

/* Optional: Define specific alignment classes if needed */
.align-start {
    align-items: flex-start;
}

.align-end {
    align-items: flex-end;
}
</style>
