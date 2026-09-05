import './Avatar.css'

import { useState } from 'react'

import type { AvatarProps } from './Avatar.types'

interface AvatarContentProps {
  initials: string
  src?: string
}

function AvatarContent({ initials, src }: AvatarContentProps) {
  const [imageFailed, setImageFailed] = useState(false)

  if (!src || imageFailed) {
    return <span aria-hidden="true" className="signal-avatar__initials">{initials}</span>
  }

  return <img alt="" className="signal-avatar__image" onError={() => setImageFailed(true)} src={src} />
}

/**
 * A non-interactive visual representation of a person. Use one or two
 * characters for initials; the surrounding context owns accessible identity.
 */
export function Avatar({ className, initials, ref, size = 24, src, ...spanProps }: AvatarProps) {
  const classes = ['signal-avatar', className].filter(Boolean).join(' ')

  return (
    <span {...spanProps} ref={ref} className={classes} data-size={size}>
      <AvatarContent key={src ? `image:${src}` : 'initials'} initials={initials} src={src} />
    </span>
  )
}
