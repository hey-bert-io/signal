import type { ReactNode } from 'react'

export interface AppShellNavigationItem {
  current?: boolean
  disabled?: boolean
  href: string
  icon?: ReactNode
  label: string
}

export interface AppShellIdentity {
  avatarSrc?: string
  initials: string
  name: string
}

export interface AppShellProps {
  brandName?: string
  children: ReactNode
  className?: string
  identity: AppShellIdentity
  menuLabel?: string
  navigation: AppShellNavigationItem[]
  navigationLabel?: string
  onMenuClick?: () => void
  onThemeToggle?: () => void
  themeLabel?: string
  utilityNavigation?: AppShellNavigationItem[]
}
