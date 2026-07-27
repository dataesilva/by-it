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
            color: '#50B715',
            fillColor: '#FFA200',
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
          fillColor: isActive ? '#50B715' : '#FFA200',
        })
      })
      const loc = events[i]?.location
      if (loc) map.flyTo([loc.lat, loc.lng], loc.zoom ?? 8, { duration: 1.4 })
    })

    // Leaflet's wheel-zoom would otherwise hijack the scroll while the sticky
    // panel is still sliding up to the top. Only allow it once the panel has
    // docked (its top has reached the viewport top); disable it again if the
    // reader scrolls back up into the intro.
    // An 8px dead zone around the dock line: without it, hovering exactly at
    // the boundary flips wheel-zoom on and off repeatedly, and while it is on
    // Leaflet swallows wheel events — which reads as the page refusing to
    // scroll, and behaves differently on a trackpad (many small deltas) than a
    // mouse wheel.
    let wheelZoomOn = null
    let ticking = false
    let raf

    const syncWheelZoom = () => {
      ticking = false
      const top = mapPanelEl.getBoundingClientRect().top
      const docked = wheelZoomOn ? top <= 8 : top <= -8
      if (docked === wheelZoomOn) return
      wheelZoomOn = docked
      if (docked) map.scrollWheelZoom.enable()
      else map.scrollWheelZoom.disable()
    }

    // rAF-throttled: this reads layout, and an unthrottled version ran it
    // several times per frame under high-frequency trackpad scrolling.
    const onScroll = () => {
      if (ticking) return
      ticking = true
      raf = requestAnimationFrame(syncWheelZoom)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    syncWheelZoom()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
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
