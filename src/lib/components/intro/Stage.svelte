<script>
  import { onMount } from 'svelte'
  import CharacterGuide from '../character/CharacterGuide.svelte'
  import AudienceSilhouette from './AudienceSilhouette.svelte'

  let { pose = 'stage', text = '' } = $props()

  let stageEl

  const REDUCED_MOTION =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

  onMount(() => {
    // Default CSS state is open (--curtain: 0), so a JS/motion opt-out just
    // leaves the curtains parted and skips the scroll handler entirely.
    if (REDUCED_MOTION) return

    // Part the curtains open once, on load: start closed, then transition to
    // open on the next frame. Scroll progress at the top of the page is also
    // ~0, so there's no fight with the scroll-driven close below.
    stageEl.classList.add('opening')
    stageEl.style.setProperty('--curtain', 1)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        stageEl.style.setProperty('--curtain', 0)
      })
    })

    const section = stageEl.closest('.intro')
    let ticking = false
    let raf

    function update() {
      ticking = false
      // Drop the load transition once real scrubbing starts so tracking is immediate.
      stageEl.classList.remove('opening')

      const rect = section.getBoundingClientRect()
      const runway = rect.height - window.innerHeight
      const p = runway > 0 ? clamp(-rect.top / runway, 0, 1) : 0
      // Hold-then-sweep: character stands a beat before the curtains close.
      const curtain = clamp((p - 0.25) / (0.85 - 0.25), 0, 1)
      stageEl.style.setProperty('--curtain', curtain)
    }

    function onScroll() {
      if (ticking) return
      ticking = true
      raf = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  })
</script>

<div class="stage" bind:this={stageEl}>
  <div class="stage-backdrop"></div>
  <div class="stage-floor"></div>

  <div class="stage-character">
    <CharacterGuide {pose} {text} />
  </div>

  <div class="curtain">
    <div class="valance"></div>
    <div class="panel panel-left"></div>
    <div class="panel panel-right"></div>
  </div>

  <AudienceSilhouette />
</div>

<style>
  .stage {
    --curtain: 0; /* 0 = open, 1 = closed — default open so JS/CSS failure never strands it shut */
    position: relative;
    isolation: isolate; /* own stacking context for the --z-stage-* layers */
    /* Height-driven, not width-driven: keeps the stage (+ copy above it)
       fitting inside the pinned 100dvh viewport regardless of how much
       title/tagline/intro text sits above it. */
    height: clamp(220px, 42dvh, 480px);
    width: 100%;
    overflow: hidden;
  }

  .stage-backdrop,
  .stage-floor {
    position: absolute;
    left: 0;
    right: 0;
  }

  .stage-backdrop {
    top: 0;
    bottom: 0;
    background: var(--stage-bg);
    z-index: var(--z-stage-back);
  }

  .stage-floor {
    bottom: 0;
    height: 30%;
    background: var(--stage-floor);
    z-index: var(--z-stage-floor);
  }

  .stage-character {
    position: absolute;
    left: 50%;
    bottom: 6%;
    transform: translateX(-50%);
    z-index: var(--z-stage-character);
    --guide-size: clamp(120px, 18dvh, 220px);
  }

  .curtain {
    position: absolute;
    inset: 0;
    z-index: var(--z-stage-curtain);
    overflow: hidden;
    pointer-events: none; /* never block the character's click-for-more */
  }

  .valance {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 12%;
    background: var(--stage-curtain-dark);
  }

  .panel {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 56%;
    background: linear-gradient(
      90deg,
      var(--stage-curtain-dark),
      var(--stage-curtain) 45%,
      var(--stage-curtain-dark)
    );
  }

  .panel-left {
    left: 0;
    transform: translateX(calc((var(--curtain) - 1) * var(--curtain-travel)));
  }

  .panel-right {
    right: 0;
    transform: translateX(calc((1 - var(--curtain)) * var(--curtain-travel)));
  }

  /* .opening is toggled imperatively via classList in onMount, not from the
     template, so it needs :global() to avoid Svelte's unused-selector check. */
  .stage:global(.opening) .panel {
    transition: transform var(--curtain-open-dur) ease;
  }
</style>
