<script>
  import MediaBlock from '../media/MediaBlock.svelte'
  import CharacterGuide from './character/CharacterGuide.svelte'

  let { event, side = 'left', active = false } = $props()

  // The guide stands on the opposite side of the card, next to the spine.
  const guideSide = $derived(side === 'left' ? 'right' : 'left')
</script>

<article class="card" class:active>
  <header>
    <time datetime={event.date}>{event.dateLabel ?? event.date}</time>
    <h2>{event.title}</h2>
    {#if event.location?.label}
      <p class="loc">{event.location.label}</p>
    {/if}
  </header>

  {#if event.media}
    {#each event.media as item}
      <MediaBlock {item} />
    {/each}
  {/if}

  {#if event.body}
    <p class="body">{event.body}</p>
  {/if}

  {#if event.links?.length}
    <ul class="links">
      {#each event.links as link}
        <li><a href={link.url} target="_blank" rel="noopener">{link.label} ↗</a></li>
      {/each}
    </ul>
  {/if}
</article>

{#if event.narration && active}
  {#key event.id}
    <div class="guide-anchor {guideSide}">
      <CharacterGuide
        pose={event.narration.pose}
        text={event.narration.text}
        extra={event.narration.extra ?? []}
        side={guideSide}
      />
    </div>
  {/key}
{/if}

<style>
  .card {
    width: var(--card-width);
    background: var(--color-card);
    border: 1px solid var(--color-accent-soft);
    border-radius: 10px;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }

  .card.active {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  time {
    color: var(--color-accent);
    font-weight: 600;
    font-size: 0.85rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0.25rem 0;
    font-size: 1.5rem;
  }

  .loc {
    margin: 0 0 0.75rem;
    color: var(--color-muted);
    font-size: 0.9rem;
  }

  .body {
    font-size: 0.98rem;
  }

  .links {
    list-style: none;
    padding: 0;
    margin: 0.75rem 0 0;
  }

  .links li {
    margin: 0.25rem 0;
  }

  /* The guide floats beside the card, near the spine. */
  .guide-anchor {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
  }

  .guide-anchor.right {
    left: calc(var(--card-width) + 4rem);
  }

  .guide-anchor.left {
    right: calc(var(--card-width) + 4rem);
  }

  @media (max-width: 768px) {
    /* On small screens the guide tucks under the card instead of beside it. */
    .guide-anchor,
    .guide-anchor.left,
    .guide-anchor.right {
      position: static;
      transform: none;
      margin-top: 0.75rem;
    }
  }
</style>
