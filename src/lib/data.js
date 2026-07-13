// Central content loader. All authored content lives in /content — this module
// is the only place code touches those files, so the content format can evolve
// without changes rippling through components.
import site from '../../content/site.yaml'
import character from '../../content/character.yaml'

// Every YAML file in content/events becomes one timeline event.
// Files are sorted by filename (010-, 020-, ...) so authors control order by naming.
const modules = import.meta.glob('../../content/events/*.yaml', { eager: true })

export const events = Object.keys(modules)
  .sort()
  .map((path) => modules[path].default)

export { site, character }

// Resolve a content-relative media path (e.g. "media/foo.png" under /public)
// against the deployment base URL, so paths work at both "/" and "/repo-name/".
export function asset(path) {
  if (/^https?:\/\//.test(path)) return path
  return import.meta.env.BASE_URL + path
}
