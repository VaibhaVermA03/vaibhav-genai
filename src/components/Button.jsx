import { useRef } from 'react'
import { useMagnetic } from '../hooks/useTilt'

/**
 * One button for the whole site.
 * - href  → <a>   (external links get target/rel automatically)
 * - else  → <button>
 * - an empty href (or `pending`) renders a disabled "coming soon" state
 *   instead of a dead link.
 * The icon is rendered twice so it can slide out and a copy can slide in.
 */
export default function Button({
  href,
  onClick,
  variant = 'primary',
  size,
  icon,
  external = false,
  download,
  pending = false,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null)
  const disabled = pending || (href !== undefined && !href)
  useMagnetic(ref, { disabled, strength: 0.22 })

  const cls = ['btn', `btn--${variant}`, size ? `btn--${size}` : '', disabled ? 'is-disabled' : '', className]
    .filter(Boolean)
    .join(' ')

  const inner = (
    <>
      <span className="btn__label">{children}</span>
      {icon ? (
        <span className="btn__icon" aria-hidden="true">
          <span>{icon}</span>
          <span>{icon}</span>
        </span>
      ) : null}
    </>
  )

  if (disabled) {
    return (
      <span ref={ref} className={cls} aria-disabled="true" title="Link coming soon">
        {inner}
      </span>
    )
  }
  if (href) {
    return (
      <a
        ref={ref}
        className={cls}
        href={href}
        download={download}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        onClick={onClick}
        {...rest}
      >
        {inner}
      </a>
    )
  }
  return (
    <button ref={ref} type="button" className={cls} onClick={onClick} {...rest}>
      {inner}
    </button>
  )
}
