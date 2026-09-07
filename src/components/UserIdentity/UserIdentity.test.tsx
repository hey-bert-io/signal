import '../../tokens/index.css'

import axe from 'axe-core'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { UserIdentity } from './UserIdentity'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let container: HTMLDivElement | undefined

function renderIdentity(props: Partial<React.ComponentProps<typeof UserIdentity>> = {}) {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root?.render(<UserIdentity initials="MS" name="Maya Santos" {...props} />))
  return container.querySelector('.signal-user-identity') as HTMLSpanElement
}

afterEach(() => {
  act(() => root?.unmount())
  container?.remove()
  root = undefined
  container = undefined
})

describe('UserIdentity', () => {
  it('composes the existing 32px Avatar with visible identity text', () => {
    const identity = renderIdentity()
    expect(identity.tagName).toBe('SPAN')
    expect(identity.querySelector('.signal-avatar')?.getAttribute('data-size')).toBe('32')
    expect(identity.querySelector('.signal-user-identity__name')?.textContent).toBe('Maya Santos')
    expect(identity.querySelector('button, a')).toBeNull()
  })

  it('passes avatar image data through as decorative content', () => {
    const image = renderIdentity({ avatarSrc: '/maya.jpg' }).querySelector('img') as HTMLImageElement
    expect(image.src).toContain('/maya.jpg')
    expect(image.alt).toBe('')
  })

  it('preserves the full name as the accessible identity in avatar-only display', () => {
    const identity = renderIdentity({ display: 'avatar-only' })
    expect(identity.textContent).toContain('Maya Santos')
    expect(identity.querySelector('.signal-user-identity__name')).toBeNull()
    expect(identity.querySelector('.signal-user-identity__visually-hidden')?.textContent).toBe('Maya Santos')
    expect(getComputedStyle(identity).width).toBe('32px')
  })

  it.each(['full', 'avatar-only'] as const)('passes axe in %s display', async (display) => {
    renderIdentity({ display })
    expect((await axe.run(container as HTMLDivElement)).violations).toEqual([])
  })
})
