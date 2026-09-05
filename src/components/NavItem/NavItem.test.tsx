import '../../tokens/index.css'

import axe from 'axe-core'
import { act, createRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { NavItem } from './NavItem'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let container: HTMLDivElement | undefined

function SearchIcon() {
  return (
    <svg data-testid="search-icon" fill="none" viewBox="0 0 16 16">
      <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.33" />
      <path d="m10 10 3 3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.33" />
    </svg>
  )
}

function renderNavItem(props: Partial<React.ComponentProps<typeof NavItem>> = {}) {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root?.render(
    <NavItem href="/projects" {...props}>{props.children ?? 'Projects'}</NavItem>,
  ))

  const link = container.querySelector('a')
  if (!link) throw new Error('NavItem did not render')
  return link
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
  vi.restoreAllMocks()
})

describe('NavItem', () => {
  it('renders a native anchor whose visible children provide its accessible name', () => {
    const link = renderNavItem()
    expect(link.tagName).toBe('A')
    expect(link.textContent).toBe('Projects')
    expect(link.getAttribute('aria-label')).toBeNull()
  })

  it('forwards native anchor attributes, className, style, and its ref', () => {
    const ref = createRef<HTMLAnchorElement>()
    const link = renderNavItem({
      className: 'project-link',
      'aria-describedby': 'project-description',
      'data-project': 'signal',
      download: 'project.txt',
      id: 'projects-link',
      ref,
      rel: 'noreferrer',
      style: { width: 240 },
      target: '_blank',
    })
    expect(link.getAttribute('href')).toBe('/projects')
    expect(link.id).toBe('projects-link')
    expect(link.classList.contains('signal-nav-item')).toBe(true)
    expect(link.classList.contains('project-link')).toBe(true)
    expect(link.dataset.project).toBe('signal')
    expect(link.getAttribute('aria-describedby')).toBe('project-description')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noreferrer')
    expect(link.getAttribute('download')).toBe('project.txt')
    expect(link.style.width).toBe('240px')
    expect(ref.current).toBe(link)
  })

  it('renders an optional decorative currentColor icon slot', () => {
    const link = renderNavItem({ icon: <SearchIcon /> })
    const icon = link.querySelector('.signal-nav-item__icon') as HTMLElement
    expect(icon.getAttribute('aria-hidden')).toBe('true')
    expect(icon.querySelector('[data-testid="search-icon"]')).not.toBeNull()
    expect(getComputedStyle(icon).color).toBe(getComputedStyle(link).color)
    expect(getComputedStyle(icon).width).toBe('16px')
    expect(getComputedStyle(icon).height).toBe('16px')
  })

  it('omits the icon wrapper when no icon is supplied', () => {
    expect(renderNavItem().querySelector('.signal-nav-item__icon')).toBeNull()
  })

  it('maps current to aria-current page and otherwise preserves an explicit native value', () => {
    expect(renderNavItem({ current: true }).getAttribute('aria-current')).toBe('page')
    act(() => root?.unmount())
    container?.remove()
    root = undefined
    container = undefined
    expect(renderNavItem({ 'aria-current': 'step', current: false }).getAttribute('aria-current')).toBe('step')
  })

  it('omits aria-current when current is false and no native value is supplied', () => {
    expect(renderNavItem({ current: false }).hasAttribute('aria-current')).toBe(false)
  })

  it('calls the consumer click handler when enabled', () => {
    const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault())
    renderNavItem({ onClick }).click()
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('retains href and focusability but prevents disabled activation before consumer code', () => {
    const onClick = vi.fn()
    const link = renderNavItem({ disabled: true, onClick })
    const click = new MouseEvent('click', { bubbles: true, cancelable: true })
    let dispatched = true
    act(() => { dispatched = link.dispatchEvent(click) })

    expect(link.getAttribute('href')).toBe('/projects')
    expect(link.getAttribute('aria-disabled')).toBe('true')
    expect(link.tabIndex).toBe(0)
    expect(dispatched).toBe(false)
    expect(click.defaultPrevented).toBe(true)
    expect(onClick).not.toHaveBeenCalled()

    link.focus()
    expect(document.activeElement).toBe(link)
  })

  it('guards the click event produced by native Enter activation while disabled', () => {
    const onClick = vi.fn()
    const link = renderNavItem({ disabled: true, onClick })
    link.focus()
    const keyboardClick = new MouseEvent('click', { bubbles: true, cancelable: true, detail: 0 })
    act(() => { link.dispatchEvent(keyboardClick) })
    expect(keyboardClick.defaultPrevented).toBe(true)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('keeps aria-current while disabled presentation and behavior take precedence', () => {
    const link = renderNavItem({ current: true, disabled: true })
    const styles = getComputedStyle(link)
    expect(link.getAttribute('aria-current')).toBe('page')
    expect(link.getAttribute('aria-disabled')).toBe('true')
    expect(styles.color).toBe('rgb(129, 120, 109)')
    expect(styles.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(styles.opacity).toBe('0.5')
  })

  it('encodes hover precedence without adding a bespoke pressed state', () => {
    renderNavItem()
    const rules = [...document.styleSheets].flatMap((sheet) => {
      try {
        return [...sheet.cssRules]
      } catch {
        return []
      }
    }).filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule)
    const selectors = rules.map((rule) => rule.selectorText.replaceAll('"', "'"))

    expect(selectors).toContain(".signal-nav-item:hover:not([aria-current='page']):not([aria-disabled='true'])")
    expect(selectors).toContain(".signal-nav-item[aria-current='page']:not([aria-disabled='true'])")
    expect(selectors).toContain(".signal-nav-item[aria-disabled='true']")
    expect(selectors.some((selector) => selector?.includes('.signal-nav-item:active'))).toBe(false)
  })

  it('preserves Figma geometry, typography, and single-line ellipsis', () => {
    const link = renderNavItem({ children: 'A very long destination name that must truncate' })
    const styles = getComputedStyle(link)
    const label = link.querySelector('.signal-nav-item__label') as HTMLElement
    const labelStyles = getComputedStyle(label)
    expect(styles.display).toBe('flex')
    expect(styles.width).toBe(`${container?.clientWidth}px`)
    expect(styles.height).toBe('36px')
    expect(styles.paddingLeft).toBe('12px')
    expect(styles.paddingRight).toBe('12px')
    expect(styles.gap).toBe('8px')
    expect(styles.borderRadius).toBe('6px')
    expect(styles.borderTopWidth).toBe('0px')
    expect(styles.fontFamily).toContain('IBM Plex Sans')
    expect(styles.fontWeight).toBe('500')
    expect(styles.fontSize).toBe('14px')
    expect(styles.lineHeight).toBe('20px')
    expect(labelStyles.minWidth).toBe('0px')
    expect(labelStyles.overflow).toBe('hidden')
    expect(labelStyles.textOverflow).toBe('ellipsis')
    expect(labelStyles.whiteSpace).toBe('nowrap')
    expect(link.hasAttribute('title')).toBe(false)
  })

  it.each(['light', 'dark'] as const)('passes axe and enabled label contrast in %s theme', async (theme) => {
    container = document.createElement('div')
    container.setAttribute('data-theme', theme)
    container.style.background = 'var(--color-surface-default)'
    document.body.append(container)
    root = createRoot(container)
    act(() => root?.render(
      <nav aria-label="Primary">
        <NavItem href="/projects" icon={<SearchIcon />} current>Projects</NavItem>
        <NavItem href="/tasks">My tasks</NavItem>
        <NavItem href="/reports" disabled>Reports</NavItem>
      </nav>,
    ))

    const links = [...container.querySelectorAll<HTMLAnchorElement>('.signal-nav-item')]
    const surface = getComputedStyle(container).backgroundColor
    expect(contrast(getComputedStyle(links[0]).color, getComputedStyle(links[0]).backgroundColor)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(getComputedStyle(links[1]).color, surface)).toBeGreaterThanOrEqual(4.5)
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })
})
