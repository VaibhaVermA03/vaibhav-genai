import { memo, useState } from 'react'
import useCycle from '../../hooks/useCycle'

const NODES = [
  [12, 30], [28, 14], [46, 34], [64, 16], [82, 32],
  [20, 66], [40, 82], [62, 68], [84, 78], [52, 54],
]
const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6],
  [2, 9], [9, 7], [7, 8], [4, 8], [6, 9], [1, 9],
]
const HIT = [2, 9, 7]
const DOCS = ['handbook.pdf', 'security-policy.docx', 'vendor-terms.pdf']
const STAGES = ['Parse', 'Chunk', 'Embed', 'Index']
const RESULTS = [
  { src: 'handbook.pdf', loc: 'p.14', w: '92%' },
  { src: 'security-policy.docx', loc: '§3.2', w: '76%' },
  { src: 'vendor-terms.pdf', loc: 'p.6', w: '48%' },
]

/**
 * ORYN — Knowledge Intelligence. Warm ivory, muted gold, charcoal.
 * Illustrative story: documents slide in and are processed → a question is asked
 * → results reveal one by one → a streamed answer cites its sources (hover a citation).
 */
function OrynMockup() {
  const [ref, s] = useCycle(5, 1250, 3)
  const [cite, setCite] = useState(null)
  const on = (n) => (s >= n ? 'is-on' : '')
  const hot = (n) => (cite === n ? 'is-hot' : '')
  const toggle = (n) => setCite((c) => (c === n ? null : n))

  return (
    <div
      ref={ref}
      className="mk mk--oryn"
      role="img"
      aria-label="Illustrative preview of the ORYN interface: documents being processed, ranked search results, and a streamed answer with source citations."
    >
      <div className="mk__chrome" aria-hidden="true">
        <i /> <i /> <i />
        <span className="mk__url mono">oryn · workspace</span>
      </div>

      <div className="oryn" aria-hidden="true">
        <aside className="oryn__side">
          <div className="brand">
            ORYN<i />
          </div>
          <ul className="pages">
            {DOCS.map((d, i) => (
              <li key={d} className={`page ${on(1)}`} style={{ '--d': i }}>
                <span className="page__sheet">
                  <b /><b /><b />
                </span>
                <span className="page__name">{d}</span>
              </li>
            ))}
          </ul>
          <div className="stages mono">
            {STAGES.map((n, k) => (
              <span key={n} className={s >= k + 1 ? 'is-on' : ''}>
                <em>{n}</em>
                <i />
              </span>
            ))}
          </div>
        </aside>

        <section className="oryn__chat">
          <div className={`bubble bubble--user ${on(2)}`}>What are the rules for contractors working remotely?</div>
          <div className={`bubble bubble--ai ${on(3)}`}>
            Contractors can work remotely with manager approval, and must use company-managed devices whenever they
            access internal systems.
            <span className={`cites ${on(4)}`}>
              <b className={`cite ${hot(1)}`} onPointerEnter={() => setCite(1)} onPointerLeave={() => setCite(null)} onClick={() => toggle(1)}>1</b>
              <b className={`cite ${hot(2)}`} onPointerEnter={() => setCite(2)} onPointerLeave={() => setCite(null)} onClick={() => toggle(2)}>2</b>
            </span>
            {s === 3 && <span className="caret" />}
          </div>
          <div className="oryn__src">
            {[1, 2].map((n) => (
              <div
                key={n}
                className={`src ${on(4)} ${hot(n)}`}
                onPointerEnter={() => setCite(n)}
                onPointerLeave={() => setCite(null)}
                onClick={() => toggle(n)}
              >
                <span className="cite">{n}</span> {RESULTS[n - 1].src} <em className="mono">{RESULTS[n - 1].loc}</em>
              </div>
            ))}
          </div>
          <div className="oryn__input">Ask your documents…</div>
        </section>

        <aside className="oryn__panel">
          <p className="mono panel__title">
            Results <span className={`tag ${on(4)}`}>reranked</span>
          </p>
          <ul className="res">
            {RESULTS.map((r, k) => (
              <li key={r.src} className={`${on(k + 2)} ${cite && cite - 1 === k ? 'is-hot' : ''}`}>
                <span>{r.src}</span>
                <span className="res__bar" style={{ '--w': r.w }}><i /></span>
              </li>
            ))}
          </ul>
          <svg className="kmap" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {EDGES.map(([a, b], i) => (
              <line key={i} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} />
            ))}
            {NODES.map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={HIT.includes(i) ? 3.4 : 2.2}
                style={{ '--n': i }}
                className={HIT.includes(i) && s >= 3 ? 'hit' : ''}
              />
            ))}
          </svg>
        </aside>
      </div>
    </div>
  )
}

export default memo(OrynMockup)
