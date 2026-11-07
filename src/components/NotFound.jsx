import { useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Button from './Button'
import './contact.css'

export default function NotFound() {
  useEffect(() => {
    const prev = document.title
    document.title = '404 — Page not found · Vaibhav Verma'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => {
      document.title = prev
      meta.remove()
    }
  }, [])

  return (
    <main className="nf">
      <div className="nf__inner">
        <p className="nf__code" aria-hidden="true">
          404
        </p>
        <h1>This node isn&apos;t in the graph.</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back to something intelligent.</p>
        <Button href="/" icon={<ArrowUpRight size={18} />}>
          Back to home
        </Button>
      </div>
    </main>
  )
}
