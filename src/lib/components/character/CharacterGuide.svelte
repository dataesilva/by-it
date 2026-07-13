<script>
  import { fly } from 'svelte/transition'
  import { character, asset } from '../../data.js'
  import SpeechBubble from './SpeechBubble.svelte'

  let { pose = 'default', text = '', extra = [], side = 'right' } = $props()

  // Clicking the character reveals extra lines one at a time.
  let revealed = $state(0)
  const lines = $derived([text, ...extra.slice(0, revealed)])
  const hasMore = $derived(revealed < extra.length)

  function interact() {
    if (hasMore) revealed += 1
  }
</script>

<figure class="guide {side}" in:fly={{ y: 24, duration: 400 }}>
  <button
    class="guide-art"
    onclick={interact}
    title={hasMore ? `${character.name} has more to say — click` : character.name}
    aria-label={hasMore ? `${character.name} has more to say` : character.name}
  >
    <img src={asset(character.poses[pose] ?? character.poses.default)} alt="" />
    {#if hasMore}
      <span class="more-dot" aria-hidden="true"></span>
    {/if}
  </button>
  <SpeechBubble {lines} {side} />
</figure>

<style>
  .guide {
    display: flex;
    align-items: flex-end;
    gap: 0.75rem;
    margin: 0;
  }

  /* When the guide stands left of its bubble-target, flip the layout. */
  .guide.left {
    flex-direction: row-reverse;
  }

  .guide-art {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .guide-art:hover {
    transform: scale(1.05);
  }

  .guide-art img {
    width: var(--guide-size);
    height: auto;
  }

  .more-dot {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--color-accent);
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.35); opacity: 0.6; }
  }
</style>
