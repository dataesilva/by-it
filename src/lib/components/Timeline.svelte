<script>
  import { onMount } from 'svelte'
  import scrollama from 'scrollama'
  import { events } from '../data.js'
  import { activeEventIndex } from '../stores.js'
  import TimelinePath from './TimelinePath.svelte'
  import EventCard from './EventCard.svelte'

  // Cards alternate sides unless an event pins itself with `side: left|right`.
  const sides = events.map((e, i) =>
    e.side === 'left' || e.side === 'right' ? e.side : i % 2 === 0 ? 'left' : 'right'
  )

  let container = $state(null)
  let stepEls = []
  let anchors = $state([])
  let size = $state({ width: 0, height: 0 })

  // The spine anchors to a point beside each card (the inner edge, toward
  // the page center), so the curve weaves between left and right cards.
  function measure() {
    if (!container) return
    const crect = container.getBoundingClientRect()
    size = { width: container.clientWidth, height: container.scrollHeight }
    const points = stepEls.filter(Boolean).map((el, i) => {
      const r = el.querySelector('.card').getBoundingClientRect()
      const inset = 36
      return {
        x: sides[i] === 'left' ? r.right - crect.left + inset : r.left - crect.left - inset,
        y: r.top - crect.top + r.height / 2,
      }
    })
    // Lead the line in from the top center and out at the bottom center.
    anchors = points.length
      ? [{ x: size.width / 2, y: 0 }, ...points, { x: size.width / 2, y: size.height }]
      : []
  }

  onMount(() => {
    const scroller = scrollama()
    scroller
      .setup({ step: '.event-step', offset: 0.55 })
      .onStepEnter(({ index }) => activeEventIndex.set(index))

    // Re-measure whenever the container changes size (media loading,
    // viewport resize) so the spine stays glued to the cards.
    const ro = new ResizeObserver(() => {
      measure()
      scroller.resize()
    })
    ro.observe(container)
    measure()

    return () => {
      ro.disconnect()
      scroller.destroy()
    }
  })
</script>

<div class="timeline" bind:this={container}>
  <TimelinePath {anchors} width={size.width} height={size.height} />

  {#each events as event, i (event.id)}
    <div class="event-step {sides[i]}" id="event-{i}" bind:this={stepEls[i]}>
      <EventCard {event} side={sides[i]} active={$activeEventIndex === i} />
    </div>
  {/each}
</div>

<style>
  .timeline {
    position: relative;
    max-width: 1100px;
    margin: 0 auto;
    padding: var(--event-gap) 1.5rem;
  }

  .event-step {
    position: relative;
    display: flex;
    margin-bottom: var(--event-gap);
    z-index: 1;
  }

  .event-step:last-child {
    margin-bottom: 0;
  }

  .event-step.left {
    justify-content: flex-start;
  }

  .event-step.right {
    justify-content: flex-end;
  }

  @media (max-width: 768px) {
    .event-step.left,
    .event-step.right {
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
</style>
