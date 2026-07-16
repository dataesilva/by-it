<script>
  import { site, character } from '../data.js'
  import CharacterGuide from './character/CharacterGuide.svelte'
  import NavBar from './NavBar.svelte'
</script>

<section class="intro">
  <NavBar />

  <h1>{site.title}</h1>
  <p class="tagline">{site.tagline}</p>
  <p class="intro-text">{site.intro}</p>

  <div class="guide-slot">
    <CharacterGuide pose="default" text={character.intro} />
  </div>

  <div class="scroll-hint" aria-hidden="true">scroll ↓</div>
</section>

<style>
  .intro {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem 1.5rem 4rem;
  }

  h1 {
    font-size: clamp(2.5rem, 7vw, 4.5rem);
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
    margin-top: 2.5rem;
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
</style>
