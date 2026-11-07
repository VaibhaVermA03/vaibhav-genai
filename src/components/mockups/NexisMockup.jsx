import { memo } from 'react'
import useCycle from '../../hooks/useCycle'

const H = 62 // flow viewBox is 100 × 62 (uniform scaling → lines can draw with pathLength)
const NODES = [
  { label: 'Trigger', x: 14, y: 31, idle: 'queued', run: 'running', done: 'received' },
  { label: 'Agent', x: 38, y: 31, idle: 'queued', run: 'planning', done: 'done' },
  { label: 'REST tool', x: 62, y: 13, idle: 'queued', run: 'calling', done: 'done' },
  { label: 'Approval', x: 62, y: 49, idle: 'queued', run: 'awaiting', done: 'approved' },
  { label: 'Result', x: 86, y: 31, idle: 'queued', run: 'writing', done: 'delivered' },
]
const LINKS = [[0, 1], [1, 2], [2, 3], [3, 4]]
const LOG = [
  { at: 1, tag: 'run.started', msg: 'Trigger received' },
  { at: 2, tag: 'agent.plan', msg: '3 steps planned' },
  { at: 3, tag: 'tool.call', msg: 'get_orders → REST tool' },
  { at: 4, tag: 'approval.required', msg: 'Waiting for human' },
  { at: 5, tag: 'approval.granted', msg: 'Tool call approved' },
  { at: 6, tag: 'run.completed', msg: 'Result delivered' },
]

const stateOf = (s, i) => (s > i + 1 ? 'done' : s === i + 1 ? 'run' : 'idle')

/**
 * NEXIS — Autonomous Systems. Deep forest, sage, muted lime.
 * Nodes activate in sequence, connections draw as work flows along them,
 * execution states change smoothly and status dots breathe.
 */
function NexisMockup() {
  const [ref, s] = useCycle(6, 1200, 3)
  const run = s === 0 ? 'idle' : s >= 6 ? 'completed' : s === 4 ? 'awaiting approval' : 'running'

  return (
    <div
      ref={ref}
      className="mk mk--nexis"
      role="img"
      aria-label="Illustrative preview of the NEXIS interface: an agent workflow graph whose nodes activate in sequence, with a live execution log and an approval step."
    >
      <div className="mk__chrome" aria-hidden="true">
        <i /> <i /> <i />
        <span className="mk__url mono">nexis · workflow run</span>
      </div>

      <div className="nexis" aria-hidden="true">
        <div className="flow">
          <span className={`runstate mono is-${run.replace(' ', '-')}`}>
            <i /> {run}
          </span>
          <svg viewBox={`0 0 100 ${H}`}>
            {LINKS.map(([a, b], i) => (
              <g key={i}>
                <line x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} className="track" />
                <line
                  x1={NODES[a].x}
                  y1={NODES[a].y}
                  x2={NODES[b].x}
                  y2={NODES[b].y}
                  pathLength="1"
                  className={`wire ${s >= i + 1 ? 'is-drawn' : ''}`}
                />
              </g>
            ))}
          </svg>
          {NODES.map((n, i) => {
            const st = stateOf(s, i)
            return (
              <div key={n.label} className={`fnode is-${st}`} style={{ left: `${n.x}%`, top: `${(n.y / H) * 100}%` }}>
                <b>{n.label}</b>
                <small className="mono">
                  <i /> {n[st]}
                </small>
              </div>
            )
          })}
        </div>

        <div className="log">
          <p className="mono log__title">
            Live execution <span className="live">● SSE</span>
          </p>
          {LOG.map((l) => (
            <div key={l.tag} className={`log__row ${s >= l.at ? 'is-on' : ''}`}>
              <span className="mono tag">{l.tag}</span>
              <span>{l.msg}</span>
            </div>
          ))}
          <div className={`approve ${s === 4 ? 'is-wait' : s >= 5 ? 'is-on' : ''}`}>
            {s >= 5 ? '✓ Tool call approved' : s === 4 ? 'Approve tool call' : 'Approval gate'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(NexisMockup)
