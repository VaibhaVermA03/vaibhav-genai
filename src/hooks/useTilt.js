import { useEffect } from 'react'

/** Pointer-driven 3D tilt via CSS variables (no React re-renders). */
export function useTilt(ref, { max = 7, disabled = false } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el || disabled) return undefined
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined
    let raf = 0
    const move = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`)
        el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`)
        el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`)
        el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`)
      })
    }
    const leave = () => {
      cancelAnimationFrame(raf)
      el.style.setProperty('--ry', '0deg')
      el.style.setProperty('--rx', '0deg')
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [ref, max, disabled])
}

/** Subtle magnetic pull for buttons. */
export function useMagnetic(ref, { strength = 0.25, disabled = false } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el || disabled) return undefined
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - (r.left + r.width / 2)
      const y = e.clientY - (r.top + r.height / 2)
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
    }
    const leave = () => {
      el.style.transform = ''
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [ref, strength, disabled])
}
