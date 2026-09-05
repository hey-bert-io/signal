import '../../tokens/index.css'

import axe from 'axe-core'
import { act, createRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { CountBadge } from './CountBadge'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let container: HTMLDivElement | undefined

function renderCountBadge(element: React.ReactElement = <CountBadge>24</CountBadge>) {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root?.render(element))

  const badge = container.querySelector('.signal-count-badge') as HTMLSpanElement | null
  if (!badge) throw new Error('Count Badge did not render')
  return badge
}

afterEach(() => {
  act(() => root?.unmount())
  container?.remove()
  root = undefined
  container = undefined
})

describe('CountBadge', () => {
  it.each([
    [24, '24'],
    ['99+', '99+'],
    [100, '100'],
    [0, '0'],
  ])('renders %s unchanged as ordinary span content', (children, expected) => {
    const badge = renderCountBadge(<CountBadge>{children}</CountBadge>)
    expect(badge.tagName).toBe('SPAN')
    expect(badge.textContent).toBe(expected)
  })

  it('forwards native attributes, composes className, and resolves its ref', () => {
    const ref = createRef<HTMLSpanElement>()
    const badge = renderCountBadge(
      <CountBadge
        aria-label="24 tasks"
        className="project-count"
        data-project-id="signal"
        id="task-count"
        ref={ref}
        style={{ marginInlineStart: 4 }}
        title="Task count"
      >
        24
      </CountBadge>,
    )

    expect(badge.id).toBe('task-count')
    expect(badge.classList.contains('signal-count-badge')).toBe(true)
    expect(badge.classList.contains('project-count')).toBe(true)
    expect(badge.dataset.projectId).toBe('signal')
    expect(badge.getAttribute('aria-label')).toBe('24 tasks')
    expect(badge.title).toBe('Task count')
    expect(badge.style.marginInlineStart).toBe('4px')
    expect(ref.current).toBe(badge)
  })

  it('adds no title, live-region, hidden, interactive, or focus semantics', () => {
    const badge = renderCountBadge()
    expect(badge.title).toBe('')
    expect(badge.getAttribute('role')).toBeNull()
    expect(badge.getAttribute('aria-live')).toBeNull()
    expect(badge.getAttribute('aria-label')).toBeNull()
    expect(badge.getAttribute('aria-hidden')).toBeNull()
    expect(badge.getAttribute('tabindex')).toBeNull()
    expect(badge.querySelector('button, a')).toBeNull()
  })

  it('preserves the token-driven, borderless, content-hugging Figma geometry', async () => {
    await document.fonts.ready
    const badge = renderCountBadge()
    const styles = getComputedStyle(badge)

    expect(styles.display).toBe('inline-flex')
    expect(styles.height).toBe('20px')
    expect(styles.paddingTop).toBe('2px')
    expect(styles.paddingRight).toBe('8px')
    expect(styles.paddingBottom).toBe('2px')
    expect(styles.paddingLeft).toBe('8px')
    expect(styles.borderTopStyle).toBe('none')
    expect(styles.borderRadius).toBe('9999px')
    expect(styles.whiteSpace).toBe('nowrap')
    expect(styles.overflow).toBe('visible')
    expect(badge.getBoundingClientRect().width).toBeGreaterThan(24)
  })

  it.each([
    ['light', 'rgb(219, 234, 213)', 'rgb(61, 59, 55)'],
    ['dark', 'rgb(206, 197, 186)', 'rgb(25, 49, 34)'],
  ] as const)('resolves the intended inverted component tokens in %s', (theme, background, foreground) => {
    const badge = renderCountBadge(<CountBadge data-theme={theme}>24</CountBadge>)
    const styles = getComputedStyle(badge)
    expect(styles.backgroundColor).toBe(background)
    expect(styles.color).toBe(foreground)
  })

  it.each(['light', 'dark'] as const)('passes axe in a representative %s context', async (theme) => {
    renderCountBadge(
      <div data-theme={theme}>
        <span>Tasks</span> <CountBadge>24</CountBadge>
      </div>,
    )
    const results = await axe.run(container as HTMLDivElement)
    expect(results.violations).toEqual([])
  })
})
