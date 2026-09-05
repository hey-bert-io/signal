import '../../tokens/index.css'

import axe from 'axe-core'
import { act, createRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Status } from './Status'
import type { StatusTone } from './Status.types'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const tones: StatusTone[] = ['neutral', 'info', 'success', 'warning', 'danger']

let root: Root | undefined
let container: HTMLDivElement | undefined

function renderStatus(props: Partial<React.ComponentProps<typeof Status>> = {}) {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root?.render(<Status {...props}>{props.children ?? 'Draft'}</Status>))

  const status = container.querySelector('.signal-status') as HTMLSpanElement | null
  if (!status) throw new Error('Status did not render')
  return status
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

describe('Status', () => {
  it('renders static span semantics without creating a live region', () => {
    const status = renderStatus()
    expect(status.tagName).toBe('SPAN')
    expect(status.getAttribute('role')).toBeNull()
    expect(status.querySelector('button, a')).toBeNull()
    expect(status.textContent).toContain('Draft')
  })

  it('renders a decorative indicator', () => {
    const status = renderStatus()
    const indicator = status.querySelector('.signal-status__indicator') as HTMLSpanElement
    expect(indicator.getAttribute('aria-hidden')).toBe('true')
    expect(indicator.getAttribute('role')).toBeNull()
    expect(getComputedStyle(indicator).width).toBe('6px')
    expect(getComputedStyle(indicator).height).toBe('6px')
  })

  it('defaults to the neutral tone', () => {
    expect(renderStatus().dataset.tone).toBe('neutral')
  })

  it.each(tones)('exposes the %s semantic tone', (tone) => {
    expect(renderStatus({ tone }).dataset.tone).toBe(tone)
  })

  it('forwards native span attributes, composes className, and resolves its ref', () => {
    const ref = createRef<HTMLSpanElement>()
    const status = renderStatus({
      'aria-label': 'Current state: Draft',
      className: 'project-status',
      id: 'delivery-status',
      ref,
      title: 'Delivery state',
    })
    expect(status.id).toBe('delivery-status')
    expect(status.classList.contains('signal-status')).toBe(true)
    expect(status.classList.contains('project-status')).toBe(true)
    expect(status.title).toBe('Delivery state')
    expect(status.getAttribute('aria-label')).toBe('Current state: Draft')
    expect(ref.current).toBe(status)
  })

  it('preserves the fixed, borderless, single-line Figma geometry', () => {
    const status = renderStatus({ children: 'A realistic longer product state' })
    const styles = getComputedStyle(status)
    expect(styles.height).toBe('24px')
    expect(styles.whiteSpace).toBe('nowrap')
    expect(styles.borderTopWidth).toBe('0px')
    expect(styles.borderTopStyle).toBe('none')
    expect(status.querySelector('.signal-status__indicator')).not.toBeNull()
  })

  it.each(['light', 'dark'] as const)('passes axe and all tone contrast checks in %s theme', async (theme) => {
    container = document.createElement('div')
    container.setAttribute('data-theme', theme)
    container.style.background = 'var(--color-background-default)'
    document.body.append(container)
    root = createRoot(container)
    act(() => root?.render(
      <>
        {tones.map((tone) => <Status key={tone} tone={tone}>{tone}</Status>)}
      </>,
    ))

    const statuses = [...container.querySelectorAll<HTMLElement>('.signal-status')]
    expect(statuses).toHaveLength(5)
    statuses.forEach((status) => {
      const styles = getComputedStyle(status)
      expect(contrast(styles.color, styles.backgroundColor)).toBeGreaterThanOrEqual(4.5)
      const indicator = status.querySelector('.signal-status__indicator') as HTMLElement
      expect(contrast(getComputedStyle(indicator).backgroundColor, styles.backgroundColor)).toBeGreaterThanOrEqual(3)
    })

    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })
})
