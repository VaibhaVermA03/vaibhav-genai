import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { navItems, site } from '../config/site'
import { getLenis, scrollToId, scrollToTop } from '../lib/scroll'
import Button from './Button'
import './navbar.css'

export default function Navbar({ visible }) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)

  // Glass surface after the first bit of scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section detection
  useEffect(() => {
    const targets = navItems.map((n) => document.getElementById(n.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    targets.forEach((t) => io.observe(t))
    const hero = document.getElementById('top')
    const heroIO = new IntersectionObserver(([e]) => e.isIntersecting && setActive(''), { threshold: 0.5 })
    if (hero) heroIO.observe(hero)
    return () => {
      io.disconnect()
      heroIO.disconnect()
    }
  }, [])

  // Lock scroll + Esc to close when the mobile overlay is open
  useEffect(() => {
    if (!open) return undefined
    document.documentElement.classList.add('is-locked')
    getLenis()?.stop()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.classList.remove('is-locked')
      getLenis()?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Close the overlay if the viewport grows to desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    setTimeout(() => scrollToId(id), open ? 250 : 0) // let the overlay release scroll first
  }

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${visible ? 'is-visible' : ''}`}>
      <div className="nav__inner container">
        <a
          href="#top"
          className="nav__brand"
          aria-label={`${site.name} — back to top`}
          onClick={(e) => {
            e.preventDefault()
            setOpen(false)
            scrollToTop()
          }}
        >
          VAIBHAV <span>VERMA</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {navItems.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={go(n.id)}
              className={active === n.id ? 'is-active' : ''}
              aria-current={active === n.id ? 'true' : undefined}
            >
              <span className="nav__label">{n.label}</span>
              {active === n.id && (
                <motion.span
                  layoutId="nav-indicator"
                  className="nav__ind"
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
              )}
            </a>
          ))}
        </nav>

        <div className="nav__right">
          <Button
            href={site.resumeUrl}
            download={site.resumeFileName}
            variant="ghost"
            size="small"
            icon={<Download size={15} />}
            className="nav__resume"
          >
            Resume
          </Button>
          <button
            type="button"
            className={`burger ${open ? 'is-open' : ''}`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mnav"
            initial={{ clipPath: 'circle(0% at calc(100% - 44px) 38px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 44px) 38px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 44px) 38px)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Mobile">
              <ul>
                {navItems.map((n, i) => (
                  <motion.li
                    key={n.id}
                    initial={{ y: 36, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { delay: 0.25 + i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  >
                    <a href={`#${n.id}`} onClick={go(n.id)} className={active === n.id ? 'is-active' : ''}>
                      <span className="mnav__num">0{i + 1}</span>
                      <span className="mnav__label">{n.label}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="mnav__foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.7 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              <Button href={site.resumeUrl} download={site.resumeFileName} variant="primary" icon={<Download size={16} />}>
                Download resume
              </Button>
              <p className="mono">{site.location}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </header>
  )
}
