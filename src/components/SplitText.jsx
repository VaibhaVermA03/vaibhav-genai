import { memo } from 'react'

/**
 * Splits text into masked word → char spans for rise-from-mask reveals.
 * The visual spans are aria-hidden; screen readers get the full string.
 * Each char exposes --i / --n so CSS can colour-interpolate across the word.
 * Pass `reveal` to opt the element into the line-by-line scroll reveal (data-lines).
 */
function SplitText({ text, as: Tag = 'span', className = '', reveal = false, ...rest }) {
  const words = text.split(' ')
  const total = Math.max(text.replace(/ /g, '').length - 1, 1)
  let idx = 0
  return (
    <Tag className={className} aria-label={text} {...(reveal ? { 'data-lines': '' } : {})} {...rest}>
      <span className="split" aria-hidden="true">
        {words.map((w, wi) => (
          <span key={wi}>
            <span className="word">
              {[...w].map((c, ci) => (
                <span className="char" key={ci} style={{ '--i': idx++, '--n': total }}>
                  {c}
                </span>
              ))}
            </span>
            {wi < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </Tag>
  )
}

export default memo(SplitText)
