<script>
  let { item } = $props()
</script>

<blockquote>{item.text}</blockquote>

<style>
  blockquote {
    margin: 0;
    padding: 0.5rem 1rem;
    border-left: 3px solid var(--color-accent);
    background: var(--color-bubble);
    border-radius: 0 6px 6px 0;
    font-family: var(--font-display);
    font-style: italic;
    font-size: 0.95rem;
  }
</style>
