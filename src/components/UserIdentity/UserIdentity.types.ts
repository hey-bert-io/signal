import type { ComponentPropsWithRef } from 'react'

export type UserIdentityDisplay = 'full' | 'avatar-only'

export interface UserIdentityProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  avatarSrc?: string
  display?: UserIdentityDisplay
  initials: string
  name: string
}
