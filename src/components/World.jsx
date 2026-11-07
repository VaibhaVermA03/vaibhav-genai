import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { worldEdges, worldNodes } from '../data/skills'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import SectionHead from './SectionHead'
import './world.css'

const byId = Object.fromEntries(worldNodes.map((n) => [n.id, n]))

export default function World() {
  const [active, setActive] = useState('llm')
  const [inView, setInView] = useState(false)
  const interacted = useRef(false)
  const box = useRef(null)
  const reduced = usePrefersReducedMotion()

  const node = byId[active]
  const linked = useMemo(
    () => new Set(worldEdges.filter(([a, b]) => a === active || b === active).flat()),
    [active],
  )

  useEffect(() => {
    const el = box.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // gentle auto-tour until the visitor takes over
  useEffect(() => {
    if (reduced || !inView) return undefined
    const id = setInterval(() => {
      if (interacted.current) return
      setActive((cur) => worldNodes[(worldNodes.findIndex((n) => n.id === cur) + 1) % worldNodes.length].id)
    }, 3800)
    return () => clearInterval(id)
  }, [reduced, inView])

  const choose = (id) => {
    interacted.current = true
    setActive(id)
  }

  return (
    <section id="world" className="section world" aria-labelledby="world-title">
      <div className="container">
        <SectionHead index="04" label="Beyond the code" title="My world of intelligence." id="world-title" wide>
          <p className="lede" data-mask>
            What I work with and what I build — everything connects through the backend. Hover or tap a node to follow the links.
          </p>
        </SectionHead>

        <div className="world__layout" data-img>
          <div ref={box} className="net" role="group" aria-label="Interactive network of the areas I work in">
            <svg className="net__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {worldEdges.map(([a, b]) => {
                const on = a === active || b === active
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={byId[a].x * 100}
                    y1={byId[a].y * 100}
                    x2={byId[b].x * 100}
                    y2={byId[b].y * 100}
                    className={on ? 'is-on' : ''}
                  />
                )
              })}
            </svg>

            {worldNodes.map((n) => {
              const state = n.id === active ? 'is-active' : linked.has(n.id) ? 'is-linked' : 'is-dim'
              return (
                <button
                  key={n.id}
                  type="button"
                  className={`net__node ${state}`}
                  style={{ left: `${n.x * 100}%`, top: `${n.y * 100}%` }}
                  aria-pressed={n.id === active}
                  onClick={() => choose(n.id)}
                  onFocus={() => choose(n.id)}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && choose(n.id)}
                >
                  <span className="net__dot" />
                  <span className="net__label">{n.label}</span>
                </button>
              )
            })}
          </div>

          <div className="world__detail" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                transition={{ duration: 0.45, ease: [0.22, 0.8, 0.2, 1] }}
              >
                <p className="eyebrow">Node {String(worldNodes.indexOf(node) + 1).padStart(2, '0')}</p>
                <h3 className="display">{node.label}</h3>
                <p className="world__text">{node.text}</p>
                <ul className="world__tags">
                  {node.tags.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
