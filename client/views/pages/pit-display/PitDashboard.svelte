<script lang="ts">
</script>

<div class="vh-display vw-100 container-fluid position-relative">
    <div class="row h-100">
        <div class="col-md-6 bg-danger">
            <div
                class="d-flex flex-column h-100 justify-content-between align-items-start p-3"
            >
                <div class="mb-3 bg-gray-light flex-fill p-3 rounded w-75">
                    <!-- Content 1 -->
                </div>
                <div class="mb-3 bg-gray-light flex-fill p-3 rounded w-75">
                    <!-- Content 2 -->
                </div>
                <div class="mb-3 bg-gray-light flex-fill p-3 rounded w-75">
                    <!-- Content 3 -->
                </div>
            </div>
        </div>
        <div class="col-md-6 bg-primary">
            <div
                class="d-flex flex-column h-100 justify-content-between align-items-end p-3"
            >
                <div class="mb-3 bg-gray-light flex-fill p-3 rounded w-75">
                    <!-- Content 1 -->
                </div>
                <div class="mb-3 bg-gray-light flex-fill p-3 rounded w-75">
                    <!-- Content 2 -->
                </div>
                <div class="mb-3 bg-gray-light flex-fill p-3 rounded w-75">
                    <!-- Content 3 -->
                </div>
            </div>
        </div>
    </div>
    <!-- Dark gray square overlay -->
    <div
        class="container h-25 w-25 bg-gray-light rounded position-absolute top-50 start-50 translate-middle z-3"
    >
        <div
            class="d-flex flex-column justify-content-center align-items-center h-100 my-2"
        >
            <h4 class="text-black">Next match is in __ minutes at</h4>
            <p class="display-1 text-black" style="font-size:900%">00:00</p>
        </div>
    </div>
</div>

<style>
.bg-gray-light {
    background-color: rgba(200, 200, 200, 0.7);
}

.vh-display {
    height: calc(100vh - 58px);
}
</style>
