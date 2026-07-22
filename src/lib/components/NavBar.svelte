<script>
  import { site } from '../data.js'
</script>

<nav class="nav-bar" aria-label="Site">
  <ul>
    {#each site.nav as link}
      <li><a href={link.href}>{link.label}</a></li>
    {/each}
  </ul>
</nav>

<style>
  .nav-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    box-sizing: border-box;
    min-height: var(--nav-height);
    display: flex;
    align-items: center;
    padding: 1.5rem;
    background: var(--color-ink);
  }

  ul {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin: 0;
    padding: 0;
    width: 100%;
    list-style: none;
  }

  a {
    color: var(--color-bg);
    font-family: var(--font-display);
    font-size: 1.25rem;
    text-decoration: none;
    letter-spacing: 0.02em;
  }

  a:hover,
  a:focus-visible {
    color: var(--color-muted);
  }

  @media (max-width: 768px) {
    .nav-bar {
      padding: 1rem;
    }

    ul {
      gap: 1.25rem;
    }

    a {
      font-size: 0.85rem;
    }
  }
</style>
