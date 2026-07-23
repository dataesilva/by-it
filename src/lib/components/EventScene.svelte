<script>
  import { reveal } from '../actions/reveal.js'
  import { resolvePlacements, resolveTitlePlacement } from '../layout.js'
  import { renderInline } from '../inline.js'
  import Fragment from './Fragment.svelte'
  import CharacterGuide from './character/CharacterGuide.svelte'

  let { event, side = 'left', active = false } = $props()

  // Resolve every fragment's placement once: layout preset + per-fragment
  // overrides → concrete { side, width, offsetY }. The heading is placed too.
  const placements = $derived(resolvePlacements(event.content ?? [], event.layout, side))
  const titlePlace = $derived(resolveTitlePlacement(event.titlePlace, side))

  const titleAlign = $derived(
    titlePlace.side === 'right' ? 'flex-end' : titlePlace.side === 'center' ? 'center' : 'flex-start'
  )
  const titleSide = $derived(
    titlePlace.side === 'right' || titlePlace.side === 'center' ? titlePlace.side : 'left'
  )

  // The guide stands on the opposite side of the scene, out by the spine.
  const guideSide = $derived(side === 'left' ? 'right' : 'left')
</script>

<div class="scene">
  <header
    class="heading reveal reveal-{titleSide}"
    style={`--frag-align:${titleAlign};--frag-max:var(--w-medium)`}
    use:reveal
  >
    <time datetime={event.date}>{event.dateLabel ?? event.date}</time>
    <h2>{@html renderInline(event.title)}</h2>
    {#if event.location?.label}
      <p class="loc">{event.location.label}</p>
    {/if}
  </header>

  {#each event.content ?? [] as fragment, i}
    <Fragment {fragment} place={placements[i]} />
  {/each}
</div>

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
  /* A borderless band: content sits directly on the page and the timeline
     spine weaves through it. Fragments align themselves left/right/center. */
  .scene {
    display: flex;
    flex-direction: column;
    gap: var(--fragment-gap);
    width: 100%;
  }

  .heading {
    /* Same custom-property contract as .frag so mobile flattening applies. */
    width: var(--frag-max, var(--w-medium));
    max-width: 100%;
    align-self: var(--frag-align, flex-start);
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
    font-size: clamp(1.6rem, 3.4vw, 2.4rem);
  }

  /* Inline links authored via [label](url) in an event title. Keep the
     heading's color; underline so it still reads as a link. */
  h2 :global(a) {
    color: inherit;
    text-decoration: underline;
  }

  .loc {
    margin: 0.25rem 0 0;
    color: var(--color-muted);
    font-size: 0.9rem;
  }

  /* The guide floats out past the content, near the spine. */
  .guide-anchor {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
  }

  .guide-anchor.right {
    left: 58%;
  }

  .guide-anchor.left {
    right: 58%;
  }

  @media (max-width: 768px) {
    .heading {
      align-self: center;
      width: 100%;
      max-width: 100%;
      text-align: center;
    }

    .guide-anchor,
    .guide-anchor.left,
    .guide-anchor.right {
      position: static;
      transform: none;
      margin-top: 0.75rem;
    }
  }
</style>
