# Hero: 3D sculpture → looping "idea → live product" animation

## Replace these files (same paths in your project)
- `src/components/Hero.jsx`
- `src/components/hero.css`

## Add these new files
- `src/components/HeroAnimation.jsx`
- `src/components/heroAnimation.css`

## Delete (optional but recommended)
- `src/components/HeroScene.jsx` — the old Three.js sculpture. Nothing imports it anymore.

## Dependencies / config
- No new dependencies. Nothing else to configure.
- Optional cleanup: `three`, `@react-three/fiber` and `src/lib/webgl.js` are no longer used by the hero
  (`npm uninstall three @react-three/fiber` shrinks the install; the bundle already excludes them).

## Notes
- Animation: 8 stages (Idea, Plan, Design, Code, Build, Test, Deploy, Live), ~28 s per loop, then it wraps back to Idea.
- Pauses and resets when the hero is off-screen or the tab is hidden. Reduced motion shows the finished "Live" frame, static.
- Below 1100px width the illustration sits in the flow above the headline (instead of beside it), so on phones the CTA buttons move a little lower than before.
