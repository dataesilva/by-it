<script>
  // Design 3 — "Dance in Motion": playful, animation-forward. Dá is the hero,
  // dancing large and fast; the bio is revealed in stacked cards down the page.
  // Accent colors nod to Cape Verde / Brazil / Portugal over the site theme.
  import { da } from '../../data.js'
  import { renderInline } from '../../inline.js'
  import { reveal } from '../../actions/reveal.js'
  import DancingDa from '../character/DancingDa.svelte'
</script>

<section class="motion">
  <div class="hero">
    <div class="glow" aria-hidden="true"></div>
    <div class="hero-dancer">
      <DancingDa size="clamp(180px, 32vw, 320px)" interval={200} />
    </div>
    <h1>{da.heading}</h1>
    {#if da.quote}
      <p class="tagline">“{da.quote.replace(/^["“]|["”.]$/g, '')}”</p>
    {/if}
    <span class="scroll-hint" aria-hidden="true">scroll ↓</span>
  </div>

  <div class="cards">
    {#each da.paragraphs as p, idx}
      <div class="card reveal reveal-center" use:reveal style="--i: {idx}">
        <span class="card-num" aria-hidden="true">{String(idx + 1).padStart(2, '0')}</span>
        <p>{@html renderInline(p)}</p>
      </div>
    {/each}

    <a class="pill" href={da.cta.href}>{da.cta.text}</a>
  </div>
</section>

<style>
  .motion {
    --brasil: #009739;
    --amarelo: #FEDD00;
    --cabo: #0d3b91;
    background: var(--color-bg);
    color: var(--color-ink);
    min-height: 100dvh;
    padding-bottom: 5rem;
  }

  /* --- Hero --------------------------------------------------------------- */
  .hero {
    position: relative;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: calc(var(--nav-height) + 2rem) 1.5rem 2rem;
    overflow: hidden;
  }

  .glow {
    position: absolute;
    top: 46%;
    left: 50%;
    width: min(80vw, 640px);
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
    background: conic-gradient(
      from 0deg,
      color-mix(in srgb, var(--amarelo) 55%, transparent),
      color-mix(in srgb, var(--brasil) 55%, transparent),
      color-mix(in srgb, var(--cabo) 55%, transparent),
      color-mix(in srgb, var(--color-accent-soft) 55%, transparent),
      color-mix(in srgb, var(--amarelo) 55%, transparent)
    );
    filter: blur(60px);
    opacity: 0.5;
    border-radius: 50%;
    pointer-events: none;
    animation: spin 18s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .glow { animation: none; }
  }

  @keyframes spin {
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }

  .hero-dancer {
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 18px 30px color-mix(in srgb, black 45%, transparent));
  }

  h1 {
    position: relative;
    z-index: 1;
    font-family: var(--font-display);
    font-size: clamp(3rem, 12vw, 7rem);
    letter-spacing: 0.03em;
    margin: 0.5rem 0 0.75rem;
    color: var(--color-ink);
  }

  .tagline {
    position: relative;
    z-index: 1;
    font-family: var(--font-display);
    letter-spacing: 0.05em;
    color: var(--color-ink);
    font-size: clamp(1.1rem, 3vw, 1.7rem);
    max-width: 30rem;
    margin: 0;
  }

  .scroll-hint {
    margin-top: 2.5rem;
    text-transform: uppercase;
    letter-spacing: 0.25em;
    font-size: 0.75rem;
    color: color-mix(in srgb, var(--color-ink) 60%, transparent);
    animation: bob 2s ease-in-out infinite;
  }

  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(8px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .scroll-hint { animation: none; }
  }

  /* --- Story cards -------------------------------------------------------- */
  .cards {
    max-width: var(--w-wide);
    margin: 0 auto;
    padding: 0 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  .card {
    position: relative;
    background: var(--color-card);
    border: 1px solid color-mix(in srgb, var(--color-accent-soft) 40%, transparent);
    border-radius: 12px;
    padding: 2rem 2rem 2rem 3.5rem;
    backdrop-filter: blur(2px);
    font-size: 1.08rem;
    line-height: 1.7;
  }

  .card p {
    margin: 0;
  }

  .card :global(a) {
    color: var(--color-ink);
  }

  .card-num {
    position: absolute;
    top: 1.2rem;
    left: 1.2rem;
    font-family: var(--font-display);
    font-size: 1.4rem;
    color: var(--color-accent-soft);
  }

  .pill {
    align-self: center;
    margin-top: 1rem;
    padding: 1rem 2rem;
    border-radius: 999px;
    background: var(--color-accent-soft);
    color: var(--color-ink);
    font-family: var(--font-body);
    font-weight: 700;
    text-align: center;
    text-decoration: none;
    box-shadow: 0 8px 24px color-mix(in srgb, var(--color-accent-soft) 45%, transparent);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .pill:hover,
  .pill:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px color-mix(in srgb, var(--color-accent-soft) 60%, transparent);
  }

  @media (max-width: 768px) {
    .card {
      padding: 1.5rem 1.25rem 1.5rem 3rem;
    }
  }
</style>
