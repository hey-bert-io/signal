import type { ComponentPropsWithRef, ReactNode } from 'react'

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type IconButtonSize = 'small' | 'medium' | 'large'

type NativeIconButtonProps = Omit<ComponentPropsWithRef<'button'>, 'aria-label' | 'aria-labelledby' | 'children' | 'size'>

type IconButtonAccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: string }
  | { 'aria-label'?: string; 'aria-labelledby': string }

export type IconButtonProps = NativeIconButtonProps & IconButtonAccessibleName & {
  icon: ReactNode
  variant?: IconButtonVariant
  size?: IconButtonSize
}
