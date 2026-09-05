import './IconButton.css'

import type { IconButtonProps } from './IconButton.types'

/**
 * An icon-only action. Supply an accessible name with `aria-label` or
 * `aria-labelledby` on every instance.
 */
export function IconButton({
  className,
  icon,
  ref,
  size = 'medium',
  type = 'button',
  variant = 'primary',
  ...buttonProps
}: IconButtonProps) {
  const classes = ['signal-icon-button', className].filter(Boolean).join(' ')

  return (
    <button {...buttonProps} ref={ref} className={classes} data-size={size} data-variant={variant} type={type}>
      <span aria-hidden="true" className="signal-icon-button__icon">{icon}</span>
    </button>
  )
}
