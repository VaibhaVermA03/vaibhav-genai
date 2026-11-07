import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { experience } from '../config/site'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import SectionHead from './SectionHead'
import './experience.css'

export default function Experience() {
  const root = useRef(null)
  const reduced = usePrefersReducedMotion()

  // the timeline spine draws itself as you scroll
  useLayoutEffect(() => {
    if (reduced || !root.current) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tl__fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.tl', start: 'top 70%', end: 'bottom 70%', scrub: 0.5 },
        },
      )
      // each node lights up as the drawn line reaches it
      gsap.utils.toArray('.tl__item').forEach((item) => {
        gsap.fromTo(
          item.querySelector('.tl__dot'),
          { scale: 0.5, backgroundColor: 'rgba(0,0,0,0)' },
          {
            scale: 1,
            backgroundColor: '#d97745',
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 70%', once: true },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="experience" ref={root} className="section experience" aria-labelledby="exp-title">
      <div className="container">
        <SectionHead index="05" label="Experience" title="Where I've worked." id="exp-title" />

        <ol className="tl">
          <span className="tl__spine" aria-hidden="true">
            <span className="tl__fill" />
          </span>
          {experience.map((e) => (
            <li className="tl__item" key={e.role + e.company}>
              <span className="tl__dot" aria-hidden="true" />
              <div className="tl__when" data-fade>
                <p className="mono">{e.period}</p>
                <span className="chip">{e.type}</span>
              </div>
              <div className="tl__card" data-img data-delay="0.1">
                <h3 className="display" data-mask>{e.role}</h3>
                <p className="tl__company">
                  {e.company} <span>· {e.place}</span>
                </p>
                <ul className="tl__points" data-stagger>
                  {e.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <ul className="tl__stack">
                  {e.stack.map((s) => (
                    <li className="chip" key={s}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
