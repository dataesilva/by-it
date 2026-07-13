<script>
  import { asset } from '../data.js'

  let { item } = $props()
</script>

<!-- svelte-ignore a11y_media_has_caption -->
<video
  src={asset(item.src)}
  poster={item.poster ? asset(item.poster) : undefined}
  controls
  preload="metadata"
></video>

<style>
  video {
    width: 100%;
    border-radius: 6px;
    background: #000;
  }
</style>
