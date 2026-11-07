import { ArrowUp } from 'lucide-react'
import { navItems, site } from '../config/site'
import { scrollToId, scrollToTop } from '../lib/scroll'
import SplitText from './SplitText'
import './footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cols">
          <div className="footer__col footer__col--intro" data-mask>
            <p className="eyebrow">{site.role}</p>
            <p className="footer__lede">Building intelligent systems — turning complex ideas into reality.</p>
          </div>

          <nav className="footer__col" aria-label="Footer navigation" data-mask data-delay="0.05">
            <h2 className="mono">Navigate</h2>
            <ul>
              {navItems.map((n) => (
                <li key={n.id}>
                  <a
                    className="u-link"
                    href={`#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToId(n.id)
                    }}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col" data-mask data-delay="0.1">
            <h2 className="mono">Elsewhere</h2>
            <ul>
              <li>
                <a className="u-link" href={site.social.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a className="u-link" href={site.social.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a className="u-link" href={site.resumeUrl} download={site.resumeFileName}>
                  Resume
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__col" data-mask data-delay="0.15">
            <h2 className="mono">Contact</h2>
            <ul>
              <li>
                <a className="u-link footer__mail" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </li>
              <li>
                <span className="footer__loc">{site.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__rule" data-line aria-hidden="true" />

        <div className="footer__mark" aria-label={site.name}>
          <SplitText text="VAIBHAV VERMA" className="footer__wordmark" reveal />
          <span className="footer__dot" aria-hidden="true" />
        </div>

        <div className="footer__bottom">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <button type="button" className="totop" onClick={scrollToTop}>
            Back to top
            <span className="totop__arrow" aria-hidden="true">
              <ArrowUp size={16} />
              <ArrowUp size={16} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}
