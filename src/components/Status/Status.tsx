import './Status.css'

import type { StatusProps } from './Status.types'

/**
 * A static product-state label. Its children must communicate the state
 * without relying on tone or the decorative indicator.
 */
export function Status({ children, className, ref, tone = 'neutral', ...spanProps }: StatusProps) {
  const classes = ['signal-status', className].filter(Boolean).join(' ')

  return (
    <span {...spanProps} ref={ref} className={classes} data-tone={tone}>
      <span aria-hidden="true" className="signal-status__indicator" />
      <span className="signal-status__label">{children}</span>
    </span>
  )
}
