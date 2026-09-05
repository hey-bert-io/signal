import type { ComponentPropsWithRef, ReactNode } from 'react'

export type TextFieldSize = 'medium' | 'large'

export interface TextFieldProps extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  label: ReactNode
  size?: TextFieldSize
  helperText?: ReactNode
  error?: ReactNode
  hideLabel?: boolean
  optional?: boolean
}
