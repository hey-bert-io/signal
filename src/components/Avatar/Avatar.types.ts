import type { ComponentPropsWithRef } from 'react'

export type AvatarSize = 24 | 32 | 40

export interface AvatarProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  initials: string
  src?: string
  size?: AvatarSize
}
