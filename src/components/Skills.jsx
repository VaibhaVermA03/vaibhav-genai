import { useEffect, useRef, useState } from 'react'
import { skillMap } from '../data/skills'
import SectionHead from './SectionHead'
import './skills.css'

const VB_H = 56 // viewBox is 100 × 56
const byId = Object.fromEntries(skillMap.categories.map((c) => [c.id, c]))
const pad = (n) => String(n).padStart(2, '0')

/**
 * Interactive architectural map: a core node, six categories wired to it,
 * and fainter links between related categories.
 *  - hover / focus / tap a category → its connection lights up, the others recede
 *  - its technologies are revealed one after another (readout on desktop,
 *    inline accordion on mobile where the map becomes a vertical spine)
 *  - on first scroll-in the lines draw and categories appear in sequence
 */
export default function Skills() {
  const [active, setActive] = useState(skillMap.categories[0].id)
  const [hover, setHover] = useState(null)
  const [drawn, setDrawn] = useState(false)
  const map = useRef(null)

  useEffect(() => {
    const el = map.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const focus = byId[hover || active]

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHead index="02" label="Technical skills" title="The system, mapped." id="skills-title">
          <p className="lede" data-mask>
            Six areas, one core. Select a category to follow its connection and see the technologies behind it.
          </p>
        </SectionHead>

        <div className="skills__wrap">
          <div
            ref={map}
            className={`map ${drawn ? 'is-drawn' : ''}`}
            role="group"
            aria-label={`${skillMap.center} — skills architecture map`}
          >
            <svg className="map__svg" viewBox={`0 0 100 ${VB_H}`} aria-hidden="true">
              {skillMap.links.map(([a, b]) => {
                const A = byId[a]
                const B = byId[b]
                const hot = focus.id === a || focus.id === b
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={A.x}
                    y1={A.y}
                    x2={B.x}
                    y2={B.y}
                    pathLength="1"
                    className={`map__link ${hot ? 'is-hot' : ''}`}
                  />
                )
              })}
              {skillMap.categories.map((c, i) => (
                <g key={c.id} style={{ '--i': i }}>
                  <line
                    x1="50"
                    y1={VB_H / 2}
                    x2={c.x}
                    y2={c.y}
                    pathLength="1"
                    className={`map__spoke ${focus.id === c.id ? 'is-hot' : ''}`}
                  />
                  <rect
                    x={c.x - 0.45}
                    y={c.y - 0.45}
                    width="0.9"
                    height="0.9"
                    className={`map__joint ${focus.id === c.id ? 'is-hot' : ''}`}
                  />
                </g>
              ))}
            </svg>

            <div className="map__core">
              <span className="mono">Core</span>
              <strong>{skillMap.center.toUpperCase()}</strong>
            </div>

            {skillMap.categories.map((c, i) => (
              <div
                key={c.id}
                className="map__cell"
                style={{ '--x': `${c.x}%`, '--y': `${(c.y / VB_H) * 100}%`, '--i': i }}
              >
                <button
                  type="button"
                  className={`map__node ${active === c.id ? 'is-active' : ''} ${focus.id === c.id ? 'is-focus' : ''}`}
                  aria-pressed={active === c.id}
                  aria-controls="skills-readout"
                  onClick={() => setActive(c.id)}
                  onFocus={() => setActive(c.id)}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(c.id)}
                  onPointerLeave={() => setHover(null)}
                >
                  <span className="mono map__idx">{pad(i + 1)}</span>
                  <span className="map__label">{c.label}</span>
                  <span className="mono map__count">{pad(c.skills.length)}</span>
                </button>

                {/* mobile: technologies unfold inline under the selected category */}
                {active === c.id && (
                  <ul className="map__inline" aria-label={`${c.label} technologies`}>
                    {c.skills.map((s, k) => (
                      <li key={s} style={{ '--k': k }}>
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* desktop: readout panel — technologies are revealed one by one */}
          <aside id="skills-readout" className="readout" aria-live="polite">
            <div key={focus.id} className="readout__inner">
              <p className="eyebrow">{pad(skillMap.categories.indexOf(focus) + 1)} — Category</p>
              <h3 className="display">{focus.label}</h3>
              <p className="mono readout__count">{pad(focus.skills.length)} technologies</p>
              <ul>
                {focus.skills.map((s, k) => (
                  <li key={s} style={{ '--k': k }}>
                    <span className="mono">{pad(k + 1)}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
