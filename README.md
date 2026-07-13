# Batoto Yetu Interactive — Interactive Timeline

A scroll-driven, interactive historical/narrative timeline website. The reader
scrolls through a flowing timeline of events while a persistent map flies to
each event's location and a guide character narrates the journey.

**Everything currently in the site is placeholder content** — see
[docs/CONTENT.md](docs/CONTENT.md) for how to replace it with the real story.

## Running locally

Requires Node.js 18+ (developed on Node 24).

```bash
npm install
npm run dev       # dev server with hot reload → http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

## How it's organized

- `content/` — **all authored content**: one YAML file per timeline event, plus
  `site.yaml` (title/intro/map defaults) and `character.yaml` (the guide).
  Adding an event = adding a file; no code changes needed.
- `public/media/` — images, video, icons, and character art referenced from
  content files by relative path.
- `src/lib/components/` — the page: intro, sticky map panel (Leaflet), the
  serpentine timeline, event cards, the responsive nav scrubber, and the
  guide character.
- `src/lib/media/` — the media block system. `MediaBlock.svelte` dispatches on
  each media item's `type:` (image, video, embed, text, canvas); new types are
  one component plus one registry line.
- `src/styles/global.css` — design tokens (colors, fonts, sizes) as CSS custom
  properties; iterate on look and feel here.

## How it works

Scrollama watches each event card; when one crosses the middle of the
viewport it becomes the *active event* (a Svelte store). The map, the nav
scrubber, the timeline spine, and the character all react to that one store —
scroll position is the single source of truth.

## Deployment

The site builds to a fully static `dist/` folder and can be hosted anywhere.
A GitHub Pages workflow is included at `.github/workflows/deploy.yml`; it
activates once the repo is on GitHub with Pages set to "GitHub Actions". For
a custom domain later, drop the `BASE_PATH` env var in the workflow.

## Built with / references

- [Svelte](https://svelte.dev) + [Vite](https://vite.dev)
- [Scrollama](https://github.com/russellsamora/scrollama) — scroll-driven steps
  ([how scrollytelling works](https://pudding.cool/process/how-to-implement-scrollytelling/))
- [Leaflet](https://leafletjs.com) + [OpenStreetMap](https://www.openstreetmap.org)
- [d3-shape](https://github.com/d3/d3-shape) — the flowing timeline curve
- Design inspiration: [TimelineJS](https://github.com/NUKnightLab/TimelineJS3),
  [StoryMapJS](https://github.com/NUKnightLab/StoryMapJS),
  [The Pudding](https://pudding.cool)
