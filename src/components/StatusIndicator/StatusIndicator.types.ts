import type { ComponentPropsWithRef } from 'react'

export type StatusIndicatorTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'
export type StatusIndicatorSize = 'small' | 'medium'

export interface StatusIndicatorProps extends ComponentPropsWithRef<'span'> {
  label?: string
  showLabel?: boolean
  size?: StatusIndicatorSize
  tone?: StatusIndicatorTone
}
