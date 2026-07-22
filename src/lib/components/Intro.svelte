<script>
  import { site, character } from '../data.js'
  import Stage from './intro/Stage.svelte'
  import NavBar from './NavBar.svelte'
</script>

<section class="intro">
  <NavBar />

  <div class="intro-stage-pin">
    <h1>{site.title}</h1>
    <p class="tagline">{site.tagline}</p>
    <p class="intro-text">{site.intro}</p>

    <div class="guide-slot">
      <Stage pose="stage" text={character.intro} />
    </div>

    <div class="scroll-hint" aria-hidden="true">scroll ↓</div>
  </div>
</section>

<style>
  .intro {
    position: relative;
    height: var(--intro-runway);
  }

  .intro-stage-pin {
    --intro-pad-x: 1.5rem;
    position: sticky;
    top: 0;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: calc(var(--nav-height) + 2rem) var(--intro-pad-x) 4rem;
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
    max-width: 42rem;
    font-size: 1.05rem;
  }

  .guide-slot {
    align-self: stretch;
    width: calc(100% + 2 * var(--intro-pad-x));
    margin-top: 2.5rem;
    margin-inline: calc(-1 * var(--intro-pad-x));
  }

  .scroll-hint {
    margin-top: 3rem;
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
