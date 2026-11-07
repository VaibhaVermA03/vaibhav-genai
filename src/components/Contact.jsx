import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, Github, Linkedin } from 'lucide-react'
import { site } from '../config/site'
import SplitText from './SplitText'
import Button from './Button'
import './contact.css'

const MAILTO = `mailto:${site.email}?subject=${encodeURIComponent('Hello Vaibhav')}`

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
    } catch {
      // clipboard API unavailable (http / old browsers): legacy fallback
      const ta = document.createElement('textarea')
      ta.value = site.email
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } catch {
        /* nothing else to try */
      }
      ta.remove()
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container contact__inner">
        <p className="eyebrow" data-fade>
          07 — Contact
        </p>

        <h2 id="contact-title" className="contact__title display" aria-label="Have an idea? Let's make it intelligent.">
          <SplitText as="span" className="contact__line" text="Have an idea?" reveal />
          <SplitText as="span" className="contact__line contact__line--mid" text="Let's make it" reveal />
          <SplitText as="span" className="contact__line contact__line--outline" text="intelligent." reveal />
        </h2>

        <div className="contact__mail" data-mask data-delay="0.1">
          <a className="contact__email" href={MAILTO}>
            {site.email}
          </a>
          <button type="button" className="icon-btn" onClick={copy} aria-label={copied ? 'Email copied' : 'Copy email address'}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
          <span className="sr-only" role="status">
            {copied ? 'Email address copied to clipboard' : ''}
          </span>
        </div>

        <div className="contact__cta" data-mask data-delay="0.2">
          <Button href={MAILTO} icon={<ArrowUpRight size={18} />}>
            Send me an email
          </Button>
          <Button href={site.social.linkedin} external variant="ghost" icon={<Linkedin size={17} />}>
            LinkedIn
          </Button>
          <Button href={site.social.github} external variant="ghost" icon={<Github size={17} />}>
            GitHub
          </Button>
        </div>
      </div>
    </section>
  )
}
