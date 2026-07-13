<script>
  import ImageBlock from './ImageBlock.svelte'
  import VideoBlock from './VideoBlock.svelte'
  import EmbedBlock from './EmbedBlock.svelte'
  import TextBlock from './TextBlock.svelte'
  import CanvasBlock from './CanvasBlock.svelte'

  // To support a new media type: create a component next to these and add it
  // here. The key is the `type:` value used in event YAML files.
  const registry = {
    image: ImageBlock,
    video: VideoBlock,
    embed: EmbedBlock,
    text: TextBlock,
    canvas: CanvasBlock,
  }

  let { item } = $props()
  const Block = $derived(registry[item.type])
</script>

{#if Block}
  <figure class="media media-{item.type}">
    <Block {item} />
    {#if item.caption}
      <figcaption>{item.caption}</figcaption>
    {/if}
  </figure>
{:else}
  <p class="media-unknown">
    Unknown media type "{item.type}" — register it in src/lib/media/MediaBlock.svelte
  </p>
{/if}

<style>
  .media {
    margin: 0.75rem 0;
  }

  figcaption {
    font-size: 0.8rem;
    color: var(--color-muted);
    margin-top: 0.35rem;
  }

  .media-unknown {
    padding: 0.75rem;
    border: 1px dashed var(--color-accent);
    border-radius: 6px;
    font-size: 0.85rem;
    color: var(--color-accent);
  }
</style>
