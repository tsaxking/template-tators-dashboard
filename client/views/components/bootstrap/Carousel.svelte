<script lang="ts">
import { Random } from '../../../../shared/math';
const id = 'carousel-' + Random.uuid();

type P = {
    name?: string;
    description?: string;
    url: string;
};

export let items: P[] = [];
</script>

<div {id} class="carousel slide">
    <div class="carousel-indicators">
        {#each items as _item, i}
            <button
                data-bs-target="#{id}"
                data-bs-slide-to={i}
                class="{i === 0 ? 'active' : ''}"
            ></button>
        {/each}
    </div>
    <div class="carousel-inner">
        {#each items as item, i}
            <div class="carousel-item {i === 0 ? 'active' : ''}">
                <img src={item.url} alt={item.name} class="w-100 d-block"/>
                {#if item.name}
                    <div class="carousel-caption d-none d-md-block">
                        <h5>{item.name}</h5>
                        {#if item.description}
                            <p>{item.description}</p>
                        {/if}
                    </div>
                {/if}
            </div>
        {/each}
    </div>
    <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#{id}"
        data-bs-slide="prev"
    >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#{id}"
        data-bs-slide="next"
    >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
    </button>
</div>
