<script>
  import { onMount } from 'svelte'
  import scrollama from 'scrollama'
  import { events } from '../data.js'
  import { activeEventIndex } from '../stores.js'
  import TimelinePath from './TimelinePath.svelte'
  import EventScene from './EventScene.svelte'

  // Cards alternate sides unless an event pins itself with `side: left|right`.
  const sides = events.map((e, i) =>
    e.side === 'left' || e.side === 'right' ? e.side : i % 2 === 0 ? 'left' : 'right'
  )

  let container = $state(null)
  let stepEls = $state([])
  let anchors = $state([])
  let size = $state({ width: 0, height: 0 })

  // Scenes span the full content width, so the spine can no longer hug a card
  // edge. Instead each anchor sits at the scene's vertical midpoint, pulled
  // horizontally toward the side the scene leans — left scenes ~30% across,
  // right scenes ~70% — so the curve still weaves back and forth.
  function measure() {
    if (!container) return
    const crect = container.getBoundingClientRect()
    size = { width: container.clientWidth, height: container.scrollHeight }
    const points = stepEls.filter(Boolean).map((el, i) => {
      const scene = el.querySelector('.scene') ?? el
      const r = scene.getBoundingClientRect()
      const bias = sides[i] === 'left' ? 0.3 : 0.7
      return {
        x: size.width * bias,
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

    // The ResizeObserver above only fires when the container's OWN box changes,
    // so a viewport height-only change (vertical window resize, rotation, a
    // mobile toolbar collapsing) never reaches scroller.resize() and the 0.55
    // trigger line silently drifts against the old innerHeight. Debounced
    // because resize fires in bursts and scroller.resize() re-registers every
    // step's observer.
    let resizeTimer
    const onViewportResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        measure()
        scroller.resize()
      }, 150)
    }
    window.addEventListener('resize', onViewportResize)
    window.addEventListener('orientationchange', onViewportResize)

    measure()

    return () => {
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onViewportResize)
      window.removeEventListener('orientationchange', onViewportResize)
      ro.disconnect()
      scroller.destroy()
    }
  })
</script>

<div class="timeline" bind:this={container}>
  <TimelinePath {anchors} width={size.width} height={size.height} />

  {#each events as event, i (event.id)}
    <div class="event-step {sides[i]}" id="event-{i}" bind:this={stepEls[i]}>
      <EventScene {event} side={sides[i]} active={$activeEventIndex === i} />
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

  /* Scenes fill the content width; the left/right lean is expressed by how the
     scene's own fragments align themselves, not by justifying the whole step. */
  .event-step {
    position: relative;
    margin-bottom: var(--event-gap);
    z-index: 1;
  }

  .event-step:last-child {
    margin-bottom: 0;
  }
</style>
