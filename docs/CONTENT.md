# Content Authoring Guide

Everything the reader sees comes from files in `content/` and `public/media/`.
You never need to touch `src/` to add or edit events, media, or dialogue.

## Adding a timeline event

1. Copy any file in `content/events/` (e.g. `020-a-turning-point.yaml`).
2. Rename it with an unused number prefix — files sort by name, and the number
   controls timeline order. Numbering by tens (`010-`, `020-`, ...) leaves
   room to insert events later (`015-` slots between `010-` and `020-`).
3. Edit the fields. Save. The dev server hot-reloads; the event appears in the
   timeline, on the map, and in the scrubber automatically.

### Event fields

```yaml
id: my-event              # unique slug (used internally)
date: 1848-03-15          # ISO date, machine-readable
dateLabel: "Spring 1848"  # what's displayed — any text
title: "Event Title"
location:                 # optional — omit for events with no place
  { lat: 41.88, lng: -87.63, zoom: 10, label: "Chicago" }
side: auto                # left | right | auto (auto alternates)
media:                    # optional — list of media items, shown in order
  - type: image
    src: media/photo.png  # path under public/, or a full https:// URL
    caption: "Shown under the media"
    alt: "For screen readers (images)"
body: >                   # optional prose paragraph
  The main text of the event.
links:                    # optional external links
  - { label: "Further reading", url: "https://example.org" }
narration:                # optional — the guide appears at this event
  pose: pointing          # a key from character.yaml poses
  text: "First thing the guide says."
  extra:                  # optional — revealed one per click on the guide
    - "A second line."
    - "A third line."
```

### Media types

| type   | fields | notes |
|--------|--------|-------|
| image  | `src`, `caption`, `alt` | png/jpg/svg/webp under `public/` or a URL |
| video  | `src`, `caption`, `poster` | native `<video>` player |
| embed  | `src`, `caption`, `aspectRatio` | any iframe URL (YouTube, archive viewers, maps); default aspect 16/9 |
| text   | `text`, `caption` | styled pull-quote / excerpt |
| canvas | `caption` | runs `src/lib/media/CanvasBlock.svelte` — the hook for custom interactive pieces |

**Adding a new media type:** create a component in `src/lib/media/` (copy
`ImageBlock.svelte` as a starting point) and register it in the `registry`
map at the top of `src/lib/media/MediaBlock.svelte`. The registry key becomes
the `type:` value events can use.

## The guide character

`content/character.yaml` defines the character:

```yaml
name: Guide
poses:                    # pose key → art file under public/
  default: media/character/default.svg
  pointing: media/character/pointing.svg
intro: "Spoken in the intro section."
```

- **Swapping in real art:** replace the SVG files in `public/media/character/`
  (or point the pose entries at new PNGs). Nothing else changes.
- **Adding a pose:** drop the art file in, add one line under `poses:`, then
  reference it from any event's `narration.pose`.
- **Dialogue:** each event's `narration.text` is spoken when that event scrolls
  into view; `narration.extra` lines reveal one at a time when the reader
  clicks the character (a pulsing dot signals there's more).

## Site-wide text and the map's starting view

Edit `content/site.yaml` — title, tagline, intro paragraph, and the map's
initial lat/lng/zoom before any event is active.

## Look and feel

Colors, fonts, card width, map height, and character size are CSS custom
properties at the top of `src/styles/global.css`. Change them there first;
component-specific styles live inside each `.svelte` file.

## References

- [Scrollama](https://github.com/russellsamora/scrollama) — the scroll engine
- [How to implement scrollytelling](https://pudding.cool/process/how-to-implement-scrollytelling/) — The Pudding's method article
- [Leaflet docs](https://leafletjs.com/reference.html) — map, markers, flyTo
- [TimelineJS](https://github.com/NUKnightLab/TimelineJS3) and
  [StoryMapJS](https://github.com/NUKnightLab/StoryMapJS) — open-source
  timeline/map storytelling projects worth borrowing UX ideas from
- [The Pudding](https://pudding.cool) — production scrollytelling examples
