<script>
  import { onMount } from 'svelte'
  import CharacterGuide from '../character/CharacterGuide.svelte'
  import AudienceSilhouette from './AudienceSilhouette.svelte'

  let { pose = 'stage', text = '' } = $props()

  // Curtain look: 'luxury' (velvet + gold) or 'street' (matte muslin, no gold).
  // One-line swap — change 'luxury' to 'street'.
  const STAGE_STYLE = 'street'

  let stageEl

  const REDUCED_MOTION =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

  onMount(() => {
    const section = stageEl.closest('.intro')
    const pin = stageEl.closest('.intro-stage-pin')
    // Default CSS state is open (--curtain: 0), so if the stage is ever reused
    // outside the pinned intro we just leave the drapes parted rather than
    // throwing on every scroll event.
    if (!section || !pin) return

    let ticking = false
    let raf
    // Set while the load glide is in flight, so scroll updates don't fight it.
    let opening = false

    // Scroll progress through the intro, 0..1. Measures both boxes rather than
    // assuming a viewport unit: the pin is sticky, so the section height minus
    // the pin height IS the scroll runway. Using window.innerHeight here
    // instead made the runway drift whenever a mobile toolbar resized the
    // viewport mid-scroll.
    function progress() {
      const rect = section.getBoundingClientRect()
      const runway = rect.height - pin.offsetHeight
      return runway > 0 ? clamp(-rect.top / runway, 0, 1) : 0
    }

    function update() {
      ticking = false
      const p = progress()

      // Only drop the load transition once real scrubbing has started —
      // removing it on the very first scroll event snapped --curtain out of
      // its mid-glide value, which trackpad users (who flick immediately) hit
      // far more often than wheel users.
      if (opening) {
        if (p <= 0.02) return
        opening = false
        stageEl.classList.remove('opening')
      }

      // Hold-then-sweep: character stands a beat, then the curtains close.
      // Smoothstep the window so heavy fabric eases in and settles instead of
      // tracking scroll at a constant, mechanical rate.
      const t = clamp((p - 0.25) / (0.85 - 0.25), 0, 1)
      const curtain = t * t * (3 - 2 * t)
      stageEl.style.setProperty('--curtain', curtain)
    }

    function onScroll() {
      if (ticking) return
      ticking = true
      raf = requestAnimationFrame(update)
    }

    // Part the curtains open once, on load: start closed, then transition to
    // open on the next frame. The transition is on --curtain itself (registered
    // via @property), so the panels AND the coupled lighting (spotlight, seam)
    // animate together — the lights come up as the drapes part.
    // Only worth playing if we actually loaded at the top; on a reload with a
    // restored scroll position the curtain should already be closed, and the
    // glide would stomp that value on its second frame.
    // Motion opt-out skips the glide but still scrubs on scroll: that's
    // position tracking, not self-running animation.
    if (!REDUCED_MOTION && progress() <= 0.02) {
      opening = true
      stageEl.classList.add('opening')
      stageEl.style.setProperty('--curtain', 1)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (opening) stageEl.style.setProperty('--curtain', 0)
        })
      })
    } else {
      // Sync immediately so a restored scroll position renders correctly on the
      // first frame instead of waiting for the reader to scroll.
      update()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // Without these the curtain holds a stale value after a resize or rotation
    // until the reader happens to scroll again.
    window.addEventListener('resize', onScroll)
    window.addEventListener('orientationchange', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('orientationchange', onScroll)
      cancelAnimationFrame(raf)
    }
  })
</script>

<div class="stage" class:street={STAGE_STYLE === 'street'} bind:this={stageEl}>
  <div class="stage-backdrop"></div>
  <div class="stage-floor"></div>

  <!-- Lighting, back → front on the floor plane (all below the character) -->
  <div class="spotlight" aria-hidden="true"></div>
  <div class="footlights" aria-hidden="true"></div>
  <div class="spotlight-pool" aria-hidden="true"></div>
  <div class="character-shadow" aria-hidden="true"></div>

  <div class="stage-character">
    <div class="stage-character-inner">
      <CharacterGuide {pose} {text} />
    </div>
  </div>

  <div class="curtain">
    <div class="panel panel-left"></div>
    <div class="panel panel-right"></div>
    <div class="seam" aria-hidden="true"></div>
    <div class="valance"></div>
  </div>

  <AudienceSilhouette />
</div>

