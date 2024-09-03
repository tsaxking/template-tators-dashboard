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

<div
  {id}
  class="carousel slide">
  <div class="carousel-indicators">
    {#each items as _item, i}
      <button
        class:active="{i === 0}"
        data-bs-slide-to="{i}"
        data-bs-target="#{id}"
      />
    {/each}
  </div>
  <div class="carousel-inner">
    {#each items as item, i}
      <div
        class="carousel-item"
        class:active="{i === 0}">
        <img
          class="w-100 d-block"
          alt="{item.name}"
          src="{item.url}" />
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
    data-bs-slide="prev"
    data-bs-target="#{id}"
    type="button"
  >
    <span
      class="carousel-control-prev-icon"
      aria-hidden="true" />
    <span class="visually-hidden">Previous</span>
  </button>
  <button
    class="carousel-control-next"
    data-bs-slide="next"
    data-bs-target="#{id}"
    type="button"
  >
    <span
      class="carousel-control-next-icon"
      aria-hidden="true" />
    <span class="visually-hidden">Next</span>
  </button>
</div>
