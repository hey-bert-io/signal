import type { ComponentPropsWithRef, ReactNode } from 'react'

export type SelectSize = 'medium' | 'large'

export interface SelectProps extends Omit<ComponentPropsWithRef<'select'>, 'size'> {
  label: ReactNode
  size?: SelectSize
  helperText?: ReactNode
  error?: ReactNode
  hideLabel?: boolean
  optional?: boolean
}
