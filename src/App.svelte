<script>
  import StoryPage from './lib/pages/StoryPage.svelte'
  import WhoIsDa from './lib/pages/WhoIsDa.svelte'

  // Tiny hash router — no dependency. The only non-story route today is the
  // "Who is Dá?" page (#/who-is-da); everything else falls back to the story.
  // Hash routing is deliberate: it sidesteps the GitHub Pages subpath and any
  // 404-on-deep-link concerns, since the hash never reaches the static server.
  function parseRoute() {
    const hash = window.location.hash.replace(/^#\/?/, '').replace(/\/$/, '')
    return hash === 'who-is-da' ? 'who-is-da' : 'story'
  }

  let route = $state(parseRoute())

  $effect(() => {
    const onHashChange = () => {
      route = parseRoute()
      // A page swap should start at the top, like a real navigation.
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  })
</script>

{#if route === 'who-is-da'}
  <WhoIsDa />
{:else}
  <StoryPage />
{/if}
