import { useEffect, useRef } from 'react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

/**
 * Small, quiet cursor for fine pointers only: a 6px dot plus a 30px ring that
 * trails by a hair. Over links/buttons the ring grows slightly and warms to
 * the accent. No trails, no blend modes. Touch and reduced-motion get nothing.
 * All updates go straight to the DOM — zero React re-renders.
 */
const INTERACTIVE = 'a, button, [role="tab"], [data-cursor]'

export default function Cursor() {
  const root = useRef(null)
  const dot = useRef(null)
  const ring = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined
    const el = root.current
    document.documentElement.classList.add('has-cursor')

    let x = -100
    let y = -100
    let rx = -100
    let ry = -100
    let raf = 0

    const loop = () => {
      rx += (x - rx) * 0.2
      ry += (y - ry) * 0.2
      ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      el.classList.add('is-on')
      el.classList.toggle('is-link', !!e.target.closest?.(INTERACTIVE))
    }
    const onDown = () => el.classList.add('is-down')
    const onUp = () => el.classList.remove('is-down')
    const onLeave = () => el.classList.remove('is-on')

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.documentElement.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced])

  return (
    <div ref={root} className="cursor" aria-hidden="true">
      <span ref={ring} className="cursor__ring" />
      <span ref={dot} className="cursor__dot" />
    </div>
  )
}
