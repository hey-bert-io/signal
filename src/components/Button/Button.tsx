import './Button.css'

import type { ButtonProps } from './Button.types'

export function Button({
  children,
  className,
  leadingIcon,
  ref,
  size = 'medium',
  trailingIcon,
  type = 'button',
  variant = 'primary',
  ...buttonProps
}: ButtonProps) {
  const classes = ['signal-button', className].filter(Boolean).join(' ')

  return (
    <button {...buttonProps} ref={ref} className={classes} data-size={size} data-variant={variant} type={type}>
      {leadingIcon ? <span aria-hidden="true" className="signal-button__icon">{leadingIcon}</span> : null}
      <span className="signal-button__label">{children}</span>
      {trailingIcon ? <span aria-hidden="true" className="signal-button__icon">{trailingIcon}</span> : null}
    </button>
  )
}
