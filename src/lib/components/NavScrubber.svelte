<script>
  import { events } from '../data.js'
  import { activeEventIndex, atConclusion } from '../stores.js'

  function goTo(i) {
    document.getElementById(`event-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
</script>

<nav class="scrubber" class:hidden={$atConclusion} aria-label="Timeline navigation">
  {#each events as event, i (event.id)}
    <button
      class="dot"
      class:active={$activeEventIndex === i}
      onclick={() => goTo(i)}
      aria-label="Go to: {event.title}"
      aria-current={$activeEventIndex === i ? 'step' : undefined}
    >
      <span class="label">{event.dateLabel ?? event.date}</span>
    </button>
  {/each}
</nav>

<style>
  .scrubber {
    position: fixed;
    z-index: 1100; /* above Leaflet's panes */
    display: flex;
    gap: 0.6rem;
    padding: 0.6rem;
    background: color-mix(in srgb, var(--color-card) 85%, transparent);
    backdrop-filter: blur(4px);
    border: 1px solid var(--color-accent-soft);
    border-radius: 999px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    /* Desktop: vertical rail on the right edge. */
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    flex-direction: column;
    align-items: center;

    transition: opacity 0.3s ease;
  }

  /* Hidden once the reader reaches the conclusion section. */
  .scrubber.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .dot {
    position: relative;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid var(--color-accent);
    background: var(--color-bg);
    cursor: pointer;
    padding: 0;
    transition: transform 0.2s ease, background 0.2s ease;
  }

  .dot:hover {
    transform: scale(1.3);
  }

  .dot.active {
    background: var(--color-accent);
    transform: scale(1.4);
  }

  .label {
    position: absolute;
    right: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
    white-space: nowrap;
    font-size: 0.72rem;
    background: var(--color-ink);
    color: var(--color-bg);
    padding: 2px 8px;
    border-radius: 4px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }

  .dot:hover .label,
  .dot:focus-visible .label,
  .dot.active .label {
    opacity: 1;
  }

  /* Small screens: horizontal bar along the bottom. */
  @media (max-width: 768px) {
    .scrubber {
      flex-direction: row;
      top: auto;
      right: auto;
      bottom: 0.75rem;
      left: 50%;
      transform: translateX(-50%);
      max-width: 92vw;
      overflow-x: auto;
    }

    .label {
      right: auto;
      top: auto;
      bottom: calc(100% + 10px);
      left: 50%;
      transform: translateX(-50%);
    }

    /* On touch screens only the active label shows (no hover). */
    .dot:hover .label {
      opacity: 0;
    }

    .dot.active .label {
      opacity: 1;
    }
  }
</style>
