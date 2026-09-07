import './index.css'

import { afterEach, describe, expect, it } from 'vitest'

function fixture(theme: 'light' | 'dark') {
  const element = document.createElement('div')
  element.dataset.theme = theme
  document.body.append(element)
  return element
}

afterEach(() => {
  document.body.replaceChildren()
})

describe('Signal foundation tokens', () => {
  it.each([
    ['light', '#4f46e5', '#4338ca', '#211c54', '#ffffff'],
    ['dark', '#4f46e5', '#a5b4fc', '#4338ca', '#18181b'],
  ] as const)(
    'maps Primary component states without changing broad action semantics in %s',
    (theme, background, hover, pressed, hoverForeground) => {
      const styles = getComputedStyle(fixture(theme))
      expect(styles.getPropertyValue('--button-primary-background').trim()).toBe(background)
      expect(styles.getPropertyValue('--button-primary-background-hover').trim()).toBe(hover)
      expect(styles.getPropertyValue('--button-primary-background-pressed').trim()).toBe(pressed)
      expect(styles.getPropertyValue('--button-primary-foreground').trim()).toBe('#ffffff')
      expect(styles.getPropertyValue('--button-primary-foreground-hover').trim()).toBe(
        hoverForeground,
      )
      expect(styles.getPropertyValue('--color-action-primary').trim()).toBe(
        theme === 'light' ? '#152cc0' : '#a3b0f5',
      )
    },
  )

  it('exposes the frozen typography scale and body-reading style', () => {
    const styles = getComputedStyle(fixture('light'))
    expect(styles.getPropertyValue('--font-family-sans').trim()).toContain('IBM Plex Sans')
    expect(styles.getPropertyValue('--font-size-label').trim()).toBe('12px')
    expect(styles.getPropertyValue('--line-height-label').trim()).toBe('16px')
    expect(styles.getPropertyValue('--font-size-body').trim()).toBe('14px')
    expect(styles.getPropertyValue('--line-height-body').trim()).toBe('20px')
    expect(styles.getPropertyValue('--line-height-body-reading').trim()).toBe('24px')
    expect(styles.getPropertyValue('--font-size-body-emphasized').trim()).toBe('16px')
    expect(styles.getPropertyValue('--line-height-body-emphasized').trim()).toBe('24px')
    expect(styles.getPropertyValue('--font-size-page-heading').trim()).toBe('24px')
    expect(styles.getPropertyValue('--line-height-page-heading').trim()).toBe('32px')
    expect(styles.getPropertyValue('--letter-spacing-default').trim()).toBe('0')
  })

  it.each(['light', 'dark'] as const)('maps frozen Danger colors and white foreground in %s', (theme) => {
    const styles = getComputedStyle(fixture(theme))
    expect(styles.getPropertyValue('--primitive-red-600').trim()).toBe('#e11d48')
    expect(styles.getPropertyValue('--primitive-red-700').trim()).toBe('#be123c')
    expect(styles.getPropertyValue('--primitive-red-900').trim()).toBe('#881337')
    expect(styles.getPropertyValue('--button-danger-background').trim()).toBe('#e11d48')
    expect(styles.getPropertyValue('--button-danger-background-hover').trim()).toBe('#be123c')
    expect(styles.getPropertyValue('--button-danger-background-pressed').trim()).toBe('#881337')
    expect(styles.getPropertyValue('--color-text-inverse').trim()).toBe(
      theme === 'light' ? '#ffffff' : '#18181b',
    )
    expect(styles.getPropertyValue('--button-danger-foreground').trim()).toBe('#ffffff')
  })
})
