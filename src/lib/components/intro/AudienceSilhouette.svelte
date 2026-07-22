<script>
  // Sketchy crowd silhouette: three staggered depth layers of small head +
  // shoulder busts with seeded organic jitter, so it reads as a real house of
  // distinct people. Every figure's shoulders meet the bottom edge (BASE) and
  // all geometry sits in the bottom few viewBox units, so the wide-and-short
  // band's `slice` crop keeps each figure intact instead of chopping off the
  // heads and merging the shoulders into one blob. Placeholder art, swappable
  // for hand-drawn SVG later.
  const BASE = 20 // ground line = viewBox height; shoulders anchor here

  // Deterministic pseudo-random so the crowd is stable between renders.
  const rand = (seed) => {
    const x = Math.sin(seed * 12.9898) * 43758.5453
    return x - Math.floor(x)
  }

  // One person = a head circle + a bell-shaped shoulder path rising from BASE.
  const bust = (cx, cy, r) => {
    const sw = r * 1.7 // half shoulder width
    const sy = cy + r * 0.55 // shoulder top, just under the head
    return `M ${cx - sw} ${BASE}
      C ${cx - sw} ${cy + r * 0.4} ${cx - r} ${sy} ${cx} ${sy - r * 0.05}
      C ${cx + r} ${sy} ${cx + sw} ${cy + r * 0.4} ${cx + sw} ${BASE} Z`
  }

  // Scatter `count` busts across the full width. Heads sit near `cy` (head
  // center) with jittered position and radius so the row never reads as a
  // metronome. Bases are shared (BASE), so the ground line stays solid and the
  // front layer cleanly occludes the ones behind it.
  const makeRow = ({ count, r, cy, spread, rise, seed }) =>
    Array.from({ length: count }, (_, i) => {
      const cx = ((i + 0.5) / count) * 100 + (rand(i + seed) - 0.5) * spread
      const rr = r * (0.8 + rand(i + seed + 0.5) * 0.4)
      const cc = cy + (rand(i + seed + 0.9) - 0.5) * rise
      return { cx, cy: cc, r: rr }
    })

  // Depth: back = smaller, higher, lighter → front = larger, lower, darker.
  // Drawn back → front so the front row occludes the ones behind it.
  const back = makeRow({ count: 26, r: 0.72, cy: 16.3, spread: 1.4, rise: 0.7, seed: 7.1 })
  const mid = makeRow({ count: 22, r: 0.86, cy: 16.9, spread: 1.6, rise: 0.8, seed: 3.7 })
  const front = makeRow({ count: 18, r: 1.02, cy: 17.5, spread: 1.9, rise: 0.9, seed: 11.3 })
</script>

<svg class="audience" viewBox="0 0 100 20" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
  <g fill="var(--audience-back)">
    {#each back as p}
      <path d={bust(p.cx, p.cy, p.r)} />
      <circle cx={p.cx} cy={p.cy} r={p.r} />
    {/each}
  </g>
  <g fill="color-mix(in srgb, var(--audience-ink) 55%, var(--audience-back))">
    {#each mid as p}
      <path d={bust(p.cx, p.cy, p.r)} />
      <circle cx={p.cx} cy={p.cy} r={p.r} />
    {/each}
  </g>
  <g fill="var(--audience-ink)">
    {#each front as p}
      <path d={bust(p.cx, p.cy, p.r)} />
      <circle cx={p.cx} cy={p.cy} r={p.r} />
    {/each}
  </g>
</svg>

<style>
  .audience {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 18%;
    z-index: var(--z-stage-front);
    /* Melt the tops of the back rows up into the footlight glow. Screen-space
       (not a viewBox-coordinate mask) so it stays aligned with the visible
       band no matter how `slice` crops the tall viewBox. */
    -webkit-mask-image: linear-gradient(to top, #000 55%, transparent);
    mask-image: linear-gradient(to top, #000 55%, transparent);
  }
</style>
