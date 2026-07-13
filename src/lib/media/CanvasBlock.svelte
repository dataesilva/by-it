<script>
  import { onMount } from 'svelte'

  // Placeholder canvas: an animated sine wave. Replace the draw loop with
  // real visualizations, or add named variants dispatched off item.variant.
  let { item } = $props()
  let canvas

  onMount(() => {
    const ctx = canvas.getContext('2d')
    let t = 0
    let raf

    function draw() {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)
      ctx.beginPath()
      for (let x = 0; x <= width; x += 4) {
        const y = height / 2 + Math.sin(x / 40 + t) * (height / 4)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = '#b3542d'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.stroke()
      t += 0.03
      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  })
</script>

<canvas bind:this={canvas} width="640" height="200"></canvas>

<style>
  canvas {
    width: 100%;
    border-radius: 6px;
    background: var(--color-bubble);
    border: 1px solid var(--color-bubble-border);
  }
</style>
