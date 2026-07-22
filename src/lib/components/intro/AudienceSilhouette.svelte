<script>
  // Sketchy crowd silhouette: a shoulder band with a row of head bumps.
  // Placeholder art, swappable for hand-drawn SVG later.
  const heads = Array.from({ length: 22 }, (_, i) => ({
    cx: (i + 0.5) * (100 / 22),
    r: 2.6 + ((i * 7) % 5) * 0.35,
    dy: (i % 3) * 0.9,
  }))
</script>

<svg class="audience" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true">
  <rect x="0" y="8" width="100" height="6" fill="var(--audience-ink)" />
  {#each heads as h}
    <circle cx={h.cx} cy={9 + h.dy} r={h.r} fill="var(--audience-ink)" />
  {/each}
</svg>

<style>
  .audience {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 14%;
    z-index: var(--z-stage-front);
  }
</style>
