<script>
  import { character, asset } from '../../data.js'

  // Flip-book animator: cycles Dá's per-pose PNGs so she appears to dance.
  // Reuses the same pose registry (content/character.yaml) and base-URL-safe
  // asset() helper the guide character uses — no new asset plumbing.
  let {
    // Curated sequence of pose keys that reads as a happy dance loop. The
    // signature `twirl` recurs; the sad/fist poses are left out on purpose.
    frames = ['neutral', 'up', 'twirl', 'jump', 'down', 'wave', 'twirl'],
    interval = 280, // ms per frame
    size = 'var(--guide-size)',
    alt = `${character.name} dancing`,
  } = $props()

  // Respect reduced-motion: hold a single still frame instead of cycling.
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let i = $state(0)

  $effect(() => {
    if (reducedMotion || frames.length < 2) return
    const id = setInterval(() => {
      i = (i + 1) % frames.length
    }, interval)
    return () => clearInterval(id)
  })

  // Fall back to the hero pose (twirl) if a listed frame key is missing.
  const src = $derived(
    asset(character.poses[frames[i]] ?? character.poses.twirl ?? character.poses.default)
  )
</script>

<div class="dancer" style="--dancer-size: {size}">
  <div class="dancer-inner">
    <img {src} {alt} />
  </div>
</div>

<style>
  .dancer {
    display: inline-block;
    line-height: 0;
  }

  .dancer-inner {
    /* Inner wrapper carries the idle bob so it composes with any outer
       transform (e.g. centering) the design applies to .dancer. */
    display: inline-block;
  }

  .dancer img {
    width: var(--dancer-size);
    height: auto;
    /* Poses have varied silhouettes; keep vertical footprint stable so the
       character doesn't jump around as frames swap. */
  }

  @media (prefers-reduced-motion: no-preference) {
    .dancer-inner {
      animation: dancer-breathe var(--character-breathe-dur, 5s) ease-in-out infinite;
    }
  }

  @keyframes dancer-breathe {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-3%) scale(1.01); }
  }
</style>
