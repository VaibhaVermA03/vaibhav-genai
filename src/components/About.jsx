import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { education, experience, site } from '../config/site'
import { focusAreas } from '../data/skills'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import SectionHead from './SectionHead'
import './about.css'

const STATEMENT =
  "I'm a Generative AI Engineer who builds with LLMs — retrieval systems that ground answers in real documents, agents that call tools and finish multi-step work, and the Python and FastAPI backends that hold it all together. I care about how an AI product feels as much as how it works, which is why my foundation is frontend engineering: React, clean interfaces and streaming responses that make intelligence feel instant."

export default function About() {
  const statement = useRef(null)
  const reduced = usePrefersReducedMotion()

  // words light up as you scroll through the paragraph
  useLayoutEffect(() => {
    if (reduced || !statement.current) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about__w',
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: { trigger: statement.current, start: 'top 82%', end: 'bottom 52%', scrub: 0.6 },
        },
      )
    }, statement)
    return () => ctx.revert()
  }, [reduced])

  const exp = experience[0]

  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container">
        <SectionHead index="01" label="About" title="Intelligence, engineered." id="about-title" />

        <div className="about__grid">
          <div className="about__main">
            <p ref={statement} className="about__statement">
              {STATEMENT.split(' ').map((w, i) => (
                <span className="about__w" key={i}>
                  {w}{' '}
                </span>
              ))}
            </p>

            <dl className="about__facts" data-stagger>
              <div>
                <dt className="mono">Based in</dt>
                <dd>{site.location}</dd>
              </div>
              <div>
                <dt className="mono">Education</dt>
                <dd>
                  B.Tech, Computer Science &amp; Engineering · {education.from}–{education.to}
                </dd>
              </div>
              <div>
                <dt className="mono">Experience</dt>
                <dd>
                  {exp.role}, {exp.company} · 2025
                </dd>
              </div>
            </dl>
          </div>

          <aside className="about__focus" aria-labelledby="focus-title">
            <h3 id="focus-title" className="eyebrow" data-fade>
              Professional focus
            </h3>
            <ol data-stagger>
              {focusAreas.map((f, i) => (
                <li key={f}>
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                  <span>{f}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  )
}
