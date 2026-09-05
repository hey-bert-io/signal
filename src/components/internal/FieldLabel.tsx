import './Field.css'

import type { ReactNode } from 'react'

interface FieldLabelProps {
  children: ReactNode
  hideLabel?: boolean
  htmlFor: string
  optional?: boolean
}

export function FieldLabel({ children, hideLabel = false, htmlFor, optional = false }: FieldLabelProps) {
  return (
    <div className={`signal-field-label${hideLabel ? ' signal-field-label--hidden' : ''}`}>
      <label className="signal-field-label__text" htmlFor={htmlFor}>{children}</label>
      {optional ? <span aria-hidden="true" className="signal-field-label__optional">Optional</span> : null}
    </div>
  )
}
