import { useLayoutEffect, useRef } from 'react'
import { ArrowUpRight, Github } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { projects, site } from '../config/site'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import { useTilt } from '../hooks/useTilt'
import SectionHead from './SectionHead'
import SplitText from './SplitText'
import Button from './Button'
import OrynMockup from './mockups/OrynMockup'
import NexisMockup from './mockups/NexisMockup'
import SynaxysMockup from './mockups/SynaxysMockup'
import './mockups/mockups.css'
import './projects.css'

const MOCKUPS = { oryn: OrynMockup, nexis: NexisMockup, synaxys: SynaxysMockup }

function Showcase({ project, total, reduced }) {
  const tilt = useRef(null)
  useTilt(tilt, { max: 5, disabled: reduced })
  const Mockup = MOCKUPS[project.visual]

  return (
    <article className="proj" data-theme={project.visual} id={`project-${project.id}`} aria-labelledby={`${project.id}-name`}>
      <header className="proj__head" data-fade>
        <span className="mono proj__index">
          {project.index} / {String(total).padStart(2, '0')}
        </span>
        <span className="eyebrow proj__kicker">{project.kicker}</span>
      </header>

      <SplitText as="h3" id={`${project.id}-name`} className="proj__name display" text={project.name} reveal />
      <p className="proj__full" data-mask>
        {project.fullName}
      </p>

      <div className="proj__body">
        <div className="proj__info" data-stagger>
          <p className="proj__desc">{project.description}</p>

          <div>
            <h4 className="proj__label mono">Key features</h4>
            <ul className="proj__features">
              {project.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="proj__label mono">Tech stack</h4>
            <ul className="proj__stack">
              {project.stack.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="proj__actions">
            <Button
              href={project.live}
              external
              icon={<ArrowUpRight size={18} />}
              aria-label={`${project.name} live demo (opens in a new tab)`}
            >
              Live demo
            </Button>
            <Button
              href={project.repo}
              external
              variant="ghost"
              icon={<Github size={17} />}
              aria-label={`${project.name} source code on GitHub (opens in a new tab)`}
            >
              GitHub
            </Button>
          </div>
        </div>

        <div className="proj__visual">
          <div className="proj__plate" data-img>
            <div className="proj__float">
              <div ref={tilt} className="proj__tilt">
                <Mockup />
                <span className="proj__sheen" aria-hidden="true" />
              </div>
            </div>
          </div>
          <p className="proj__caption mono" data-fade>
            Illustrative UI preview
          </p>
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const root = useRef(null)
  const reduced = usePrefersReducedMotion()

  // Scroll-scrubbed depth: each showcase starts slightly small and tilted back,
  // settles flat as it reaches the centre, then recedes a touch on the way out.
  useLayoutEffect(() => {
    if (reduced || !root.current) return undefined
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      gsap.utils.toArray('.proj__float', root.current).forEach((el) => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el.closest('.proj'), start: 'top 85%', end: 'bottom 15%', scrub: 0.8 },
        })
        tl.fromTo(el, { scale: 0.9, rotateX: 9, yPercent: 4 }, { scale: 1, rotateX: 0, yPercent: 0, duration: 0.4 })
          .to(el, { scale: 1, duration: 0.25 })
          .to(el, { scale: 0.95, rotateX: -4, yPercent: -3, duration: 0.35 })
      })
    })
    return () => mm.revert()
  }, [reduced])

  return (
    <section id="projects" ref={root} className="section projects" aria-labelledby="projects-title">
      <div className="container">
        <SectionHead index="03" label="Selected work" title="Systems I've built." id="projects-title" wide>
          <p className="lede" data-mask>
            Three full-stack AI products — each with its own architecture, its own interface and a live deployment.
          </p>
        </SectionHead>

        <div className="projects__list">
          {projects.map((p) => (
            <Showcase key={p.id} project={p} total={projects.length} reduced={reduced} />
          ))}
        </div>

        <div className="projects__more" data-fade>
          <p className="mono">More code, experiments and repositories</p>
          <Button href={site.social.github} external variant="ghost" icon={<Github size={17} />}>
            Browse GitHub
          </Button>
        </div>
      </div>
    </section>
  )
}
