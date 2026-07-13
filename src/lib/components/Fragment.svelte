<script>
  import { reveal } from '../actions/reveal.js'
  import MediaBlock from '../media/MediaBlock.svelte'
  import TextBlock from '../media/TextBlock.svelte'

  // One placed piece of an event: a text block, a links list, or any media
  // type. `place` is the already-resolved { side, width, offsetY } from
  // src/lib/layout.js — this component only turns it into CSS.
  let { fragment, place } = $props()

  const WIDTHS = {
    narrow: 'var(--w-narrow)',
    medium: 'var(--w-medium)',
    wide: 'var(--w-wide)',
    full: 'var(--w-full)',
  }
  const ALIGN = { left: 'flex-start', center: 'center', right: 'flex-end' }

  const maxWidth = $derived(WIDTHS[place.width] ?? '100%')
  const align = $derived(ALIGN[place.side] ?? 'flex-start')
  const side = $derived(place.side === 'right' || place.side === 'center' ? place.side : 'left')

  // Placement travels to global CSS as custom properties so the mobile media
  // query can flatten everything to a single centered column (inline values
  // would otherwise win over the stylesheet).
  const styleVars = $derived(
    `--frag-max:${maxWidth};--frag-align:${align};--frag-offset:${place.offsetY ?? 0}rem`
  )
</script>

<div class="frag reveal reveal-{side}" style={styleVars} use:reveal>
  {#if fragment.type === 'text'}
    <TextBlock item={fragment} />
  {:else if fragment.type === 'links'}
    <ul class="links">
      {#each fragment.items ?? [] as link}
        <li><a href={link.url} target="_blank" rel="noopener">{link.label} ↗</a></li>
      {/each}
    </ul>
  {:else}
    <MediaBlock item={fragment} />
  {/if}
</div>

<style>
  .links {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .links li {
    margin: 0.3rem 0;
  }

  .links a {
    font-weight: 600;
  }
</style>
