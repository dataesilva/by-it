<script>
  import { line, curveNatural } from 'd3-shape'
  import { activeEventIndex } from '../stores.js'

  // anchors includes a lead-in point at the start and a lead-out at the end;
  // nodes (one per event) are the points between them.
  let { anchors = [], width = 0, height = 0 } = $props()

  const nodes = $derived(anchors.slice(1, -1))

  const d = $derived(
    anchors.length > 1
      ? line()
          .x((p) => p.x)
          .y((p) => p.y)
          .curve(curveNatural)(anchors)
      : ''
  )
</script>

{#if d && width > 0}
  <svg class="spine" {width} {height} viewBox="0 0 {width} {height}" aria-hidden="true">
    <path {d} />
    {#each nodes as node, i}
      <circle
        cx={node.x}
        cy={node.y}
        r={$activeEventIndex === i ? 10 : 7}
        class:active={$activeEventIndex === i}
      />
    {/each}
  </svg>
{/if}

<style>
  .spine {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    pointer-events: none;
    overflow: visible;
  }

  path {
    fill: none;
    stroke: var(--color-accent);
    stroke-width: 3;
    stroke-linecap: round;
    opacity: 0.55;
  }

  circle {
    fill: var(--color-bg);
    stroke: var(--color-accent);
    stroke-width: 3;
    transition: r 0.25s ease, fill 0.25s ease;
  }

  circle.active {
    fill: var(--color-accent);
  }
</style>
