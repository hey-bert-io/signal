import '../../tokens/index.css'

import axe from 'axe-core'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AppShell } from './AppShell'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let container: HTMLDivElement | undefined

const navigation = [
  { current: true, href: '#campaigns', label: 'Campaigns' },
  { href: '#tasks', label: 'My tasks' },
]

function renderShell(props: Partial<React.ComponentProps<typeof AppShell>> = {}) {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root?.render(
    <AppShell identity={{ initials: 'AR', name: 'Alex Rivera' }} navigation={navigation} {...props}>
      {props.children ?? <h1>Page content</h1>}
    </AppShell>,
  ))
  return container.querySelector('.signal-app-shell') as HTMLElement
}

afterEach(() => {
  act(() => root?.unmount())
  container?.remove()
  root = undefined
  container = undefined
})

describe('AppShell', () => {
  it('provides complementary, navigation, and main landmarks', () => {
    const shell = renderShell()
    expect(shell.querySelector('aside')).not.toBeNull()
    expect(shell.querySelector('nav')?.getAttribute('aria-label')).toBe('Primary')
    expect(shell.querySelector('main')?.textContent).toContain('Page content')
  })

  it('composes existing NavItem current behavior and UserIdentity', () => {
    const shell = renderShell()
    expect(shell.querySelector('a[aria-current="page"]')?.textContent).toBe('Campaigns')
    expect(shell.querySelectorAll('.signal-nav-item')).toHaveLength(3)
    expect(shell.querySelector('.signal-user-identity__name')?.textContent).toBe('Alex Rivera')
  })

  it('renders unavailable destinations as native disabled controls without navigation targets', () => {
    const shell = renderShell({ navigation: [navigation[0], { disabled: true, label: 'My tasks' }] })
    const unavailable = [...shell.querySelectorAll<HTMLButtonElement>('button')].find((button) => button.textContent === 'My tasks')
    expect(unavailable?.disabled).toBe(true)
    expect(unavailable?.getAttribute('aria-disabled')).toBe('true')
    expect(unavailable?.hasAttribute('aria-current')).toBe(false)
    expect(shell.querySelector('a[href*="tasks"]')).toBeNull()
  })

  it('keeps the evidenced sidebar, header, and content geometry in CSS', () => {
    renderShell()
    const css = [...document.styleSheets].flatMap((sheet) => [...sheet.cssRules]).map((rule) => rule.cssText).join('\n')
    expect(css).toContain('grid-template-columns: 208px minmax(0px, 1fr)')
    expect(css).toContain('width: 208px')
    expect(css).toContain('@media (max-width: 767px)')
    expect(css).toContain('height: 49px')
  })

  it.each(['light', 'dark'] as const)('keeps the compact header fixed dark and white in %s theme without a nested theme override', (theme) => {
    const shell = renderShell()
    container?.setAttribute('data-theme', theme)
    const header = shell.querySelector('.signal-app-shell__compact-header') as HTMLElement
    expect(shell.querySelector('[data-theme]')).toBeNull()
    const css = [...document.styleSheets].flatMap((sheet) => [...sheet.cssRules]).map((rule) => rule.cssText).join('\n')
    expect(css).toContain('background: var(--primitive-neutral-900)')
    expect(css).toContain('color: var(--primitive-neutral-0)')
    expect(header.querySelectorAll('.signal-icon-button')).toHaveLength(2)
  })

  it('exposes named menu and theme actions and calls supplied handlers', () => {
    const onMenuClick = vi.fn()
    const onThemeToggle = vi.fn()
    const shell = renderShell({ onMenuClick, onThemeToggle })
    const buttons = [...shell.querySelectorAll('button')]
    const menu = buttons.find((button) => button.getAttribute('aria-label') === 'Open navigation menu')
    const theme = buttons.find((button) => button.getAttribute('aria-label') === 'Toggle color theme')
    act(() => menu?.click())
    act(() => theme?.click())
    expect(onMenuClick).toHaveBeenCalledOnce()
    expect(onThemeToggle).toHaveBeenCalledOnce()
  })

  it('uses native disabled semantics when a product disables theme switching', () => {
    const onThemeToggle = vi.fn()
    const shell = renderShell({ onThemeToggle, themeDisabled: true, themeLabel: 'Light / Dark mode' })
    const controls = [
      shell.querySelector<HTMLButtonElement>('.signal-app-shell__theme-link'),
      shell.querySelector<HTMLButtonElement>('.signal-app-shell__compact-header button[aria-label="Light / Dark mode"]'),
    ].filter((control): control is HTMLButtonElement => control !== null)
    expect(controls).toHaveLength(2)
    expect(controls.every((control) => control.disabled)).toBe(true)
    expect(controls[0].getAttribute('aria-disabled')).toBe('true')
    act(() => controls.forEach((control) => control.click()))
    expect(onThemeToggle).not.toHaveBeenCalled()
  })

  it('passes axe with complete shell content', async () => {
    renderShell()
    expect((await axe.run(container as HTMLDivElement)).violations).toEqual([])
  })
})
