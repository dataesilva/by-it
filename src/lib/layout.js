// Placement resolution for a scene's fragments.
//
// Turns the hybrid authoring model — an optional per-event `layout:` preset plus
// optional per-fragment `place:` overrides — into a concrete
// `{ side, width, offsetY }` for every fragment. Author-supplied `place` fields
// always win; anything omitted falls back to the preset, which itself falls back
// to per-type defaults. This is pure presentation logic, kept out of the content
// loader so the data layer stays format-only.

const opposite = (side) => (side === 'left' ? 'right' : 'left')

// Sensible default width per fragment type when nothing else specifies one.
function defaultWidth(type) {
  switch (type) {
    case 'image':
    case 'video':
    case 'embed':
    case 'canvas':
      return 'wide'
    case 'links':
      return 'narrow'
    case 'text':
    default:
      return 'medium'
  }
}

// A small repeating stagger (in rem) that lets the `scatter` preset overlap and
// float fragments vertically without any absolute positioning.
const SCATTER_OFFSETS = [0, 3, -2, 4, 1, -3]

// Compute the preset's default placement for fragment `i`. `sceneSide` seeds the
// alternation so a scene leaning left starts its weave on the left.
function presetPlace(layout, fragment, i, sceneSide) {
  const isText = fragment.type === 'text' || fragment.type === 'links'

  switch (layout) {
    case 'split':
      // Media on the scene's side, prose/links on the opposite side.
      return { side: isText ? opposite(sceneSide) : sceneSide, width: defaultWidth(fragment.type) }

    case 'hero':
      // The first fragment dominates the middle; the rest alternate beneath it.
      if (i === 0) return { side: 'center', width: isText ? 'wide' : 'full' }
      return {
        side: i % 2 === 0 ? sceneSide : opposite(sceneSide),
        width: defaultWidth(fragment.type),
      }

    case 'scatter':
      return {
        side: i % 2 === 0 ? sceneSide : opposite(sceneSide),
        width: defaultWidth(fragment.type),
        offsetY: SCATTER_OFFSETS[i % SCATTER_OFFSETS.length],
      }

    case 'stack':
    default:
      // Alternate sides down the scene for an organic left/right weave.
      return {
        side: i % 2 === 0 ? sceneSide : opposite(sceneSide),
        width: defaultWidth(fragment.type),
      }
  }
}

// Resolve final placements for all fragments in a scene.
export function resolvePlacements(content, layout, sceneSide) {
  const side = sceneSide === 'right' ? 'right' : 'left'
  return content.map((fragment, i) => {
    const preset = presetPlace(layout ?? 'stack', fragment, i, side)
    const place = fragment.place ?? {}
    return {
      side: place.side ?? preset.side ?? side,
      width: place.width ?? preset.width ?? defaultWidth(fragment.type),
      offsetY: place.offsetY ?? preset.offsetY ?? 0,
    }
  })
}

// Resolve the heading's placement (its own `titlePlace`, else it leads on the
// scene's side at a comfortable width).
export function resolveTitlePlacement(titlePlace, sceneSide) {
  const side = sceneSide === 'right' ? 'right' : 'left'
  return {
    side: titlePlace?.side ?? side,
    width: titlePlace?.width ?? 'medium',
    offsetY: titlePlace?.offsetY ?? 0,
  }
}
