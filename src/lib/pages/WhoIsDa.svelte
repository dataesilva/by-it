<script>
  // "Who is Dá?" page. Ships all three design mockups behind a live toggle so
  // the reviewer can flip between them and pick one; the loser components then
  // get deleted and the winner promoted (see the plan's "After the user picks").
  import NavBar from '../components/NavBar.svelte'
  import DesignStage from '../components/whoisda/DesignStage.svelte'
  import DesignEditorial from '../components/whoisda/DesignEditorial.svelte'
  import DesignMotion from '../components/whoisda/DesignMotion.svelte'

  const designs = [
    { id: 1, label: 'On Stage', component: DesignStage },
    { id: 2, label: 'Editorial', component: DesignEditorial },
    { id: 3, label: 'In Motion', component: DesignMotion },
  ]

  let selected = $state(1)
  const Current = $derived(designs.find((d) => d.id === selected).component)
</script>

<NavBar />

<div class="design-switcher" role="tablist" aria-label="Design options">
  <span class="switcher-label">Design:</span>
  {#each designs as d}
    <button
      role="tab"
      aria-selected={selected === d.id}
      class:active={selected === d.id}
      onclick={() => { selected = d.id; window.scrollTo(0, 0) }}
    >
      {d.id}. {d.label}
    </button>
  {/each}
</div>

<Current />

<style>
  .design-switcher {
    position: fixed;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.75rem;
    background: var(--color-ink);
    border-radius: 999px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    max-width: calc(100vw - 2rem);
    flex-wrap: wrap;
    justify-content: center;
  }

  .switcher-label {
    color: var(--color-bg);
    font-family: var(--font-body);
    font-size: 0.8rem;
    letter-spacing: 0.05em;
    opacity: 0.75;
    padding-left: 0.25rem;
  }

  button {
    font-family: var(--font-body);
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--color-bg);
    background: transparent;
    border: 1px solid color-mix(in srgb, var(--color-bg) 35%, transparent);
    border-radius: 999px;
    padding: 0.35rem 0.85rem;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
  }

  button:hover {
    border-color: var(--color-accent-soft);
  }

  button.active {
    background: var(--color-accent-soft);
    color: var(--color-ink);
    border-color: var(--color-accent-soft);
  }

  @media (max-width: 768px) {
    .switcher-label {
      display: none;
    }

    button {
      font-size: 0.78rem;
      padding: 0.3rem 0.7rem;
    }
  }
</style>
