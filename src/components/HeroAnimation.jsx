import { memo, useEffect, useRef, useState } from 'react'
import { Check, Database, GitMerge, Lightbulb, Lock, Monitor, Rocket, Server } from 'lucide-react'
import './heroAnimation.css'

/**
 * A looping "idea → live product" storyboard. Pure DOM + SVG + CSS:
 *
 *   one tiny state machine (JS) picks the active stage; everything inside a stage
 *   (typing code, drawing lines, ticking tests, travelling data) is CSS keyframes
 *   that restart whenever the stage becomes active. No canvas, no WebGL, no video.
 *
 * Pauses (and resets to the first stage) when the hero is off-screen or the tab is hidden.
 * Reduced motion renders the finished product as a single static frame.
 */

const STAGES = [
  { id: 'idea', label: 'Idea', ms: 2800 },
  { id: 'plan', label: 'Plan', ms: 3000 },
  { id: 'design', label: 'Design', ms: 3400 },
  { id: 'code', label: 'Code', ms: 5400 },
  { id: 'build', label: 'Build', ms: 3600 },
  { id: 'test', label: 'Test', ms: 3600 },
  { id: 'deploy', label: 'Deploy', ms: 3400 },
  { id: 'live', label: 'Live', ms: 3400 },
]
const N = STAGES.length
const LAST = N - 1

/* code lines: [indent, length(ch), tokens] — kinds: k keyword · f function · s string · m muted · p punct · t text */
const CODE = [
  [0, 38, [['k', 'import'], ['t', ' { useState } '], ['k', 'from'], ['s', " 'react'"]]],
  [0, 0, []],
  [0, 31, [['k', 'export default function'], ['f', ' Ask'], ['p', '() {']]],
  [1, 29, [['k', 'const'], ['t', ' [q, setQ] = '], ['f', 'useState'], ['p', "('')"]]],
  [1, 27, [['k', 'const'], ['f', ' ask'], ['t', ' = '], ['k', 'async'], ['p', ' () => {']]],
  [2, 34, [['k', 'const'], ['t', ' res = '], ['k', 'await'], ['f', ' fetch'], ['p', '(']]],
  [3, 22, [['s', "'/api/ask'"], ['p', ', { '], ['t', 'body: q'], ['p', ' })']]],
  [1, 4, [['p', '}']]],
  [1, 38, [['m', '// answer with cited sources']]],
]

// lines type one after another (15ms per character)
const CODE_DELAYS = CODE.reduce((acc, [, ch]) => {
  const t = acc.length ? acc[acc.length - 1].next : 0.3
  acc.push({ at: t, next: t + ch * 0.015 + 0.08 })
  return acc
}, [])

const TERM = [
  [['m', '$ '], ['t', 'npm create vite@latest']],
  [['m', '$ '], ['t', 'npm install']],
  [['a', '✓ '], ['t', '148 packages ready']],
  [['m', '$ '], ['t', 'npm run dev']],
  [['a', '➜ '], ['t', 'localhost:5173 · 312 ms']],
]

const PLAN = ['Define scope', 'Design data model', 'Agree API contract', 'Ship v1']
const TESTS = ['renders the interface', 'POST /api/ask → 200', 'retrieves relevant context', 'protects private routes', 'production build passes']
const COMMITS = [
  ['feat: interface', 'a3f9c2e'],
  ['feat: api + data', '7d1b04a'],
  ['test: add suite', 'c85e91f'],
]
const PIPE = ['Build', 'Optimise', 'Upload', 'Go live']
const WIRE = [
  ['#f0ede5', 0.36, 5, 6],
  ['#d97745', 0.55, 20, 7],
  ['#f0ede5', 0.18, 6, 7],
  ['#f0ede5', 0.18, 12, 8],
  ['#d97745', 0.5, 6, 7],
]

function Tokens({ list }) {
  return list.map(([k, t], i) => (
    <span key={i} className={`ha-t ha-t--${k}`}>
      {t}
    </span>
  ))
}

