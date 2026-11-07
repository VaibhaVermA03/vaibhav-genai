import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { playIntroSound } from '../lib/sound'
import { site } from '../config/site'
import './intro.css'

/**
 * ~2.8s opening, one GSAP timeline:
 *   black → a thin vertical line appears at the centre → it opens horizontally
 *   into a rule while the name is unveiled from the centre outward (clip-path)
 *   → tagline masks in → the whole layer dissolves into the hero.
 * Skippable (button / Esc). Sound OFF by default. Reduced motion = brief static frame.
 *
 * onDissolve fires when the fade starts (so the hero can animate in underneath);
 * onDone fires when the layer is gone and can be unmounted.
 */
export default function Intro({ onDissolve, onDone, reduced }) {
  const root = useRef(null)
  const tl = useRef(null)
  const finished = useRef(false)
  const [sound, setSound] = useState(false)

  const finish = useCallback(
    (skipped = false) => {
      if (finished.current) return
      finished.current = true
      tl.current?.kill()
      onDissolve()
      gsap.to(root.current, {
        opacity: 0,
        duration: reduced ? 0.25 : skipped ? 0.45 : 0.75,
        ease: 'power2.inOut',
        onComplete: onDone,
      })
    },
    [onDissolve, onDone, reduced],
  )

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const line = '.intro__line'
      const lineW = Math.min(560, window.innerWidth * 0.72)

      if (reduced) {
        gsap.set(line, { xPercent: -50, yPercent: -50, width: lineW, height: 1 })
        gsap.set('.intro__name-wrap, .intro__tag-wrap', { clipPath: 'inset(0 0 0 0)' })
        gsap.delayedCall(1.1, () => finish())
        return
      }

      gsap.set(line, { xPercent: -50, yPercent: -50, scaleY: 0, width: 1, height: 150 })
      gsap.set('.intro__name-wrap', { clipPath: 'inset(0 50% 0 50%)' })
      gsap.set('.intro__name', { yPercent: 30 })
      gsap.set('.intro__tag-wrap', { clipPath: 'inset(0 0 100% 0)' })
      gsap.set('.intro__tag', { yPercent: -40 })

      const t = gsap.timeline({ defaults: { ease: 'expo.inOut' }, onComplete: () => finish() })
      tl.current = t
      t.to(line, { scaleY: 1, duration: 0.55, ease: 'power3.out' }, 0.1)
        .to(line, { width: lineW, height: 1, duration: 0.85 }, 0.75)
        .to('.intro__name-wrap', { clipPath: 'inset(0 0% 0 0%)', duration: 0.95 }, 0.85)
        .to('.intro__name', { yPercent: 0, duration: 0.95 }, 0.85)
        .to('.intro__tag-wrap', { clipPath: 'inset(0 0 0% 0)', duration: 0.8 }, 1.5)
        .to('.intro__tag', { yPercent: 0, duration: 0.8 }, 1.5)
        .to({}, { duration: 0.5 }, 2.3) // hold, then dissolve
    }, root)
    return () => ctx.revert()
  }, [reduced, finish])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') finish(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finish])

  const toggleSound = () => {
    setSound((s) => {
      const next = !s
      if (next) playIntroSound()
      return next
    })
  }

  const [first, last] = site.name.toUpperCase().split(' ')

  return (
    <div ref={root} className="intro" role="dialog" aria-label="Introduction" aria-modal="true">
      <div className="intro__line" aria-hidden="true" />

      <div className="intro__name-wrap">
        <p className="intro__name" aria-label={site.name}>
          <span aria-hidden="true">
            {first} {last}
          </span>
        </p>
      </div>

      <div className="intro__tag-wrap">
        <p className="intro__tag">
          <span>ENGINEERING INTELLIGENCE.</span>
          <span>BUILDING THE FUTURE.</span>
        </p>
      </div>

      <div className="intro__controls">
        <button
          type="button"
          className="intro__btn"
          onClick={toggleSound}
          aria-pressed={sound}
          aria-label={sound ? 'Turn intro sound off' : 'Turn intro sound on'}
        >
          {sound ? <Volume2 size={15} /> : <VolumeX size={15} />}
          <span>Sound {sound ? 'on' : 'off'}</span>
        </button>
        <button type="button" className="intro__btn" onClick={() => finish(true)}>
          Skip intro
        </button>
      </div>
    </div>
  )
}
