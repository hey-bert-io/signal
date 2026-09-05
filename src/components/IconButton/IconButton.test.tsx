import '../../tokens/index.css'

import axe from 'axe-core'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { IconButton } from './IconButton'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const SearchIcon = () => (
  <svg data-testid="search-icon" fill="none" viewBox="0 0 16 16">
    <circle cx="7" cy="7" r="4" stroke="currentColor" />
    <path d="m10 10 3 3" stroke="currentColor" />
  </svg>
)

let root: Root | undefined
let container: HTMLDivElement | undefined

function renderIconButton(props: Partial<React.ComponentProps<typeof IconButton>> = {}) {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root?.render(
    <IconButton aria-label="Search" icon={<SearchIcon />} {...props} />,
  ))

  const button = container.querySelector('button')
  if (!button) throw new Error('IconButton did not render')
  return button
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

describe('IconButton', () => {
  it('renders a supplied icon with native button semantics', () => {
    const button = renderIconButton()
    expect(button.tagName).toBe('BUTTON')
    expect(button.querySelector('[data-testid="search-icon"]')).not.toBeNull()
  })

  it('exposes the selected variant and size configuration', () => {
    const button = renderIconButton({ variant: 'danger', size: 'large' })
    expect(button.dataset.variant).toBe('danger')
    expect(button.dataset.size).toBe('large')
  })

  it('forwards native button props and refs', () => {
    const ref = { current: null as HTMLButtonElement | null }
    const button = renderIconButton({ name: 'search', ref, title: 'Find a project' })
    expect(button.getAttribute('name')).toBe('search')
    expect(button.getAttribute('title')).toBe('Find a project')
    expect(ref.current).toBe(button)
  })

  it('handles clicks', () => {
    const onClick = vi.fn()
    renderIconButton({ onClick }).click()
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('prevents clicks when disabled', () => {
    const onClick = vi.fn()
    renderIconButton({ disabled: true, onClick }).click()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('defaults type to button', () => {
    expect(renderIconButton().getAttribute('type')).toBe('button')
  })

  it('preserves an explicitly supplied type', () => {
    expect(renderIconButton({ type: 'submit' }).getAttribute('type')).toBe('submit')
  })

  it('uses aria-label as its accessible name', () => {
    expect(renderIconButton({ 'aria-label': 'Add project' }).ariaLabel).toBe('Add project')
  })

  it('supports aria-labelledby for its accessible name', async () => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => root?.render(
      <>
        <span id="search-label">Search projects</span>
        <IconButton aria-labelledby="search-label" icon={<SearchIcon />} />
      </>,
    ))

    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it('passes axe checks when correctly named', async () => {
    renderIconButton()
    const results = await axe.run(container as HTMLDivElement)
    expect(results.violations).toEqual([])
  })

  it('is reported by axe when it has no accessible name', async () => {
    renderIconButton({ 'aria-label': undefined })
    const results = await axe.run(container as HTMLDivElement)
    expect(results.violations.some((violation) => violation.id === 'button-name')).toBe(true)
  })

  it.each(['light', 'dark'] as const)('keeps Danger icon contrast at or above 3:1 in %s theme', (theme) => {
    const button = renderIconButton({ variant: 'danger' })
    container?.setAttribute('data-theme', theme)
    const styles = getComputedStyle(button)
    expect(contrast(styles.color, styles.backgroundColor)).toBeGreaterThanOrEqual(3)
  })
})
