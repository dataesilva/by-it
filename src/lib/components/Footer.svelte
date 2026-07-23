<script>
  import { site } from '../data.js'
</script>

<footer class="footer-bar" aria-label="Footer">
  <ul>
    {#each site.footer as link}
      <li><a href={link.href}>{link.label}</a></li>
    {/each}
  </ul>
</footer>

<style>
  .footer-bar {
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
    .footer-bar {
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
