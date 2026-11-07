import { useEffect, useRef, useState } from 'react'
import usePrefersReducedMotion from './usePrefersReducedMotion'

/**
 * Drives looping "storyboard" animations inside the project mockups.
 * Returns [ref, step]; step counts 0 … steps+hold then wraps.
 * Only ticks while the element is on screen; reduced motion = final state.
 */
export default function useCycle(steps, ms = 1100, hold = 3) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()
  const [step, setStep] = useState(0)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduced) {
      setStep(steps)
      return undefined
    }
    if (!active) return undefined
    setStep((s) => (s === 0 ? 1 : s)) // start the story immediately when it scrolls into view
    const id = setInterval(() => setStep((s) => (s >= steps + hold ? 0 : s + 1)), ms)
    return () => clearInterval(id)
  }, [active, reduced, steps, ms, hold])

  return [ref, step]
}
