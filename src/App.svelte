<script>
  import Intro from './lib/components/Intro.svelte'
  import MapPanel from './lib/components/MapPanel.svelte'
  import Timeline from './lib/components/Timeline.svelte'
  import NavScrubber from './lib/components/NavScrubber.svelte'
  import Conclusion from './lib/components/Conclusion.svelte'
  import Footer from './lib/components/Footer.svelte'
</script>

<Intro />

<div class="story">
  <MapPanel />
  <Timeline />
</div>

<Conclusion />

<NavScrubber />

<Footer />

<style>
  .story {
    position: relative;
  }
</style>
