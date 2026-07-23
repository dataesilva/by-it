// Inline Markdown links for authored text. Lets any content field —
// `body:`/`text:` fragments, `intro:`, `title:` — carry `[label](url)` and have
// it render as a real anchor, with no code changes per event.
//
// Everything is HTML-escaped FIRST, then only the link pattern is turned into
// markup, so stray `<`/`&` in content stay inert (no XSS surface). Render the
// result with Svelte's `{@html ...}`.

const escapeHtml = (s) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// Only link URLs we trust; anything else is left as (escaped) plain text.
const isSafeUrl = (url) => /^(https?:|mailto:|\/|#|\.\/)/i.test(url)

export function renderInline(raw) {
  return escapeHtml(raw ?? '').replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (match, label, url) => {
      if (!isSafeUrl(url)) return match
      // In-page/relative anchors stay in the same tab; external links open out.
      const external = /^(https?:|mailto:)/i.test(url)
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${url}"${attrs}>${label}</a>`
    }
  )
}
