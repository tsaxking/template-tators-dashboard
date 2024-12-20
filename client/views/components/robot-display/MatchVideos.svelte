<script lang="ts">
    import { FIRSTMatch } from '../../../models/FIRST/match';
    export let match: FIRSTMatch | undefined;
    let matchVideos: string[] = [];

    const pullVideos = (m: FIRSTMatch | undefined) => {
        if (m) {
            matchVideos = m.tba.videos
                .filter(v => v.type === 'youtube') // I'm guessing with this, you'll likely have to log it to see
                .map(v => v.key);
        } else {
            matchVideos = [];
        }
    };

    $: pullVideos(match);
</script>

{#each matchVideos as video (video)}
    <div class="card p-0">
        <div class="card-header">
            <h5 class="card-title">Match Video {match?.number}</h5>
        </div>
        <div class="card-body">
            <iframe
                class="w-100"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                frameborder="0"
                referrerpolicy="strict-origin-when-cross-origin"
                src="https://www.youtube.com/embed/{video}"
                title="YouTube video player"
            />
        </div>
    </div>
{/each}

<style>
iframe {
    aspect-ratio: 16 / 9;
}
</style>
