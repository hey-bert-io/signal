import './Card.css'

import { createElement } from 'react'

import type { CardProps } from './Card.types'

/**
 * A non-interactive structural surface. Its children own their layout,
 * typography, semantics, and behavior.
 */
export function Card({ as = 'div', children, className, ref, ...rootProps }: CardProps) {
  const classes = ['signal-card', className].filter(Boolean).join(' ')

  return createElement(as, { ...rootProps, ref, className: classes }, children)
}