/** The miniature product: wireframe-grey while deploying, polished once live. */
function Site({ state }) {
  return (
    <div className={`ha-site ${state}`}>
      <div className="ha-win">
        <div className="ha-win__bar">
          <i /> <i /> <i />
          <span className="ha-win__url">
            <Lock size={8} /> docs-assistant.app
          </span>
        </div>
        <div className="ha-win__body">
          <div className="ha-site__nav">
            <b>
              <i /> Orbit
            </b>
            <span />
            <span />
            <span />
            <em>Sign in</em>
          </div>
          <div className="ha-site__hero">
            <div>
              <h5>
                Ask your docs.
                <br />
                <span>Get real answers.</span>
              </h5>
              <p>Cited answers from every file your team keeps.</p>
              <div className="ha-site__cta">
                <em>Get started</em>
                <u>Live demo</u>
              </div>
            </div>
            <div className="ha-chat">
              <p className="ha-chat__q">What is our refund policy?</p>
              <p className="ha-chat__a">
                Refunds are issued within 14 days. <b>1</b>
              </p>
              <span className="ha-chat__src">policy.pdf · p.4</span>
            </div>
          </div>
          <div className="ha-site__feats">
            {['Instant search', 'Cited answers', 'Private by default'].map((f) => (
              <div key={f}>
                <i />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function HeroAnimation({ active = true, reduced = false }) {
  const [s, setS] = useState(reduced ? LAST : 0)
  const [prev, setPrev] = useState(-1)
  const [visible, setVisible] = useState(() => (typeof document === 'undefined' ? true : !document.hidden))
  const ref = useRef(null)
  const run = active && visible && !reduced

  useEffect(() => {
    const on = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])

  // stage machine
  useEffect(() => {
    if (reduced) {
      setS(LAST)
      setPrev(-1)
      return undefined
    }
    if (!run) {
      setS(0)
      setPrev(-1)
      return undefined
    }
    const id = setTimeout(() => {
      setPrev(s)
      setS((s + 1) % N)
    }, STAGES[s].ms)
    return () => clearTimeout(id)
  }, [run, s, reduced])

  // gentle pointer parallax (fine pointers only)
  useEffect(() => {
    const el = ref.current
    if (!run || !el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let raf = 0
    const tick = () => {
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      el.style.setProperty('--px', cx.toFixed(3))
      el.style.setProperty('--py', cy.toFixed(3))
      raf = Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(tick) : 0
    }
    const move = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [run])

  const cls = (i) => (i === s ? 'is-active' : i === prev ? 'is-prev' : '')
  const siteState = s === 6 ? 'is-deploy' : s === 7 ? 'is-live' : prev === LAST ? 'is-out' : ''

  return (
    <div
      ref={ref}
      className={`ha ${reduced ? 'is-static' : ''} ${!run && !reduced ? 'is-paused' : ''}`}
      data-stage={STAGES[s].id}
    >
      <div className="ha__in">
        <div className="ha-dots" />
        <div className="ha-ghost ha-ghost--a ha-px1" />
        <div className="ha-ghost ha-ghost--b ha-px1" />

        <div className="ha-hud">
          <span>
            <i /> my-project
          </span>
          <span key={s} className="ha-hud__stage">
            {String(s + 1).padStart(2, '0')} / {String(N).padStart(2, '0')} · {STAGES[s].label}
          </span>
        </div>

        <div className="ha-stage">
          {/* ───── 1 · IDEA ───── */}
          <section className={`ha-sc ha-sc--idea ${cls(0)}`}>
            <div className="ha-idea ha-px2">
              <div className="ha-card__top">
                <Lightbulb size={11} /> New idea <em>#001</em>
              </div>
              <h4>
                <span>Document Q&amp;A for teams</span>
              </h4>
              <p>Ask questions across every document — and get answers with sources.</p>
              <ul className="ha-tags">
                <li>RAG</li>
                <li>React</li>
                <li>API</li>
              </ul>
              <svg className="ha-doodle" viewBox="0 0 560 30" aria-hidden="true">
                <path pathLength="1" d="M6 20 C 90 2, 150 30, 230 14 S 380 2, 440 18 S 540 26, 554 8" />
              </svg>
            </div>
            <div className="ha-note ha-px3">
              users <b>→</b> ask <b>→</b> answers
            </div>
            <div className="ha-spark ha-px3" />
          </section>

          {/* ───── 2 · PLAN ───── */}
          <section className={`ha-sc ha-sc--plan ${cls(1)}`}>
            <div className="ha-pin ha-px3">
              <Lightbulb size={10} /> Document Q&amp;A
            </div>
            <div className="ha-road ha-px2">
              <div className="ha-card__top">Roadmap</div>
              <ul>
                {PLAN.map((p, i) => (
                  <li key={p} style={{ '--d': `${0.5 + i * 0.5}s` }}>
                    <span className="ha-box">
                      <Check size={9} strokeWidth={3} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <div className="ha-line">
                <i />
                {[0, 1, 2, 3].map((n) => (
                  <b key={n} style={{ '--d': `${0.5 + n * 0.5}s`, left: `${n * 33.3}%` }} />
                ))}
              </div>
            </div>
          </section>

          {/* ───── 3 · DESIGN ───── */}
          <section className={`ha-sc ha-sc--design ${cls(2)}`}>
            <div className="ha-win ha-wf ha-px2">
              <div className="ha-win__bar">
                <i /> <i /> <i />
                <span className="ha-win__url">wireframe</span>
              </div>
              <div className="ha-wf__body">
                {[
                  ['nav', 0.2],
                  ['title', 0.6],
                  ['text', 0.9],
                  ['btn', 1.2],
                  ['img', 1.0],
                  ['c1', 1.6],
                  ['c2', 1.8],
                  ['c3', 2.0],
                ].map(([k, d]) => (
                  <div key={k} className={`ha-b ha-b--${k}`} style={{ '--d': `${d}s` }} />
                ))}
                <div className="ha-sel" />
              </div>
            </div>
            <div className="ha-pal ha-px3">
              {['#10100f', '#1c1b19', '#f0ede5', '#d97745', '#a6a096'].map((c, i) => (
                <i key={c} style={{ background: c, '--d': `${1.2 + i * 0.15}s` }} />
              ))}
              <span>Aa</span>
            </div>
          </section>

          {/* ───── 4 · CODE ───── */}
          <section className={`ha-sc ha-sc--code ${cls(3)}`}>
            <div className="ha-ed ha-px2">
              <div className="ha-ed__tabs">
                <span className="is-on">Ask.jsx</span>
                <span>api.js</span>
                <span>index.css</span>
              </div>
              <pre className="ha-ed__code" aria-hidden="true">
                {CODE.map(([ind, ch, toks], i) => (
                  <div key={i} className="ha-ln" style={{ '--i': i, '--ind': ind, '--ch': ch, '--d': `${CODE_DELAYS[i].at.toFixed(2)}s` }}>
                    <span className="ha-ln__n">{i + 1}</span>
                    <span className="ha-ln__c">
                      <span className="ha-ln__t">
                        <Tokens list={toks} />
                      </span>
                    </span>
                  </div>
                ))}
              </pre>
            </div>
            <div className="ha-term ha-px3">
              <div className="ha-term__bar">terminal</div>
              {TERM.map((line, i) => (
                <p key={i} style={{ '--d': `${2.0 + i * 0.55}s` }}>
                  <Tokens list={line} />
                </p>
              ))}
            </div>
          </section>

          {/* ───── 5 · BUILD ───── */}
          <section className={`ha-sc ha-sc--build ${cls(4)}`}>
            <svg className="ha-wires" viewBox="0 0 100 70" aria-hidden="true">
              <rect className="ha-sys" x="4" y="6" width="92" height="58" rx="3" pathLength="1" />
              <g className="ha-lines">
                <line x1="21" y1="24" x2="75" y2="24" pathLength="1" style={{ '--d': '1.3s' }} />
                <line x1="75" y1="24" x2="48" y2="54" pathLength="1" style={{ '--d': '1.6s' }} />
                <line x1="48" y1="54" x2="21" y2="24" pathLength="1" style={{ '--d': '1.9s' }} />
              </g>
              <g className="ha-dots-travel">
                <circle cx="21" cy="24" r="0.9" style={{ '--dx': '54px', '--dy': '0px', '--d': '2.3s' }} />
                <circle cx="75" cy="24" r="0.9" style={{ '--dx': '-54px', '--dy': '0px', '--d': '3.0s' }} />
                <circle cx="75" cy="24" r="0.9" style={{ '--dx': '-27px', '--dy': '30px', '--d': '2.6s' }} />
                <circle cx="48" cy="54" r="0.9" style={{ '--dx': '-27px', '--dy': '-30px', '--d': '2.9s' }} />
                <circle cx="48" cy="54" r="0.9" style={{ '--dx': '27px', '--dy': '-30px', '--d': '3.2s' }} />
              </g>
            </svg>
            {[
              ['fe', Monitor, 'Frontend', 'React UI', '21%', '34.3%', '0s'],
              ['be', Server, 'Backend', 'REST API', '75%', '34.3%', '0.4s'],
              ['db', Database, 'Database', 'Postgres', '48%', '77.1%', '0.8s'],
            ].map(([k, Icon, name, sub, x, y, d]) => (
              <div key={k} className={`ha-node ha-node--${k} ha-px2`} style={{ left: x, top: y, '--d': d }}>
                <Icon size={13} />
                <div>
                  <b>{name}</b>
                  <small>{sub}</small>
                </div>
              </div>
            ))}
            <span className="ha-chip ha-chip--sys">● one connected system</span>
          </section>

          {/* ───── 6 · TEST ───── */}
          <section className={`ha-sc ha-sc--test ${cls(5)}`}>
            <div className="ha-tests ha-px2">
              <div className="ha-card__top">
                Test suite <em className="ha-pass">5 / 5 passed</em>
              </div>
              <ul>
                {TESTS.map((t, i) => (
                  <li key={t} style={{ '--d': `${0.7 + i * 0.5}s` }}>
                    <span className="ha-ring">
                      <i className="ha-run" />
                      <Check size={9} strokeWidth={3} className="ha-ck" />
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="ha-meter">
                <i />
              </div>
            </div>
            <div className="ha-git ha-px3">
              <div className="ha-card__top">
                <span className="ha-branch">main</span>
              </div>
              <ul>
                {COMMITS.map(([m, h], i) => (
                  <li key={h} style={{ '--d': `${0.5 + i * 0.6}s` }}>
                    <i />
                    <span>{m}</span>
                    <em>{h}</em>
                  </li>
                ))}
                <li className="ha-git__merge" style={{ '--d': '2.4s' }}>
                  <GitMerge size={11} />
                  <span>merge: feature/rag</span>
                </li>
              </ul>
            </div>
          </section>

          {/* ───── 7 · DEPLOY (the product sits behind) ───── */}
          <section className={`ha-sc ha-sc--deploy ${cls(6)}`}>
            <div className="ha-pipe ha-px3">
              <div className="ha-card__top">
                <Rocket size={11} /> Deploying to production
              </div>
              <ul>
                {PIPE.map((p, i) => (
                  <li key={p} style={{ '--d': `${0.5 + i * 0.6}s` }}>
                    <span className="ha-ring">
                      <i className="ha-run" />
                      <Check size={9} strokeWidth={3} className="ha-ck" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <div className="ha-meter ha-meter--deploy">
                <i />
              </div>
            </div>
          </section>

          {/* ───── 8 · LIVE ───── */}
          <section className={`ha-sc ha-sc--live ${cls(7)}`}>
            <div className="ha-badge ha-px3">
              <Check size={11} strokeWidth={3} /> Deployed successfully
            </div>
            <div className="ha-trail ha-px3">Idea → Live</div>
          </section>

          {/* persistent product preview shared by Deploy → Live → (fades back to Idea) */}
          <div className={`ha-product ha-px2 ${siteState}`}>
            <Site state={siteState} />
          </div>
        </div>

        <div className="ha-rail" aria-hidden="true">
          {STAGES.map((st, i) => (
            <div
              key={st.id}
              className={`ha-seg ${i === s ? 'is-active' : i < s ? 'is-done' : ''}`}
              style={{ '--dur': `${st.ms}ms` }}
            >
              <span className="ha-seg__l">{st.label}</span>
              <span className="ha-seg__bar">
                <i />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(HeroAnimation)
