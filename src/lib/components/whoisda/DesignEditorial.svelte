<script>
  // Design 2 — "Editorial Profile": a clean magazine-style bio on the site's
  // cream background. Large portrait beside a bold headline, readable single
  // column with scroll reveals, a gold pull-quote, and a small dancing accent.
  import { da, character, asset } from '../../data.js'
  import { renderInline } from '../../inline.js'
  import { reveal } from '../../actions/reveal.js'
  import DancingDa from '../character/DancingDa.svelte'
</script>

<section class="editorial">
  <header class="masthead">
    <div class="portrait">
      <img src={asset(character.poses.twirl)} alt="Dá mid-twirl" />
    </div>
    <div class="title-block">
      <p class="kicker">Meet the narrator</p>
      <h1>{da.heading}</h1>
      <p class="lede">A griot who tells the story of African culture in Portugal through dance.</p>
    </div>
  </header>

  <article class="body">
    {#each da.paragraphs as p, idx}
      {#if idx === 1 && da.quote}
        <blockquote use:reveal class="reveal reveal-center pull">
          {da.quote}
        </blockquote>
      {/if}
      <p use:reveal class="reveal reveal-center">{@html renderInline(p)}</p>
    {/each}

    <div class="accent">
      <DancingDa size="clamp(96px, 14vw, 140px)" />
    </div>

    <a class="cta" href={da.cta.href}>{da.cta.text} →</a>
  </article>
</section>

<style>
  .editorial {
    background: var(--color-bg);
    color: var(--color-ink);
    padding: calc(var(--nav-height) + 3rem) 1.5rem 5rem;
    min-height: 100dvh;
  }

  /* --- Masthead ----------------------------------------------------------- */
  .masthead {
    max-width: var(--w-full);
    margin: 0 auto 3rem;
    display: grid;
    grid-template-columns: minmax(0, 320px) 1fr;
    gap: 2.5rem;
    align-items: center;
  }

  .portrait {
    background: var(--color-card);
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 12px 30px color-mix(in srgb, var(--color-ink) 12%, transparent);
    display: flex;
    justify-content: center;
  }

  .portrait img {
    width: 100%;
    max-width: 220px;
    height: auto;
  }

  .kicker {
    font-family: var(--font-body);
    text-transform: uppercase;
    letter-spacing: 0.3em;
    font-size: 0.75rem;
    color: var(--color-accent-soft);
    margin: 0 0 0.5rem;
  }

  h1 {
    font-family: var(--font-display);
    font-size: clamp(3rem, 9vw, 6rem);
    line-height: 0.95;
    letter-spacing: 0.02em;
    margin: 0 0 1rem;
  }

  .lede {
    font-size: clamp(1.1rem, 2.4vw, 1.4rem);
    color: var(--color-muted);
    max-width: 34rem;
    margin: 0;
  }

  /* --- Body --------------------------------------------------------------- */
  .body {
    max-width: var(--w-wide);
    margin: 0 auto;
    font-size: 1.12rem;
    line-height: 1.75;
  }

  .body p {
    margin: 0 0 1.6rem;
  }

  .body :global(a) {
    color: var(--color-accent);
    text-decoration: underline;
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
  }

  .accent {
    display: flex;
    justify-content: center;
    margin: 2.5rem 0 1rem;
  }

  .cta {
    display: block;
    text-align: center;
    margin-top: 1.5rem;
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .cta:hover,
  .cta:focus-visible {
    color: var(--color-accent-soft);
  }

  @media (max-width: 768px) {
    .editorial {
      padding: calc(var(--nav-height) + 1.5rem) 1.25rem 3.5rem;
    }

    .masthead {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      text-align: center;
    }

    .portrait {
      justify-self: center;
      max-width: 240px;
    }

    .lede {
      margin-inline: auto;
    }
  }
</style>
