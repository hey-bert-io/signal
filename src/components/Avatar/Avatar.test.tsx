import '../../tokens/index.css'

import axe from 'axe-core'
import { act, createRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Avatar } from './Avatar'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let container: HTMLDivElement | undefined

function renderAvatar(props: Partial<React.ComponentProps<typeof Avatar>> = {}) {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root?.render(<Avatar initials="EC" {...props} />))

  const avatar = container.querySelector('.signal-avatar') as HTMLSpanElement | null
  if (!avatar) throw new Error('Avatar did not render')
  return avatar
}

function rgbChannels(value: string) {
  const channels = value.match(/[\d.]+/g)?.slice(0, 3).map(Number)
  if (!channels || channels.length !== 3) throw new Error(`Could not parse color: ${value}`)
  return channels
}

function luminance(value: string) {
  const [red, green, blue] = rgbChannels(value).map((channel) => {
    const normalized = channel / 255
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function contrast(first: string, second: string) {
  const light = Math.max(luminance(first), luminance(second))
  const dark = Math.min(luminance(first), luminance(second))
  return (light + 0.05) / (dark + 0.05)
}

afterEach(() => {
  act(() => root?.unmount())
  container?.remove()
  root = undefined
  container = undefined
})

describe('Avatar', () => {
  it('renders a non-interactive span without its own accessible identity', () => {
    const avatar = renderAvatar()
    expect(avatar.tagName).toBe('SPAN')
    expect(avatar.getAttribute('role')).toBeNull()
    expect(avatar.getAttribute('aria-label')).toBeNull()
    expect(avatar.querySelector('button, a')).toBeNull()
  })

  it('renders consumer-provided initials unchanged when src is absent', () => {
    const avatar = renderAvatar({ initials: 'é ' })
    const initials = avatar.querySelector('.signal-avatar__initials')
    expect(initials?.textContent).toBe('é ')
    expect(initials?.getAttribute('aria-hidden')).toBe('true')
    expect(avatar.querySelector('img')).toBeNull()
  })

  it.each(['A', 'MS'])('renders %s initials without parsing', (initials) => {
    expect(renderAvatar({ initials }).textContent).toBe(initials)
  })

  it('renders a decorative native image when src is supplied', () => {
    const avatar = renderAvatar({ initials: 'MS', src: '/maya.jpg' })
    const image = avatar.querySelector('img') as HTMLImageElement
    expect(image.tagName).toBe('IMG')
    expect(image.alt).toBe('')
    expect(image.getAttribute('src')).toBe('/maya.jpg')
    expect(avatar.querySelector('.signal-avatar__initials')).toBeNull()
  })

  it('uses centered cover cropping and circular clipping without a border', () => {
    const avatar = renderAvatar({ src: '/maya.jpg' })
    const image = avatar.querySelector('img') as HTMLImageElement
    const imageStyles = getComputedStyle(image)
    const avatarStyles = getComputedStyle(avatar)
    expect(imageStyles.objectFit).toBe('cover')
    expect(imageStyles.objectPosition).toBe('50% 50%')
    expect(imageStyles.width).toBe('24px')
    expect(imageStyles.height).toBe('24px')
    expect(avatarStyles.overflow).toBe('hidden')
    expect(avatarStyles.borderRadius).toBe('9999px')
    expect(avatarStyles.borderTopWidth).toBe('0px')
  })

  it('falls back to decorative initials when the image errors', () => {
    const avatar = renderAvatar({ initials: 'MS', src: '/missing.jpg' })
    const image = avatar.querySelector('img') as HTMLImageElement
    act(() => image.dispatchEvent(new Event('error')))
    const initials = avatar.querySelector('.signal-avatar__initials')
    expect(avatar.querySelector('img')).toBeNull()
    expect(initials?.textContent).toBe('MS')
    expect(initials?.getAttribute('aria-hidden')).toBe('true')
  })

  it('attempts a changed src after failure and keeps a successful image', () => {
    const avatar = renderAvatar({ initials: 'MS', src: '/missing.jpg' })
    act(() => (avatar.querySelector('img') as HTMLImageElement).dispatchEvent(new Event('error')))
    expect(avatar.querySelector('img')).toBeNull()

    act(() => root?.render(<Avatar initials="MS" src="/maya.jpg" />))
    const nextImage = container?.querySelector('img') as HTMLImageElement
    expect(nextImage.getAttribute('src')).toBe('/maya.jpg')
    act(() => nextImage.dispatchEvent(new Event('load')))
    expect(container?.querySelector('img')).toBe(nextImage)
    expect(container?.querySelector('.signal-avatar__initials')).toBeNull()
  })

  it.each([
    [undefined, 24, 12, 16],
    [24, 24, 12, 16],
    [32, 32, 12, 16],
    [40, 40, 14, 20],
  ] as const)('maps size %s to %ipx and its Figma typography', (size, dimension, fontSize, lineHeight) => {
    const avatar = renderAvatar({ size })
    const initials = avatar.querySelector('.signal-avatar__initials') as HTMLElement
    expect(avatar.dataset.size).toBe(String(size ?? 24))
    expect(getComputedStyle(avatar).width).toBe(`${dimension}px`)
    expect(getComputedStyle(avatar).height).toBe(`${dimension}px`)
    expect(getComputedStyle(initials).fontSize).toBe(`${fontSize}px`)
    expect(getComputedStyle(initials).lineHeight).toBe(`${lineHeight}px`)
  })

  it('forwards root attributes, composes className, and resolves its ref', () => {
    const ref = createRef<HTMLSpanElement>()
    const avatar = renderAvatar({
      'aria-hidden': true,
      className: 'assignee-avatar',
      id: 'maya-avatar',
      ref,
      title: 'Assignee portrait',
    })
    expect(avatar.id).toBe('maya-avatar')
    expect(avatar.classList.contains('signal-avatar')).toBe(true)
    expect(avatar.classList.contains('assignee-avatar')).toBe(true)
    expect(avatar.title).toBe('Assignee portrait')
    expect(avatar.getAttribute('aria-hidden')).toBe('true')
    expect(ref.current).toBe(avatar)
  })

  it.each(['light', 'dark'] as const)('passes initials contrast and axe in a named %s context', async (theme) => {
    container = document.createElement('div')
    container.setAttribute('data-theme', theme)
    container.style.background = 'var(--color-background-default)'
    container.style.color = 'var(--color-text-primary)'
    document.body.append(container)
    root = createRoot(container)
    act(() => root?.render(
      <span>
        <Avatar initials="MS" size={40} />
        <span>Maya Santos</span>
      </span>,
    ))
    const initials = container.querySelector('.signal-avatar__initials') as HTMLElement
    const styles = getComputedStyle(initials)
    expect(contrast(styles.color, styles.backgroundColor)).toBeGreaterThanOrEqual(4.5)
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it('passes axe when an avatar-only interactive parent supplies the name', async () => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => root?.render(
      <button aria-label="Open profile for Maya Santos" type="button">
        <Avatar initials="MS" />
      </button>,
    ))
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })
})
