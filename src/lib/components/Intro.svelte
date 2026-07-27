<script>
  import { site, character } from '../data.js'
  import { renderInline } from '../inline.js'
  import Stage from './intro/Stage.svelte'
  import NavBar from './NavBar.svelte'
</script>

<section class="intro">
  <NavBar />

  <div class="intro-stage-pin">
    <h1>{@html renderInline(site.title)}</h1>
    <p class="tagline">{site.tagline}</p>
    <p class="intro-text">{@html renderInline(site.intro)}</p>

    <div class="guide-slot">
      <Stage pose="stage" text={character.intro} />
    </div>

    <div class="scroll-hint" aria-hidden="true">scroll ↓</div>
  </div>
</section>

<style>
  .intro {
    position: relative;
    /* One pinned viewport plus the scrub distance. Because the sticky child is
       exactly 100svh, the leftover scroll runway === --intro-scrub, which is
       what Stage.svelte measures to drive the curtain. */
    height: calc(100svh + var(--intro-scrub));
  }

  .intro-stage-pin {
    --intro-pad-x: 1.5rem;
    position: sticky;
    top: 0;
    height: 100svh;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* NOT justify-content: center — on short viewports a centered flex column
       overflows BOTH edges, sliding the h1 up under the nav bar. Auto margins
       center it when there's free space and collapse to 0 when there isn't. */
    justify-content: flex-start;
    text-align: center;
    padding: calc(var(--nav-height) + 2rem) var(--intro-pad-x) 4rem;
    overflow: hidden;
  }

  .intro-stage-pin > :first-child {
    margin-top: auto;
  }

  .intro-stage-pin > :last-child {
    margin-bottom: auto;
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

  .intro-text {
    color : var(--color-muted);
    max-width: 42rem;
    font-size: 1.05rem;
  }

  /* Inline links authored via [label](url) in site.title / site.intro. */
  .intro-stage-pin :global(a) {
    color: var(--color-accent);
    text-decoration: underline;
  }

  .guide-slot {
    align-self: stretch;
    width: calc(100% + 2 * var(--intro-pad-x));
    /* Viewport-relative so the column can compress on short screens instead of
       overflowing the pin. */
    margin-top: clamp(1rem, 2.5svh, 2.5rem);
    margin-inline: calc(-1 * var(--intro-pad-x));
  }

  .scroll-hint {
    margin-top: clamp(0.75rem, 3svh, 3rem);
    color: var(--color-muted);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-size: 0.8rem;
    animation: bob 2s ease-in-out infinite;
  }

  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(8px); }
  }

  @media (max-width: 768px) {
    .intro-stage-pin {
      --intro-pad-x: 1.25rem;
      padding: calc(var(--nav-height) + 1.25rem) var(--intro-pad-x) 3rem;
    }
  }
</style>
