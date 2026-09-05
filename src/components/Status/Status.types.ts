import type { ComponentPropsWithRef, ReactNode } from 'react'

export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

export interface StatusProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  children: ReactNode
  tone?: StatusTone
}
