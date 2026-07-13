<script>
  import { asset } from '../data.js'

  let { item } = $props()
</script>

<img src={asset(item.src)} alt={item.alt ?? item.caption ?? ''} loading="lazy" />

<style>
  img {
    width: 100%;
    border-radius: 6px;
  }
</style>
