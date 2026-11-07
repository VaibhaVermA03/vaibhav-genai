# Vaibhav Verma — Generative AI Engineer Portfolio

An immersive, cinematic portfolio built with **React + Vite**, **GSAP + Lenis**, **React Three Fiber**, and **Framer Motion**.

> *"I don't just use AI. I build intelligent systems."*

## Features

- Cinematic ~3 s intro (vertical line → horizontal expand, clip-path name reveal, tagline) — **Skip** button / `Esc`, sound **off** by default, shown once per browser session
- 3D hero: slow-rotating procedural dark-metal sculpture with restrained orange light, subtle parallax, scale/fade on scroll; CSS fallback when WebGL is unavailable
- About, interactive Skills constellation, "My World of Intelligence" network, Experience timeline, Education, Contact
- Three product-style project showcases (ORYN, NEXIS, SYNAXYS), each with its own visual identity and an animated custom UI mockup
- Lenis smooth scroll, GSAP ScrollTrigger reveals, premium navbar with mobile overlay, footer, 404 page
- Respects `prefers-reduced-motion`; semantic HTML, keyboard-accessible, SEO + Open Graph metadata, JSON-LD

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the production build locally
```

Requires Node 18+.

## Where to edit things

Everything personal lives in **one file: `src/config/site.js`**

| What | Where |
| --- | --- |
| Name, email, location, social links | `site` object |
| Project GitHub / live URLs | `projects[].repo` and `projects[].live` |
| Experience & education | `experience`, `education` |
| Skills, focus areas, network nodes | `src/data/skills.js` |
| Resume | replace `public/Vaibhav_Verma_Resume.pdf` (keep the filename) |
| Social preview image | replace `public/og.png` (1200×630) |

If a project's `repo` or `live` is set to `''`, that button automatically becomes a disabled "coming soon" button — never a dead link.

> **Resume note:** the included `public/Vaibhav_Verma_Resume.pdf` is a one-page placeholder generated from the data already on the site. Replace it with your real resume PDF using the same filename.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repository.
3. Framework preset: **Vite** (auto-detected). Build command `npm run build`, output directory `dist`.
4. Deploy. `vercel.json` already rewrites unknown routes to `index.html` (so the custom 404 page works) and sets long-term caching for hashed assets.

Or with the CLI: `npm i -g vercel && vercel --prod`.

**After deploying**, make the social preview absolute: in `index.html` change `/og.png` (two places: `og:image`, `twitter:image`) to `https://YOUR-DOMAIN/og.png`.

## Project structure

```
src/
├─ config/site.js        ← all personal info + project links
├─ data/skills.js        ← skills, focus areas, network graph
├─ hooks/                ← Lenis, scroll reveals, tilt/magnetic, reduced-motion, mockup cycles
├─ lib/                  ← gsap setup, scroll helpers, WebGL check, intro sound
├─ components/
│  ├─ Intro, Navbar, Hero (+ HeroScene — lazy three.js chunk)
│  ├─ About, Skills, Projects (+ mockups/), World, Experience, Education, Contact, Footer, NotFound
│  └─ Button, SplitText, SectionHead, Cursor, ErrorBoundary
└─ styles/base.css       ← design tokens + global styles (component CSS sits beside each component)
```

## Performance notes

- three.js / R3F ship as a separate chunk, loaded only when WebGL is available and motion isn't reduced
- Render loop pauses when the hero is off-screen; DPR is capped; effects are reduced on small screens
- All GSAP work runs inside `gsap.context` and is cleaned up on unmount

## Tech

React 18 · Vite 5 · GSAP 3 (ScrollTrigger) · Lenis · three.js + @react-three/fiber · Framer Motion · Lucide React · plain modern CSS
