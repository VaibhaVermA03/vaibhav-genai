// A tiny synthesized "swell" so no audio asset is needed. Only plays when
// the visitor explicitly turns sound on (OFF by default).
let ctx

export function playIntroSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    ctx = ctx || new AC()
    if (ctx.state === 'suspended') ctx.resume()
    const t = ctx.currentTime
    const master = ctx.createGain()
    master.gain.setValueAtTime(0.0001, t)
    master.gain.exponentialRampToValueAtTime(0.14, t + 1.3)
    master.gain.exponentialRampToValueAtTime(0.0001, t + 3.6)
    master.connect(ctx.destination)
    ;[55, 110, 164.81, 220].forEach((f, i) => {
      const osc = ctx.createOscillator()
      osc.type = i % 2 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(f, t)
      osc.frequency.exponentialRampToValueAtTime(f * 1.5, t + 3)
      const g = ctx.createGain()
      g.gain.value = 0.28 / (i + 1)
      osc.connect(g)
      g.connect(master)
      osc.start(t)
      osc.stop(t + 3.7)
    })
  } catch {
    /* audio is optional */
  }
}
