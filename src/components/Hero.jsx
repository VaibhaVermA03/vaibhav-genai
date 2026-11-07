import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Github, Linkedin, MapPin } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { hasWebGL, isSmallScreen } from '../lib/webgl'
import { scrollToId } from '../lib/scroll'
import { site } from '../config/site'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import ErrorBoundary from './ErrorBoundary'
import SplitText from './SplitText'
import Button from './Button'
import './hero.css'

// three.js lives in its own chunk and is only fetched when WebGL is usable
const HeroScene = lazy(() => import('./HeroScene'))

/** Polished, static-ish stand-in for the 3D sculpture (no WebGL / reduced motion). */
function SculptureFallback() {
  return (
    <svg className="hero__svg" viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <linearGradient id="sf-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a3733" />
          <stop offset="1" stopColor="#141312" />
        </linearGradient>
        <linearGradient id="sf-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0ede5" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f0ede5" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <g className="hero__svg-spin">
        <polygon points="200,34 350,120 350,280 200,366 50,280 50,120" fill="url(#sf-a)" stroke="url(#sf-b)" />
        <polygon points="200,34 350,120 200,206 50,120" fill="#1e1d1b" stroke="url(#sf-b)" />
        <polygon points="200,206 350,120 350,280 200,366" fill="#171615" stroke="url(#sf-b)" />
        <polygon points="200,206 50,120 50,280 200,366" fill="#22201d" stroke="url(#sf-b)" />
        <polygon points="200,92 290,142 200,192 110,142" fill="none" stroke="#d97745" strokeOpacity="0.85" />
        <polyline points="110,142 110,262 200,312 290,262 290,142" fill="none" stroke="#f0ede5" strokeOpacity="0.2" />
      </g>
    </svg>
  )
}

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
  const [webgl] = useState(() => hasWebGL())
  const [mobile] = useState(() => isSmallScreen())
  const [inView, setInView] = useState(true)
  const [sceneReady, setSceneReady] = useState(false)

  // pause the render loop when the hero is scrolled away
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

  const showScene = webgl && !reduced

  return (
    <section id="top" ref={root} className={`hero ${ready ? 'is-ready' : ''}`} aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__light" />
        <div className={`hero__fallback ${showScene && sceneReady ? 'is-hidden' : ''}`}>
          <SculptureFallback />
        </div>
        {showScene && (
          <div className={`hero__canvas ${sceneReady ? 'is-ready' : ''}`}>
            <ErrorBoundary fallback={null}>
              <Suspense fallback={null}>
                <HeroScene active={inView && ready} mobile={mobile} onReady={() => setSceneReady(true)} />
              </Suspense>
            </ErrorBoundary>
          </div>
        )}
        <div className="hero__vignette" />
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
