let lenis = null

export const setLenis = (instance) => {
  lenis = instance
}
export const getLenis = () => lenis

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 4) })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
