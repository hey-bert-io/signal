import type { AnchorHTMLAttributes, ReactNode } from 'react'

export interface NavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  [dataAttribute: `data-${string}`]: string | number | boolean | undefined
  current?: boolean
  disabled?: boolean
  icon?: ReactNode
  children: ReactNode
}
