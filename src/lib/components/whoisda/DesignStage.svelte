<script>
  // "Who is Dá?" page: theatrical treatment that ties back to the intro's stage
  // metaphor. Dá dances center-stage under a spotlight above an editorial-style bio.
  import { da } from '../../data.js'
  import { renderInline } from '../../inline.js'
  import { reveal } from '../../actions/reveal.js'
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
    <p class="lede">A griot who tells the story of African culture in Portugal through dance.</p>

    <div class="prose">
      {#each da.paragraphs as p, idx}
        {#if idx === 1 && da.quote}
          <blockquote use:reveal class="reveal reveal-center pull">
            {da.quote}
          </blockquote>
        {/if}
        <p use:reveal class="reveal reveal-center">{@html renderInline(p)}</p>
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
    background: var(--color-bg);
    color: var(--color-ink);
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
        color-mix(in srgb, var(--color-accent-soft) 35%, transparent) 0%,
        transparent 60%),
      var(--color-card);
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
      color-mix(in srgb, var(--color-accent-soft) 35%, transparent),
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
    color: var(--color-ink);
  }

  .lede {
    font-size: clamp(1.1rem, 2.4vw, 1.4rem);
    color: var(--color-muted);
    max-width: 34rem;
    margin: 0 auto 2rem;
  }

  .prose {
    text-align: left;
    color: var(--color-ink);
    font-size: 1.05rem;
    line-height: 1.75;
  }

  .prose p {
    margin: 0 0 1.25rem;
  }

  .prose :global(a) {
    color: var(--color-accent);
  }

  .pull {
    margin: 2rem 0 2.5rem;
    padding: 0.25rem 0 0.25rem 1.5rem;
    border-left: 4px solid var(--color-accent-soft);
    font-family: var(--font-display);
    font-size: clamp(1.6rem, 4vw, 2.4rem);
    line-height: 1.15;
    letter-spacing: 0.02em;
    color: var(--color-ink);
    text-align: left;
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
