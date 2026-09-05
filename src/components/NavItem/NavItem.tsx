import './NavItem.css'

import { forwardRef, type MouseEvent } from 'react'

import type { NavItemProps } from './NavItem.types'

export const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(function NavItem({
  'aria-current': ariaCurrent,
  children,
  className,
  current = false,
  disabled = false,
  icon,
  onClick,
  ...anchorProps
}, ref) {
  const classes = ['signal-nav-item', className].filter(Boolean).join(' ')

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault()
      return
    }

    onClick?.(event)
  }

  return (
    <a
      {...anchorProps}
      ref={ref}
      aria-current={current ? 'page' : ariaCurrent}
      aria-disabled={disabled ? 'true' : undefined}
      className={classes}
      onClick={handleClick}
    >
      {icon ? <span aria-hidden="true" className="signal-nav-item__icon">{icon}</span> : null}
      <span className="signal-nav-item__label">{children}</span>
    </a>
  )
})
