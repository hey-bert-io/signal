import type { ComponentPropsWithRef, ReactNode } from 'react'

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type IconButtonSize = 'small' | 'medium' | 'large'

export interface IconButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'children' | 'size'> {
  icon: ReactNode
  variant?: IconButtonVariant
  size?: IconButtonSize
}
