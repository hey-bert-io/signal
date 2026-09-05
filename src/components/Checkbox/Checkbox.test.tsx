import '../../tokens/index.css'

import axe from 'axe-core'
import { act, createRef, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Checkbox } from './Checkbox'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let container: HTMLDivElement | undefined

function renderCheckbox(props: Partial<React.ComponentProps<typeof Checkbox>> = {}) {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root?.render(<Checkbox label="Notify assignee" {...props} />))

  const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement | null
  if (!input) throw new Error('Checkbox did not render')
  return input
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

describe('Checkbox', () => {
  it('renders a native checkbox with a required visible label', () => {
    const input = renderCheckbox()
    expect(input.tagName).toBe('INPUT')
    expect(input.type).toBe('checkbox')
    expect(input.labels?.[0]?.textContent).toContain('Notify assignee')
    expect(container?.querySelector('.signal-checkbox__label')?.textContent).toBe('Notify assignee')
  })

  it('associates supporting text and combines consumer descriptions', () => {
    const input = renderCheckbox({
      'aria-describedby': 'external-description',
      id: 'notify',
      supportingText: 'Send a notification when this task changes.',
    })
    expect(input.getAttribute('aria-describedby')).toBe('external-description notify-supporting')
    expect(container?.querySelector('#notify-supporting')?.textContent).toContain('Send a notification')
  })

  it.each(['.signal-checkbox__control', '.signal-checkbox__label', '.signal-checkbox__supporting', '.signal-checkbox'])('toggles through the native label when clicking %s', (selector) => {
    const input = renderCheckbox({ supportingText: 'Supporting copy' })
    act(() => (container?.querySelector(selector) as HTMLElement).click())
    expect(input.checked).toBe(true)
  })

  it('calls the native change handler', () => {
    const onChange = vi.fn()
    const input = renderCheckbox({ onChange })
    act(() => input.click())
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('supports uncontrolled and controlled checked state', () => {
    expect(renderCheckbox({ defaultChecked: true }).checked).toBe(true)
    act(() => root?.unmount())
    container?.remove()

    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    function ControlledCheckbox() {
      const [checked, setChecked] = useState(false)
      return <Checkbox checked={checked} label="Controlled" onChange={(event) => setChecked(event.target.checked)} />
    }
    act(() => root?.render(<ControlledCheckbox />))
    const controlled = container.querySelector('input') as HTMLInputElement
    act(() => controlled.click())
    expect(controlled.checked).toBe(true)
  })

  it('forwards native attributes and its ref', () => {
    const ref = createRef<HTMLInputElement>()
    const input = renderCheckbox({ form: 'settings', name: 'notify', ref, required: true, value: 'yes' })
    expect(input.form?.id).toBeUndefined()
    expect(input.getAttribute('form')).toBe('settings')
    expect(input.name).toBe('notify')
    expect(input.required).toBe(true)
    expect(input.value).toBe('yes')
    expect(ref.current).toBe(input)
  })

  it('participates in native form submission', () => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => root?.render(
      <form>
        <Checkbox defaultChecked label="Notify assignee" name="notify" value="yes" />
      </form>,
    ))
    const form = container.querySelector('form') as HTMLFormElement
    expect(new FormData(form).get('notify')).toBe('yes')
  })

  it('uses native disabled behavior without fading the composition', () => {
    const onChange = vi.fn()
    const input = renderCheckbox({ defaultChecked: true, disabled: true, onChange })
    act(() => container?.querySelector('label')?.click())
    expect(input.checked).toBe(true)
    expect(onChange).not.toHaveBeenCalled()
    expect(getComputedStyle(container?.querySelector('label') as HTMLLabelElement).opacity).toBe('1')
    expect(getComputedStyle(container?.querySelector('.signal-checkbox__check') as SVGElement).display).toBe('block')
  })

  it('synchronizes the native indeterminate property and keeps checked independent', () => {
    const input = renderCheckbox({ checked: true, indeterminate: true, readOnly: true })
    expect(input.indeterminate).toBe(true)
    expect(input.checked).toBe(true)
    expect(input.matches(':indeterminate')).toBe(true)

    act(() => root?.render(<Checkbox checked indeterminate={false} label="Notify assignee" readOnly />))
    expect(input.indeterminate).toBe(false)
    expect(input.checked).toBe(true)
  })

  it('renders decorative checked and indeterminate marks', () => {
    const input = renderCheckbox({ defaultChecked: true })
    const check = container?.querySelector('.signal-checkbox__check') as SVGElement
    const minus = container?.querySelector('.signal-checkbox__minus') as SVGElement
    expect(check.getAttribute('aria-hidden')).toBe('true')
    expect(minus.getAttribute('aria-hidden')).toBe('true')
    expect(getComputedStyle(check).display).toBe('block')
    expect(getComputedStyle(minus).display).toBe('none')

    act(() => root?.render(<Checkbox disabled indeterminate label="Notify assignee" />))
    expect(input.indeterminate).toBe(true)
    expect(getComputedStyle(check).display).toBe('none')
    expect(getComputedStyle(minus).display).toBe('block')
  })

  it('uses the Figma focus-visible geometry', () => {
    const input = renderCheckbox()
    act(() => input.focus())
    expect(input.matches(':focus-visible')).toBe(true)
    const focus = getComputedStyle(container?.querySelector('.signal-checkbox__control') as HTMLElement, '::after')
    expect(focus.borderTopWidth).toBe('2px')
    expect(focus.borderRadius).toBe('8px')
    expect(focus.inset).toBe('-4px')
  })

  it.each(['light', 'dark'] as const)('passes axe and preserves selected mark contrast in %s theme', async (theme) => {
    renderCheckbox({ defaultChecked: true, supportingText: 'Send a notification when this task changes.' })
    container?.setAttribute('data-theme', theme)
    if (container) container.style.background = 'var(--color-background-default)'
    const control = container?.querySelector('.signal-checkbox__control') as HTMLElement
    const styles = getComputedStyle(control)
    expect(contrast(styles.color, styles.backgroundColor)).toBeGreaterThanOrEqual(3)
    const results = await axe.run(container as HTMLDivElement)
    expect(results.violations).toEqual([])
  })

  it('passes axe in its native mixed state', async () => {
    const input = renderCheckbox({ indeterminate: true })
    expect(input.indeterminate).toBe(true)
    const results = await axe.run(container as HTMLDivElement)
    expect(results.violations).toEqual([])
  })
})
