import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Github, Linkedin, MapPin } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { scrollToId } from '../lib/scroll'
import { site } from '../config/site'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import SplitText from './SplitText'
import Button from './Button'
import HeroAnimation from './HeroAnimation'
import './hero.css'

function useIstClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true })
    const tick = () => setTime(fmt.format(new Date()).toUpperCase())
    tick()
    const id = setInterval(tick, 20000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function Hero({ ready }) {
  const root = useRef(null)
  const reduced = usePrefersReducedMotion()
  const time = useIstClock()
  const [inView, setInView] = useState(true)

  // pause the animation when the hero is scrolled away
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '80px' })
    if (root.current) io.observe(root.current)
    return () => io.disconnect()
  }, [])

  // entrance choreography (starts while the intro is still dissolving)
  useLayoutEffect(() => {
    if (!ready || !root.current) return undefined
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.hero__line--outline .char', { color: '#f0ede5' })
        return
      }
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      // VAIBHAV: smooth mask reveal
      tl.from('.hero__line:first-child .char', { yPercent: 112, duration: 1.5, stagger: 0.04 }, 0.1)
        // VERMA: mask reveal as an outline …
        .from('.hero__line--outline .char', { yPercent: 112, duration: 1.5, stagger: 0.05 }, 0.28)
        // … then outline → solid warm ivory
        .to('.hero__line--outline .char', { color: '#f0ede5', duration: 1.2, stagger: 0.06, ease: 'power2.inOut' }, 1.35)
        // supporting copy: subtle upward reveal through a mask
        .fromTo(
          '[data-hero="up"]',
          { clipPath: 'inset(0 0 100% 0)', y: 22 },
          { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.1, stagger: 0.1, clearProps: 'clipPath' },
          0.75,
        )
        .from('[data-hero="fade"]', { opacity: 0, duration: 1.2, ease: 'power2.out' }, 0.5)
        .from('.hero__scroll-line', { scaleY: 0, transformOrigin: 'top', duration: 1.4 }, 1.2)
    }, root)
    return () => ctx.revert()
  }, [ready, reduced])

  // the illustration settles back slightly as the hero scrolls away
  useLayoutEffect(() => {
    if (reduced || !root.current) return undefined
    const ctx = gsap.context(() => {
      gsap.to('.hero__stage', {
        scale: 0.93,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="top" ref={root} className={`hero ${ready ? 'is-ready' : ''}`} aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__light" />
        <div className="hero__vignette" />
      </div>

      <div className="hero__stage" aria-hidden="true">
        <div className="hero__stage-in">
          <HeroAnimation active={inView && ready} reduced={reduced} />
        </div>
      </div>

      <div className="hero__top container">
        <p className="mono hero__meta" data-hero="fade">
          <MapPin size={13} /> {site.location}
          {time && <span className="hero__time"> · {time} IST</span>}
        </p>
        <ul className="hero__social" data-hero="fade" aria-label="Social links">
          <li>
            <a className="icon-btn" href={site.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
              <Github size={18} />
            </a>
          </li>
          <li>
            <a className="icon-btn" href={site.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
              <Linkedin size={18} />
            </a>
          </li>
        </ul>
      </div>

      <div className="hero__content container">
        <p className="eyebrow" data-hero="fade">
          {site.role}
        </p>

        <h1 id="hero-title" className="hero__name display" aria-label={site.name}>
          <SplitText text="VAIBHAV" as="span" className="hero__line" />
          <SplitText text="VERMA" as="span" className="hero__line hero__line--outline" />
        </h1>

        <div className="hero__copy">
          <p className="hero__tagline" data-hero="up">
            {site.tagline[0]}
            <br />
            <span className="accent">{site.tagline[1]}</span>
          </p>
          <p className="hero__desc" data-hero="up">
            {site.heroDescription}
          </p>
          <div className="hero__cta" data-hero="up">
            <Button onClick={() => scrollToId('projects')} icon={<ArrowUpRight size={18} />}>
              Explore My Work
            </Button>
            <Button variant="ghost" onClick={() => scrollToId('contact')} icon={<ArrowUpRight size={18} />}>
              Let&apos;s Connect
            </Button>
          </div>
        </div>
      </div>

      <button type="button" className="hero__scroll" onClick={() => scrollToId('about')} aria-label="Scroll to about section">
        <span className="hero__scroll-line" />
        <span className="mono">Scroll</span>
        <ArrowDown size={14} />
      </button>
    </section>
  )
}
