import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from './lib/gsap'
import { getLenis } from './lib/scroll'
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion'
import useLenis from './hooks/useLenis'
import useReveal from './hooks/useReveal'

import Intro from './components/Intro'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import World from './components/World'
import Experience from './components/Experience'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import NotFound from './components/NotFound'

const SEEN_KEY = 'vv-intro-seen'
const readSeen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

const isHome = () => ['/', '/index.html'].includes(window.location.pathname)

function Portfolio() {
  const reduced = usePrefersReducedMotion()
  // 'playing' → intro running · 'dissolving' → hero animating in underneath · 'done' → intro unmounted
  const [phase, setPhase] = useState(() => (readSeen() ? 'done' : 'playing'))
  const scope = useRef(null)

  useLenis(reduced)
  useReveal(scope, reduced)

  // lock scroll while the intro plays
  useEffect(() => {
    if (phase === 'done') return undefined
    document.documentElement.classList.add('is-locked')
    getLenis()?.stop()
    return () => {
      document.documentElement.classList.remove('is-locked')
      getLenis()?.start()
    }
  }, [phase])

  const handleDissolve = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* private mode — fine */
    }
    setPhase((p) => (p === 'playing' ? 'dissolving' : p))
  }, [])

  const handleDone = useCallback(() => {
    setPhase('done')
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [])

  // fonts/images can shift layout — keep trigger positions honest
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    document.fonts?.ready.then(onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  const ready = phase !== 'playing'

  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <Cursor />
      {phase !== 'done' && <Intro onDissolve={handleDissolve} onDone={handleDone} reduced={reduced} />}
      <Navbar visible={ready} />
      <div ref={scope}>
        <main>
          <Hero ready={ready} />
          <About />
          <Skills />
          <Projects />
          <World />
          <Experience />
          <Education />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default function App() {
  return isHome() ? <Portfolio /> : <NotFound />
}
