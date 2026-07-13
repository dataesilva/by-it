<script>
  import Intro from './lib/components/Intro.svelte'
  import MapPanel from './lib/components/MapPanel.svelte'
  import Timeline from './lib/components/Timeline.svelte'
  import NavScrubber from './lib/components/NavScrubber.svelte'
</script>

<Intro />

<div class="story">
  <MapPanel />
  <Timeline />
</div>

<NavScrubber />

<style>
  .story {
    position: relative;
  }
</style>
