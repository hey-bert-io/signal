import './CountBadge.css'

import { forwardRef } from 'react'

import type { CountBadgeProps } from './CountBadge.types'

/** A compact, noninteractive quantity indicator used alongside contextual UI labels. */
export const CountBadge = forwardRef<HTMLSpanElement, CountBadgeProps>(function CountBadge(
  { children, className, ...spanProps },
  ref,
) {
  const classes = ['signal-count-badge', className].filter(Boolean).join(' ')

  return (
    <span {...spanProps} ref={ref} className={classes}>
      {children}
    </span>
  )
})