<style>
  .stage {
    --curtain: 0; /* 0 = open, 1 = closed — default open so JS/CSS failure never strands it shut */
    --curtain-overlap-trim: 3%; /* per-side pull-back at full close; trims the final overlap only */
    position: relative;
    isolation: isolate; /* own stacking context for the --z-stage-* layers */
    /* Height-driven, not width-driven: keeps the stage (+ copy above it)
       fitting inside the pinned 100dvh viewport regardless of how much
       title/tagline/intro text sits above it. */
    /* svh, not dvh: a dvh-sized element visibly resizes as a mobile toolbar
       shows/hides. svh holds still. */
    height: clamp(220px, 42svh, 480px);
    width: 100%;
    overflow: hidden;
  }

  /* Vignette — frames the lit scene and adds depth. Sits above the character
     (center stays transparent so the face is untouched) but below the curtains,
     so the drapes read vivid when they close over it. */
  .stage::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(120% 100% at 50% 42%, transparent 52%, rgba(0, 0, 0, 0.5));
    z-index: var(--z-stage-character);
    pointer-events: none;
  }

  .stage-backdrop,
  .stage-floor {
    position: absolute;
    left: 0;
    right: 0;
  }

  /* Lit cyclorama: a soft warm pool behind the character rather than a flat fill. */
  .stage-backdrop {
    top: 0;
    bottom: 0;
    background:
      radial-gradient(120% 90% at 50% 20%, var(--stage-glow), transparent 55%),
      var(--stage-bg);
    z-index: var(--z-stage-back);
  }

  /* Polished deck: warm/lit at the front lip (footlights), receding upstage. */
  .stage-floor {
    bottom: 0;
    height: 30%;
    background: linear-gradient(180deg, var(--stage-floor) 0%, var(--stage-floor-hi) 100%);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    z-index: var(--z-stage-floor);
  }

  /* Spotlight beam behind the character; dims to nothing as the curtains close. */
  .spotlight {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, var(--spot-color), transparent 78%);
    clip-path: polygon(43% 0, 57% 0, 82% 100%, 18% 100%);
    filter: blur(10px);
    mix-blend-mode: screen;
    opacity: calc(var(--spot-strength) * (1 - var(--curtain)));
    z-index: var(--z-stage-floor);
    pointer-events: none;
  }

  /* Warm wash rising from the front lip of the stage. */
  .footlights {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 18%;
    background: radial-gradient(120% 150% at 50% 100%, var(--footlight), transparent 62%);
    mix-blend-mode: screen;
    opacity: 0.4;
    z-index: var(--z-stage-floor);
    pointer-events: none;
  }

  /* Pool of light where the character stands. */
  .spotlight-pool {
    position: absolute;
    left: 50%;
    bottom: 3%;
    transform: translateX(-50%);
    width: clamp(200px, 40svh, 460px);
    height: clamp(48px, 12svh, 130px);
    background: radial-gradient(ellipse at 50% 50%, var(--spot-color), transparent 68%);
    filter: blur(6px);
    mix-blend-mode: screen;
    opacity: calc(var(--spot-strength) * (1 - var(--curtain)));
    z-index: var(--z-stage-floor);
    pointer-events: none;
  }

  /* Cast shadow — grounds the figure. Kept separate from the character so it
     stays put while the character breathes. */
  .character-shadow {
    position: absolute;
    left: 50%;
    bottom: 5%;
    transform: translateX(-50%);
    width: clamp(150px, 24svh, 280px);
    height: clamp(20px, 5svh, 46px);
    background: radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.5), transparent 70%);
    filter: blur(5px);
    z-index: var(--z-stage-floor);
    pointer-events: none;
  }

  .stage-character {
    position: absolute;
    left: 50%;
    bottom: 20%;
    transform: translateX(-50%);
    z-index: var(--z-stage-character);
    --guide-size: clamp(120px, 18svh, 220px);
  }

  /* Inner wrapper carries the idle motion so the outer keeps its centering
     transform (translateX(-50%)) intact. */
  .stage-character-inner {
    transform-origin: bottom center;
  }

  @media (prefers-reduced-motion: no-preference) {
    .stage-character-inner {
      animation: breathe var(--character-breathe-dur) ease-in-out infinite;
    }
  }

  @keyframes breathe {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-2%) scale(1.008); }
  }

  .curtain {
    position: absolute;
    inset: 0;
    z-index: var(--z-stage-curtain);
    overflow: hidden;
    pointer-events: none; /* never block the character's click-for-more */
  }

  /* Velvet drape: soft vertical pleats + a top-lit sheen over the body gradient. */
  .panel {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 56%;
    background:
      repeating-linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.34) 0,
        rgba(255, 255, 255, 0.06) calc(var(--stage-fold-w) * 0.5),
        rgba(0, 0, 0, 0.34) var(--stage-fold-w)
      ),
      linear-gradient(180deg, rgba(255, 255, 255, 0.1), transparent 42%),
      linear-gradient(
        90deg,
        var(--stage-curtain-dark),
        var(--stage-curtain) 42%,
        var(--stage-curtain-hi) 50%,
        var(--stage-curtain) 58%,
        var(--stage-curtain-dark)
      );
    box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.35);
  }

  /* Gold braided trim on each panel's inner (leading) edge. */
  .panel::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 9px;
    background: repeating-linear-gradient(
      180deg,
      var(--curtain-trim) 0,
      color-mix(in srgb, var(--curtain-trim) 55%, black) 5px,
      var(--curtain-trim) 10px
    );
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.45);
  }

  .panel-left {
    left: 0;
    transform: translateX(calc((var(--curtain) - 1) * var(--curtain-travel)
        - var(--curtain) * var(--curtain-overlap-trim)))
      skewX(calc(var(--curtain) * 0.6deg));
  }
  .panel-left::after { right: 0; }

  .panel-right {
    right: 0;
    transform: translateX(calc((1 - var(--curtain)) * var(--curtain-travel)
        + var(--curtain) * var(--curtain-overlap-trim)))
      skewX(calc(var(--curtain) * -0.6deg));
  }
  .panel-right::after { left: 0; }

  /* Shadowed meeting line — only appears as the panels close. */
  .seam {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 3%;
    transform: translateX(-50%);
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.55) 50%, transparent);
    opacity: var(--curtain);
  }

  /* Draped pelmet: velvet folds, a scalloped hem (mask), gold-trimmed at the bottom. */
  .valance {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 15%;
    background:
      repeating-linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.34) 0,
        rgba(255, 255, 255, 0.06) calc(var(--stage-fold-w) * 0.5),
        rgba(0, 0, 0, 0.34) var(--stage-fold-w)
      ),
      linear-gradient(
        180deg,
        var(--stage-curtain) 0%,
        var(--stage-curtain-dark) 80%,
        var(--curtain-trim) 80%,
        var(--curtain-trim) 100%
      );
    /* Solid top band + a row of downward swags cut into the bottom edge. */
    -webkit-mask:
      radial-gradient(circle at 50% 0%, #000 70%, transparent 72%) 50% 100% / 9% 62% repeat-x,
      linear-gradient(#000 0 0) 0 0 / 100% 44% no-repeat;
    mask:
      radial-gradient(circle at 50% 0%, #000 70%, transparent 72%) 50% 100% / 9% 62% repeat-x,
      linear-gradient(#000 0 0) 0 0 / 100% 44% no-repeat;
  }

  /* -------------------------------------------------------------------------
     Street variant (STAGE_STYLE === 'street'): swaps the velvet+gold drape for
     matte off-white muslin with a minimal hemmed top. Colors come from the
     `.stage.street` token block in global.css; these rules restyle the fabric
     and hardware shape. Lighting/character/crowd/scroll are untouched.
  ------------------------------------------------------------------------- */

  /* Matte muslin: flat fill, soft low-contrast pleats, gentle top light — no sheen. */
  .stage.street .panel {
    background:
      repeating-linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.1) 0,
        rgba(255, 255, 255, 0.05) calc(var(--stage-fold-w) * 0.5),
        rgba(0, 0, 0, 0.1) var(--stage-fold-w)
      ),
      linear-gradient(180deg, rgba(255, 255, 255, 0.14), transparent 40%),
      var(--stage-curtain);
    box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.18);
  }

  /* No gold braid on the leading edge (minimal hem). */
  .stage.street .panel::after {
    display: none;
  }

  /* Valance becomes a slim flat hemmed top band: no scallops, no gold. */
  .stage.street .valance {
    height: 9%;
    background: linear-gradient(180deg, var(--stage-curtain), var(--stage-curtain-dark));
    -webkit-mask: none;
    mask: none;
    box-shadow: inset 0 -2px 3px rgba(0, 0, 0, 0.18); /* subtle hem line */
  }

  /* Soften the meeting-line shadow so it reads on light fabric. */
  .stage.street .seam {
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.35) 50%, transparent);
  }

  /* .opening is toggled imperatively via classList in onMount, not from the
     template, so it needs :global() to avoid Svelte's unused-selector check.
     Transitioning the registered --curtain drives every coupled layer at once. */
  .stage:global(.opening) {
    transition: --curtain var(--curtain-open-dur) ease;
  }
</style>
