import type { ReactNode } from 'react'

interface FieldMessageProps {
  children: ReactNode
  error?: boolean
  id: string
}

export function FieldMessage({ children, error = false, id }: FieldMessageProps) {
  return (
    <div className="signal-field-message" data-error={error || undefined} id={id}>
      {error ? (
        <svg aria-hidden="true" className="signal-field-message__error-icon" fill="none" viewBox="0 0 24 24">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
          <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        </svg>
      ) : null}
      {error ? <span>{children}</span> : children}
    </div>
  )
}
