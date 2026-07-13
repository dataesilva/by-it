<script>
  let { item } = $props()
</script>

<div class="frame" style:aspect-ratio={item.aspectRatio ?? '16 / 9'}>
  <iframe
    src={item.src}
    title={item.caption ?? 'Embedded content'}
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>

<style>
  .frame {
    width: 100%;
    border-radius: 6px;
    overflow: hidden;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
</style>
