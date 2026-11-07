import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

/**
 * One animation system, one vocabulary. Each element type gets its own
 * choreography via data attributes (no generic fade-up everywhere):
 *
 *  data-lines  Headings: line-by-line typographic reveal (chars rise from a mask)
 *  data-mask   Blocks:   mask reveal — clip-path wipe from the bottom edge
 *  data-img    Visuals:  subtle clip-path "unveil" with a slight scale settle
 *  data-stagger Lists:   children unveil sequentially through a small mask
 *  data-fade   Meta:     opacity only (labels, captions) — never interferes with reading
 *  data-line   Rules:    horizontal hairline drawing left → right
 *
 * Optional data-delay="0.1" on any of them.
 * Everything lives inside a gsap.context, so unmounting reverts it all.
 */
export default function useReveal(scope, disabled) {
  useLayoutEffect(() => {
    if (disabled || !scope.current) return undefined
    const delayOf = (el) => parseFloat(el.dataset.delay || '0')

    const ctx = gsap.context(() => {
      // ── headings: line by line ────────────────────────────────
      gsap.utils.toArray('[data-lines]').forEach((el) => {
        const words = [...el.querySelectorAll('.word')]
        const chars = [...el.querySelectorAll('.char')]
        gsap.set(chars, { yPercent: 112 })
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            // group words by rendered line at the moment of reveal
            const lines = []
            let lastTop = null
            words.forEach((w) => {
              const t = w.offsetTop
              if (lastTop === null || Math.abs(t - lastTop) > 4) {
                lines.push([])
                lastTop = t
              }
              lines[lines.length - 1].push(w)
            })
            lines.forEach((ws, i) => {
              gsap.to(
                ws.flatMap((w) => [...w.querySelectorAll('.char')]),
                { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.016, delay: delayOf(el) + i * 0.13 },
              )
            })
          },
        })
      })

      // ── blocks: mask wipe ─────────────────────────────────────
      gsap.utils.toArray('[data-mask]').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(0 0 100% 0)', y: 26 },
          {
            clipPath: 'inset(0 0 0% 0)',
            y: 0,
            duration: 1.25,
            ease: 'expo.out',
            delay: delayOf(el),
            clearProps: 'clipPath',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          },
        )
      })

      // ── visuals: unveil ───────────────────────────────────────
      gsap.utils.toArray('[data-img]').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(7% 7% 7% 7% round 18px)', scale: 1.06 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 18px)',
            scale: 1,
            duration: 1.6,
            ease: 'expo.out',
            delay: delayOf(el),
            clearProps: 'clipPath',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        )
      })

      // ── lists: sequential unveil ──────────────────────────────
      gsap.utils.toArray('[data-stagger]').forEach((parent) => {
        gsap.fromTo(
          parent.children,
          { clipPath: 'inset(0 0 100% 0)', y: 16 },
          {
            clipPath: 'inset(0 0 0% 0)',
            y: 0,
            duration: 0.95,
            stagger: 0.06,
            ease: 'expo.out',
            clearProps: 'clipPath',
            scrollTrigger: { trigger: parent, start: 'top 88%', once: true },
          },
        )
      })

      // ── meta: opacity only ────────────────────────────────────
      gsap.utils.toArray('[data-fade]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          delay: delayOf(el),
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        })
      })

      // ── rules: draw ───────────────────────────────────────────
      gsap.utils.toArray('[data-line]').forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.5,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: el, start: 'top 94%', once: true },
        })
      })
    }, scope)

    return () => ctx.revert()
  }, [disabled, scope])
}
