import type { ComponentPropsWithRef, ReactNode } from 'react'

export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  label: ReactNode
  supportingText?: ReactNode
  indeterminate?: boolean
}
