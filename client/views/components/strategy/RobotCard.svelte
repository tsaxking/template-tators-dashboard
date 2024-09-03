<script lang="ts">
import { FIRSTTeam } from './../../../models/FIRST/team';
import { FIRSTEvent } from '../../../models/FIRST/event';
import { onMount } from 'svelte';
import { type MatchInterface } from '../../../models/FIRST/interfaces/match';

const rbt = '../../../../public/pictures/icons/rbt.png';

export let team: FIRSTTeam | undefined;
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

const setPictures = async (team?: FIRSTTeam) => {
    if (!team) return (pictures = []);
    pictures = [];
    await team.event.cacheTeamPictures();
    const pics = await team.getPictures();
    if (pics.isErr()) return console.error(pics.error);
    pictures = pics.value.map(p => ({
        url: '/uploads/' + p.picture
    }));
    pic = {
        // override images to use rbt image
        url: rbt
    };
    console.log(pic.url);
    console.log(rbt);
};

$: {
    if (team) {
        setPictures(team);
        console.log('test');
        team.on('new-picture', () => {
            setPictures(team);
        });
    }
}
</script>

<div class="mb-3 bg-gray-light flex-fill p-3 rounded w-75 position-relative">
    <div class="d-flex flex-column justify-content-between align-items-center">
        <h4 class="text-black">
            Team {team?.tba.team_number}: {team?.tba.nickname}
        </h4>
    </div>
    <div
        class="d-flex flex-column justify-content-center align-items-center h-100 position-relative"
    >
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

.align-start {
    align-items: flex-start;
}

.align-end {
    align-items: flex-end;
}
</style>
