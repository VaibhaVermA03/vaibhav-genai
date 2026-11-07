import SplitText from './SplitText'

export default function SectionHead({ index, label, title, children, wide = false, id }) {
  return (
    <header className={`section-head ${wide ? 'section-head--wide' : ''}`}>
      <p className="eyebrow" data-fade>
        {index} — {label}
      </p>
      <SplitText as="h2" className="display" text={title} reveal id={id} />
      {children}
    </header>
  )
}
