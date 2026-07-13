// Central content loader. All authored content lives in /content — this module
// is the only place code touches those files, so the content format can evolve
// without changes rippling through components.
import site from '../../content/site.yaml'
import character from '../../content/character.yaml'

// Every YAML file in content/events becomes one timeline event.
// Files are sorted by filename (010-, 020-, ...) so authors control order by naming.
const modules = import.meta.glob('../../content/events/*.yaml', { eager: true })

// Normalize an event to a single, unified `content` stream of fragments, so the
// scene component never has to care whether the author used the new `content:`
// list or the legacy `media:`/`body:`/`links:` fields.
//
// A fragment is `{ type, place?, ...typeSpecificFields }`. Media fragments carry
// the same fields the media blocks already expect; `text` and `links` are
// first-class fragment types alongside them.
function normalizeEvent(event) {
  if (Array.isArray(event.content)) return event

  const content = []

  // Legacy media items become fragments verbatim — the media type `text`
  // historically rendered as a pull-quote, so preserve that as `variant: quote`.
  for (const item of event.media ?? []) {
    if (item.type === 'text') {
      content.push({ type: 'text', variant: 'quote', text: item.text, caption: item.caption })
    } else {
      content.push(item)
    }
  }

  // The prose body follows the media, as it did inside the old card.
  if (event.body) {
    content.push({ type: 'text', variant: 'prose', text: event.body })
  }

  // Links collapse into a single links fragment.
  if (event.links?.length) {
    content.push({ type: 'links', items: event.links })
  }

  return { ...event, content }
}

export const events = Object.keys(modules)
  .sort()
  .map((path) => normalizeEvent(modules[path].default))

export { site, character }

// Resolve a content-relative media path (e.g. "media/foo.png" under /public)
// against the deployment base URL, so paths work at both "/" and "/repo-name/".
export function asset(path) {
  if (/^https?:\/\//.test(path)) return path
  return import.meta.env.BASE_URL + path
}
