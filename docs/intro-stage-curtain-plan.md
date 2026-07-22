# Intro Stage & Curtain Effect

## Context

The Intro section (`src/lib/components/Intro.svelte`) is currently a plain,
non-sticky `min-height:100vh` flow block: a title, tagline, intro text, and the
shared `CharacterGuide` figure that simply scrolls off the top. We want to turn
it into a **theatrical stage**: the guide character (a provided `.png` still)
stands on a stage, curtains frame/back the scene, and a sketch-style audience
sits in the foreground below the stage. The curtains **part open on page load**
to reveal the character, then **draw closed in front of the character** as the
intro scrolls out — a curtain-call before the timeline begins.

Confirmed decisions (from clarifying questions):
- **Curtain motion:** part open on load → close *in front of* the character on exit.
- **Pacing:** pin the stage for a short scroll runway so the close is deliberate and tied to scroll progress.
- **Artwork:** user provides the **character PNG**; curtains are built as themed CSS, the audience as an inline SVG sketch (both swappable later).
- **Character:** keeps its interactive speech bubble (reuse `CharacterGuide` with `character.intro`).

## Approach

Introduce a dedicated, intro-only **`Stage` component** and make the Intro
section taller with a **sticky inner stage** that pins while the curtains close.
The shared `CharacterGuide` is reused unchanged (it's also used by every
`EventScene`, so the stage/curtain markup must NOT go inside it). Everything is
progressive enhancement: with no JS or `prefers-reduced-motion`, curtains
default to **open** and the character is visible.

### Files

**New — `src/lib/components/intro/Stage.svelte`**
The theater. Owns the layered scene, the load-open animation, and the
scroll-progress-driven close. Layers, back → front (local stacking context):

1. **Backstage backdrop** — dark panel filling the stage (`--stage-bg`).
2. **Stage floor** — a lit floor band the character stands on (`--stage-floor`).
3. **Character** — `<CharacterGuide pose="stage" text={character.intro} />`, centered on the floor. Allowed to render larger than the timeline guide via a local `--guide-size` override on the stage.
4. **Curtains** — two panels (`.panel-left`, `.panel-right`) plus a top valance. Panels sit *above* the character so they can close over it. A `.curtain` wrapper is `overflow:hidden; pointer-events:none`.
5. **Audience foreground** — inline SVG silhouette band pinned to the bottom, in front of everything, `aria-hidden`.

**New — `src/lib/components/intro/AudienceSilhouette.svelte`** (optional split)
Inline SVG of sketchy head/shoulder silhouettes across the bottom, hand-drawn
stroke style, filled with `--audience-ink`, `preserveAspectRatio` to scale.

**Modify — `src/lib/components/Intro.svelte`**
- Make `.intro` tall (`~180vh`, tunable) to create the scroll runway.
- Add a sticky inner wrapper `.intro-stage-pin { position: sticky; top: 0; height: 100vh; }` holding the copy + `<Stage>` + scroll hint. NavBar stays at the top.
- Replace `.guide-slot` with `<Stage>`. Keep `h1` / `.tagline` / `.intro-text` above the stage inside the pinned area (marquee-style title over the valance is a possible later enhancement — out of scope now).

