<script lang="ts">
export let robot: number;
export let match: string;
export let alignment: 'start' | 'end';
</script>

<div class="mb-3 bg-gray-light flex-fill p-3 rounded w-75 position-relative">
    <div class="d-flex flex-column justify-content-between align-items-center">
        <h4 class="text-black">Robot {robot}</h4>
    </div>
    <div
        class="d-flex flex-column justify-content-center align-items-{alignment} h-100"
    >
        <img
            src="https://placehold.co/180x180"
            alt=""
            class="img-fluid rounded h-100"
            style="object-fit: cover;"
        />
    </div>
</div>

<style>
.bg-gray-light {
    background-color: rgba(200, 200, 200, 0.7);
}
</style>
