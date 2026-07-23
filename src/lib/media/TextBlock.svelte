<script>
  // Text fragment. `variant: quote` renders a pull-quote (the historical
  // default); `variant: prose` (the default) renders a plain floating paragraph.
  // Inline `[label](url)` Markdown becomes a real link — see src/lib/inline.js.
  import { renderInline } from '../inline.js'

  let { item } = $props()
  const variant = $derived(item.variant ?? 'prose')
  const html = $derived(renderInline(item.text))
</script>

{#if variant === 'quote'}
  <blockquote>{@html html}</blockquote>
{:else}
  <p class="prose">{@html html}</p>
{/if}

<style>
  blockquote {
    margin: 0;
    padding: 0.5rem 1.1rem;
    border-left: 3px solid var(--color-accent);
    background: var(--color-bubble);
    border-radius: 0 6px 6px 0;
    font-family: var(--font-display);
    font-style: italic;
    font-size: 1.05rem;
  }

  .prose {
    margin: 0;
    font-size: 1.05rem;
  }

  .prose :global(a),
  blockquote :global(a) {
    color: var(--color-accent);
    text-decoration: underline;
  }
</style>