**Modify — `src/styles/global.css`**
Add tokens under `:root` (per CLAUDE.md, tokens live here):
- Curtain/stage palette, based on the existing dark-red ink so it fits the theme: `--stage-curtain`, `--stage-curtain-dark`, `--stage-bg`, `--stage-floor`, `--audience-ink`.
- Curtain geometry/timing: `--curtain-open-dur` (load part), curtain side-drape offset.
- **Local stage z-index tokens** (small, scoped to the stage): `--z-stage-back:0`, `--z-stage-floor:1`, `--z-stage-character:2`, `--z-stage-curtain:3`, `--z-stage-front:4`. (These don't collide with the global map `z:20` / scrubber `z:1100` because the tall intro section is a separate stacking context above `.story`.)
- Mobile overrides in the existing `@media (max-width:768px)` block: shorter runway, smaller stage guide size, shorter audience band.

**Content (user-side, no code):**
Drop the PNG in `public/media/character/` and add a **new pose key** in
`content/character.yaml`, e.g. `stage: media/character/stage.png`. Using a new
key (not `default`) keeps the timeline events' `default` art independent. The
`asset()` helper (`src/lib/data.js`) already resolves it; `CharacterGuide`
falls back to `default` if the key is missing.

### Curtain mechanics (the core)

**One driver value `--curtain`** on the stage element: `0` = fully open (side
drapes only), `1` = fully closed (panels meet in the middle). Panel transforms
are computed from it:
- Left panel: `translateX(calc((var(--curtain) - 1) * <closed-travel>))` → at `1` sits at center edge, at `0` slides out left leaving a side drape. Right panel mirrors. Panels are ~56% wide with slight center overlap so they meet cleanly.

**Load "part open" (once, on mount):**
- Initialize `--curtain: 1` and add an `.opening` class that puts `transition: transform var(--curtain-open-dur) ease` on the panels, then in a `requestAnimationFrame` set `--curtain: 0`. The transform interpolates → curtains part. (Transitioning the panels' `transform`, not the custom property, avoids `@property` complexity.)
- Because scroll progress at the top of the page is also ~0, there's no fight between the load animation and the scroll handler.

**Scroll "close" (pinned runway):**
- On scroll/resize (rAF-throttled, mirroring `MapPanel.svelte`'s `syncWheelZoom` listener + `CanvasBlock.svelte`'s rAF teardown), compute section progress:
  ```
  const rect = section.getBoundingClientRect()
  const runway = rect.height - window.innerHeight
  const p = clamp(-rect.top / runway, 0, 1)
  ```
- Map with a hold-then-sweep window so the character stands a beat before closing and is fully shut before release:
  `curtain = clamp((p - 0.25) / (0.85 - 0.25), 0, 1)`.
- While actively scrubbing, remove `.opening` (drop the transition) so tracking is immediate; write `stage.style.setProperty('--curtain', curtain)`.
- Clean up listeners on destroy.

**Reduced motion / no-JS:** default CSS state is **open** (`--curtain: 0`, no
side-slide needed to reveal). If `matchMedia('(prefers-reduced-motion: reduce)')`
matches (same check as `src/lib/actions/reveal.js`), skip the load animation and
skip attaching the scroll handler — curtains stay open and the stage just
scrolls away with the section.

## Issues & risks to watch

- **Sticky-in-tall-section ↔ MapPanel handoff.** As the intro's sticky stage releases at the bottom of the ~180vh section, `.story`'s sticky `MapPanel` (`top:0`, `z:20`) must dock with no visible gap or jump. They're independent scroll/stacking contexts so it should be clean, but this transition is the #1 thing to verify. `MapPanel`'s `syncWheelZoom` (`rect.top <= 0`) is unaffected.
- **Runway length tuning.** ~180vh is a starting point: too long delays the timeline, too short rushes the close. Expose as the section height / mapping window and tune by feel.
- **Character scale & PNG resolution.** The timeline `--guide-size` is only 104px/76px; on a full stage the character may read small. Plan overrides `--guide-size` locally on the stage — the provided PNG should be high-res enough to scale up.
- **Speech-bubble clearance.** The bubble (`side="right"`, ~240px) must not collide with the curtains/audience; give the character+bubble a centered clear zone and let it stack on mobile.
- **Mobile viewport (`vh`).** iOS address-bar resizing makes `100vh` jumpy for a pinned element; consider `100dvh` for `.intro-stage-pin` height (rest of the codebase uses `vh`, so this would be a small, optional consistency trade-off).
- **First-paint state.** Keep default CSS = open so a JS/CSS failure never leaves curtains stuck closed over the character. The "start closed then part" is added only when JS confirms and motion is allowed.
- **`pointer-events`.** Curtain layer must be `pointer-events:none` so it never blocks the character's click-for-more-lines while open.

## Status

Planning complete, not yet implemented. Pick up by implementing the Files
section above. No code has been written yet.
