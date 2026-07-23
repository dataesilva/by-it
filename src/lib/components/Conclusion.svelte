<script>
  import { site } from '../data.js'
  import { atConclusion } from '../stores.js'

  // Toggle the shared `atConclusion` flag while this section is on screen, so the
  // fixed scrubber can hide over the closing section. Rendered outside `.story`
  // and `.timeline` (and never carrying `.event-step`), so it doesn't affect the
  // sticky map, the SVG spine, or Scrollama's active-event tracking.
  function watch(el) {
    const observer = new IntersectionObserver(
      ([entry]) => atConclusion.set(entry.isIntersecting),
      { threshold: 0.15 },
    )
    observer.observe(el)
    return {
      destroy() {
        observer.disconnect()
        atConclusion.set(false)
      },
    }
  }
</script>

<section class="conclusion" use:watch>
  <h1>{site.conclusion.title}</h1>
  {#if site.conclusion.tagline}
    <p class="tagline">{site.conclusion.tagline}</p>
  {/if}
  <p class="conclusion-text">{site.conclusion.text}</p>
</section>

<style>
  .conclusion {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4rem 1.5rem;
  }

  h1 {
    font-size: clamp(2.5rem, 7vw, 4.5rem);
    letter-spacing: 0.03em;
    margin: 0;
  }

  .tagline {
    color: var(--color-muted);
    font-size: clamp(1rem, 2.5vw, 1.3rem);
    margin: 0.5rem 0 2rem;
  }

  .conclusion-text {
    max-width: 42rem;
    font-size: 1.05rem;
  }

  @media (max-width: 768px) {
    .conclusion {
      padding: 3rem 1.25rem;
    }
  }
</style>
