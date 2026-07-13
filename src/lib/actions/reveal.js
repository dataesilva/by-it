// Svelte action: reveal an element as it scrolls into view.
//
// Adds the `is-visible` class the first time the element crosses into the
// viewport; CSS handles the actual transition (fragments define their own
// from-state, e.g. slide-from-side or fade-up). Uses IntersectionObserver —
// the same primitive Scrollama is built on — so there is no extra dependency.
//
// Usage:  <div use:reveal>…</div>
//         <div use:reveal={{ threshold: 0.35, once: false }}>…</div>
//
// Motion is a progressive enhancement: when the user prefers reduced motion, or
// IntersectionObserver is unavailable, the element is simply shown immediately.

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function reveal(node, options = {}) {
  const { threshold = 0.2, rootMargin = '0px 0px -10% 0px', once = true } = options

  // No observer support, or the user opted out of motion → show it now.
  if (REDUCED_MOTION || typeof IntersectionObserver === 'undefined') {
    node.classList.add('is-visible')
    return {}
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          node.classList.add('is-visible')
          if (once) observer.unobserve(node)
        } else if (!once) {
          node.classList.remove('is-visible')
        }
      }
    },
    { threshold, rootMargin }
  )

  observer.observe(node)

  return {
    destroy() {
      observer.disconnect()
    },
  }
}
