<script lang="ts">
export let text: string = '';
</script>

<div class="card">
    <div class="card-body">
        <div class="d-flex justify-content-between">
            <button class="btn btn-danger">
                <i class="material-icons">close</i>
            </button>
        </div>
        <div class="container">
            <div class="row mb-3">
                <label for="text">Option Text</label>
                <input
                    type="text"
                    class="form-control"
                    id="text"
                    bind:value="{text}"
                />
            </div>
        </div>
    </div>
</div>
