<script>
  import { fade } from 'svelte/transition'

  let { lines = [], side = 'right' } = $props()
</script>

{#if lines.length}
  <div class="bubble {side}">
    {#each lines as lineText}
      <p transition:fade={{ duration: 200 }}>{lineText}</p>
    {/each}
  </div>
{/if}

<style>
  .bubble {
    position: relative;
    width: var(--guide-bubble-width);
    background: var(--color-bubble);
    border: 1px solid var(--color-bubble-border);
    border-radius: 12px;
    padding: 0.6rem 0.9rem;
    font-size: 0.88rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  /* Tail pointing back at the character. */
  .bubble::after {
    content: '';
    position: absolute;
    bottom: 14px;
    border: 8px solid transparent;
  }

  .bubble.right::after {
    left: -15px;
    border-right-color: var(--color-bubble-border);
  }

  .bubble.left::after {
    right: -15px;
    border-left-color: var(--color-bubble-border);
  }

  p {
    margin: 0;
  }

  p + p {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px dashed var(--color-bubble-border);
  }
</style>
