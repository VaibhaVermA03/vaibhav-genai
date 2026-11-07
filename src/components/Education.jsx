import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { education as edu } from '../config/site'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import SectionHead from './SectionHead'
import './experience.css'

export default function Education() {
  const root = useRef(null)
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    if (reduced || !root.current) return undefined
    const ctx = gsap.context(() => {
      gsap.from('.edu__fill', {
        scaleX: 0,
        duration: 1.6,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: '.edu__track', start: 'top 92%', once: true },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="education" ref={root} className="section education" aria-labelledby="edu-title">
      <div className="container">
        <SectionHead index="06" label="Education" title="Foundations." id="edu-title" />

        <div className="edu">
          <p className="edu__years" data-mask aria-label={`${edu.from} to ${edu.to}`}>
            <span aria-hidden="true">{edu.from}</span>
            <span className="dash" aria-hidden="true">
              —
            </span>
            <span className="to" aria-hidden="true">
              {edu.to}
            </span>
          </p>

          <div data-mask data-delay="0.08">
            <h3 className="edu__degree">{edu.degree}</h3>
            <p className="edu__field">{edu.field}</p>
            <p className="edu__school">
              <strong>{edu.school}</strong>
              {edu.place}
            </p>
          </div>

          <div className="edu__cgpa" data-mask data-delay="0.16">
            <p className="eyebrow">CGPA</p>
            <p className="edu__score">
              {edu.cgpa}
              <small> / {edu.cgpaMax}</small>
            </p>
            <div className="edu__track" role="img" aria-label={`CGPA ${edu.cgpa} out of ${edu.cgpaMax}`}>
              <span className="edu__fill" style={{ width: `${(edu.cgpa / edu.cgpaMax) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
