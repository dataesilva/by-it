<script>
  // Design 1 — "On Stage": theatrical treatment that ties back to the intro's
  // stage metaphor. Dá dances center-stage under a spotlight; the bio reads like
  // a theatre program.
  import { da } from '../../data.js'
  import { renderInline } from '../../inline.js'
  import DancingDa from '../character/DancingDa.svelte'
</script>

<section class="stage-design">
  <div class="deck">
    <div class="spotlight" aria-hidden="true"></div>
    <DancingDa size="clamp(140px, 22vw, 240px)" />
    <div class="footlights" aria-hidden="true"></div>
  </div>

  <div class="playbill">
    <p class="eyebrow">The Program</p>
    <h1>{da.heading}</h1>

    {#if da.quote}
      <p class="marquee">“{da.quote.replace(/^["“]|["”.]$/g, '')}”</p>
    {/if}

    <div class="prose">
      {#each da.paragraphs as p}
        <p>{@html renderInline(p)}</p>
      {/each}
    </div>

    <a class="ticket" href={da.cta.href}>
      <span class="ticket-stub" aria-hidden="true">▸</span>
      {da.cta.text}
    </a>
  </div>
</section>

<style>
  .stage-design {
    --deck-bg: var(--stage-bg, #2a0403);
    background: var(--deck-bg);
    color: var(--color-bg);
    padding: calc(var(--nav-height) + 3rem) 1.5rem 5rem;
    min-height: 100dvh;
  }

  /* --- Stage deck --------------------------------------------------------- */
  .deck {
    position: relative;
    max-width: var(--w-full);
    margin: 0 auto 3.5rem;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 3rem 0 2.5rem;
    border-radius: 8px;
    background:
      radial-gradient(120% 90% at 50% 0%,
        color-mix(in srgb, var(--stage-glow, #7a1a10) 55%, transparent) 0%,
        transparent 60%),
      var(--stage-floor, #3a0605);
    overflow: hidden;
  }

  .spotlight {
    position: absolute;
    top: -10%;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 130%;
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--spot-color, #fff4d6) 45%, transparent),
      transparent 70%
    );
    clip-path: polygon(42% 0, 58% 0, 100% 100%, 0 100%);
    pointer-events: none;
  }

  .footlights {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 6px;
    background: var(--footlight, var(--color-accent-soft));
    box-shadow: 0 0 24px 6px color-mix(in srgb, var(--footlight, #FFA200) 70%, transparent);
  }

  /* --- Program text ------------------------------------------------------- */
  .playbill {
    max-width: var(--w-wide);
    margin: 0 auto;
    text-align: center;
  }

  .eyebrow {
    font-family: var(--font-body);
    text-transform: uppercase;
    letter-spacing: 0.35em;
    font-size: 0.75rem;
    color: var(--color-accent-soft);
    margin: 0 0 0.25rem;
  }

  h1 {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 7vw, 4.5rem);
    letter-spacing: 0.04em;
    margin: 0 0 1rem;
    color: var(--color-bg);
  }

  .marquee {
    font-family: var(--font-display);
    letter-spacing: 0.04em;
    font-size: clamp(1.25rem, 3vw, 1.9rem);
    color: var(--color-accent-soft);
    border-top: 1px solid color-mix(in srgb, var(--color-accent-soft) 45%, transparent);
    border-bottom: 1px solid color-mix(in srgb, var(--color-accent-soft) 45%, transparent);
    padding: 0.9rem 0;
    margin: 0 0 2rem;
  }

  .prose {
    text-align: left;
    color: color-mix(in srgb, var(--color-bg) 88%, var(--color-accent-soft));
    font-size: 1.05rem;
  }

  .prose p {
    margin: 0 0 1.25rem;
  }

  .prose :global(a) {
    color: var(--color-accent-soft);
  }

  .ticket {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 1.5rem;
    padding: 0.9rem 1.4rem;
    background: var(--color-accent-soft);
    color: var(--color-ink);
    font-family: var(--font-body);
    font-weight: 700;
    text-decoration: none;
    border-radius: 4px;
    box-shadow: 0 6px 20px color-mix(in srgb, var(--color-accent-soft) 40%, transparent);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .ticket:hover,
  .ticket:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 10px 26px color-mix(in srgb, var(--color-accent-soft) 55%, transparent);
  }

  .ticket-stub {
    font-size: 1.1em;
  }

  @media (max-width: 768px) {
    .stage-design {
      padding: calc(var(--nav-height) + 1.5rem) 1.25rem 3.5rem;
    }
  }
</style>
