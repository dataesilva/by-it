<script>
  // Text fragment. `variant: quote` renders a pull-quote (the historical
  // default); `variant: prose` (the default) renders a plain floating paragraph.
  let { item } = $props()
  const variant = $derived(item.variant ?? 'prose')
</script>

{#if variant === 'quote'}
  <blockquote>{item.text}</blockquote>
{:else}
  <p class="prose">{item.text}</p>
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
</style>
