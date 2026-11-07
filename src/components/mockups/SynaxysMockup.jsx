import { memo, useState } from 'react'
import useCycle from '../../hooks/useCycle'

const DIFF = [
  { n: 38, t: 'ctx', c: 'def get_user(conn, email):' },
  { n: 39, t: 'del', c: '    q = "SELECT * FROM users WHERE email = ?"' },
  { n: 39, t: 'add', c: '    q = f"SELECT * FROM users WHERE email = \'{email}\'"', flag: 1 },
  { n: 40, t: 'add', c: '    return conn.execute(q).fetchone()' },
  { n: 41, t: 'ctx', c: '' },
  { n: 42, t: 'ctx', c: 'def fetch_profile(client, uid):' },
  { n: 43, t: 'add', c: '    return client.get(f"/profiles/{uid}").json()', flag: 2 },
]
const FINDINGS = [
  { id: 1, sev: 'high', label: 'HIGH', conf: 'high confidence', title: 'SQL built from user input', ref: 'profiles.py:39', bars: 3, at: 8 },
  { id: 2, sev: 'med', label: 'MEDIUM', conf: 'medium confidence', title: 'External call has no error handling', ref: 'profiles.py:43', bars: 2, at: 9 },
]

/**
 * SYNAXYS — Code Intelligence. Graphite, silver, signal red.
 * The diff types in like a terminal, additions/deletions highlight progressively,
 * findings reveal with animated severity meters, and a human approves before publishing.
 * Hover a finding to light up its line (and vice-versa).
 */
function SynaxysMockup() {
  const [ref, s] = useCycle(11, 650, 4)
  const [hot, setHot] = useState(null)
  const count = s >= 9 ? 2 : s >= 8 ? 1 : 0

  return (
    <div
      ref={ref}
      className="mk mk--syn"
      role="img"
      aria-label="Illustrative preview of the SYNAXYS interface: a pull request diff that types in, flagged lines, findings with severity and confidence, and a human approval step before publishing to GitHub."
    >
      <div className="mk__chrome" aria-hidden="true">
        <i /> <i /> <i />
        <span className="mk__url mono">feat/profile-lookup → main</span>
      </div>

      <div className="syn" aria-hidden="true">
        <div className="syn__code mono">
          <div className="syn__file">
            src/profiles.py <span className={`caretline ${s > 0 && s < 8 ? 'is-on' : ''}`}>▍</span>
          </div>
          {DIFF.map((l, i) => {
            const shown = s >= i + 1
            const diff = s >= i + 2
            const flagged = l.flag && s >= 7 + l.flag
            return (
              <div
                key={i}
                className={`ln ln--${diff ? l.t : 'ctx'} ${shown ? 'is-on' : ''} ${flagged ? 'is-flag' : ''} ${
                  hot && l.flag === hot ? 'is-hot' : ''
                }`}
                onPointerEnter={() => l.flag && setHot(l.flag)}
                onPointerLeave={() => setHot(null)}
              >
                <span className="ln__n">{l.n}</span>
                <span className="ln__m">{diff && l.t === 'add' ? '+' : diff && l.t === 'del' ? '−' : ''}</span>
                <span className="ln__c">{l.c}</span>
              </div>
            )
          })}
        </div>

        <div className="syn__side">
          <p className="mono side__title">
            AI review <span className="count">{count} findings</span>
          </p>

          {FINDINGS.map((f) => (
            <div
              key={f.id}
              className={`finding ${s >= f.at ? 'is-on' : ''} ${hot === f.id ? 'is-hot' : ''}`}
              onPointerEnter={() => setHot(f.id)}
              onPointerLeave={() => setHot(null)}
            >
              <div className="finding__top">
                <span className={`sev sev--${f.sev}`}>
                  <i /> {f.label}
                </span>
                <span className="meter" style={{ '--bars': f.bars }}>
                  <i /><i /><i />
                </span>
              </div>
              <p>{f.title}</p>
              <span className="mono ref">
                {f.ref} · {f.conf}
              </span>
            </div>
          ))}

          <div className={`publish ${s === 10 ? 'is-wait' : s >= 11 ? 'is-on' : ''}`}>
            {s >= 11 ? '✓ Approved · comments published' : s === 10 ? 'Approve & publish to GitHub' : 'Awaiting human review'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(SynaxysMockup)
