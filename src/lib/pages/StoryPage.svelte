<script>
  import Intro from '../components/Intro.svelte'
  import MapPanel from '../components/MapPanel.svelte'
  import Timeline from '../components/Timeline.svelte'
  import NavScrubber from '../components/NavScrubber.svelte'
  import Conclusion from '../components/Conclusion.svelte'
  import Footer from '../components/Footer.svelte'
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
