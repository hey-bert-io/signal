import './UserIdentity.css'

import { Avatar } from '../Avatar'
import type { UserIdentityProps } from './UserIdentity.types'

/** Non-interactive identity for the current authenticated user. */
export function UserIdentity({ avatarSrc, className, display = 'full', initials, name, ref, ...spanProps }: UserIdentityProps) {
  const classes = ['signal-user-identity', className].filter(Boolean).join(' ')

  return (
    <span
      {...spanProps}
      ref={ref}
      className={classes}
      data-display={display}
    >
      <Avatar initials={initials} size={32} src={avatarSrc} />
      {display === 'full' ? <span className="signal-user-identity__name">{name}</span> : null}
      {display === 'avatar-only' ? <span className="signal-user-identity__visually-hidden">{name}</span> : null}
    </span>
  )
}
