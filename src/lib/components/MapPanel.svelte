<script>
  import { onMount } from 'svelte'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import { events, site } from '../data.js'
  import { activeEventIndex } from '../stores.js'

  let mapEl
  let mapPanelEl

  onMount(() => {
    const map = L.map(mapEl, { zoomControl: false, scrollWheelZoom: false })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    const start = site.map ?? {}
    map.setView([start.lat ?? 20, start.lng ?? 0], start.zoom ?? 2)

    // One marker per located event. circleMarkers avoid Leaflet's default
    // icon-image bundling quirks and are easy to restyle.
    const markers = events.map((e) =>
      e.location
        ? L.circleMarker([e.location.lat, e.location.lng], {
            radius: 6,
            weight: 2,
            color: '#b3542d',
            fillColor: '#e9c9b8',
            fillOpacity: 0.6,
            opacity: 0.5,
          })
            .addTo(map)
            .bindTooltip(e.location.label ?? e.title)
        : null
    )

    // The map is a pure follower of the active event — the only public
    // contract is this subscription, so the implementation stays swappable.
    const unsubscribe = activeEventIndex.subscribe((i) => {
      markers.forEach((m, j) => {
        if (!m) return
        const isActive = j === i
        m.setStyle({
          radius: isActive ? 9 : 6,
          opacity: isActive ? 1 : 0.5,
          fillOpacity: isActive ? 0.9 : 0.6,
          fillColor: isActive ? '#b3542d' : '#e9c9b8',
        })
      })
      const loc = events[i]?.location
      if (loc) map.flyTo([loc.lat, loc.lng], loc.zoom ?? 8, { duration: 1.4 })
    })

    // Leaflet's wheel-zoom would otherwise hijack the scroll while the sticky
    // panel is still sliding up to the top. Only allow it once the panel has
    // docked (its top has reached the viewport top); disable it again if the
    // reader scrolls back up into the intro.
    const syncWheelZoom = () => {
      const docked = mapPanelEl.getBoundingClientRect().top <= 0
      if (docked) map.scrollWheelZoom.enable()
      else map.scrollWheelZoom.disable()
    }
    window.addEventListener('scroll', syncWheelZoom, { passive: true })
    syncWheelZoom()

    return () => {
      window.removeEventListener('scroll', syncWheelZoom)
      unsubscribe()
      map.remove()
    }
  })
</script>

<div class="map-panel" bind:this={mapPanelEl}>
  <div class="map" bind:this={mapEl}></div>
</div>

<style>
  .map-panel {
    position: sticky;
    top: 0;
    height: var(--map-height);
    z-index: 20;
    border-bottom: 3px solid var(--color-accent);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .map {
    height: 100%;
  }
</style>
