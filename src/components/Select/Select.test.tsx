import '../../tokens/index.css'

import axe from 'axe-core'
import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Select } from './Select'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const options = (
  <>
    <option disabled value="">Select status</option>
    <option value="active">Active</option>
    <option value="paused">Paused</option>
  </>
)

let root: Root | undefined
let container: HTMLDivElement | undefined

function renderSelect(props: Partial<React.ComponentProps<typeof Select>> = {}) {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root?.render(
    <Select defaultValue="" label="Status" {...props}>{props.children ?? options}</Select>,
  ))

  const select = container.querySelector('select')
  if (!select) throw new Error('Select did not render')
  return select
}

function setNativeValue(select: HTMLSelectElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set
  setter?.call(select, value)
  select.dispatchEvent(new Event('change', { bubbles: true }))
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

describe('Select', () => {
  it('renders a native select and consumer-owned options', () => {
    const select = renderSelect()
    expect(select.tagName).toBe('SELECT')
    expect(select.options).toHaveLength(3)
    expect(select.options[0].text).toBe('Select status')
  })

  it('associates its label and preserves a supplied id', () => {
    const select = renderSelect({ id: 'project-status' })
    expect(select.id).toBe('project-status')
    expect(container?.querySelector('label')?.htmlFor).toBe('project-status')
  })

  it('generates a stable id for label association', () => {
    const select = renderSelect({ helperText: 'Choose one status.' })
    const originalId = select.id
    act(() => root?.render(<Select defaultValue="" helperText="Updated help" label="Status">{options}</Select>))
    expect(container?.querySelector('select')?.id).toBe(originalId)
    expect(container?.querySelector('label')?.htmlFor).toBe(originalId)
  })

  it('renders helper and Optional presentation', () => {
    renderSelect({ helperText: 'Choose one status.', optional: true })
    expect(container?.textContent).toContain('Choose one status.')
    expect(container?.textContent).toContain('Optional')
  })

  it('applies visual size without forwarding native size', () => {
    const select = renderSelect({ size: 'large' })
    expect(container?.firstElementChild?.getAttribute('data-size')).toBe('large')
    expect(select.hasAttribute('size')).toBe(false)
  })

  it('supports uncontrolled defaultValue', () => {
    expect(renderSelect({ defaultValue: 'paused' }).value).toBe('paused')
  })

  it('supports controlled value and onChange', () => {
    function ControlledSelect() {
      const [value, setValue] = useState('active')
      return <Select label="Status" onChange={(event) => setValue(event.target.value)} value={value}>{options}</Select>
    }

    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => root?.render(<ControlledSelect />))
    const select = container.querySelector('select') as HTMLSelectElement
    expect(select.value).toBe('active')
    act(() => setNativeValue(select, 'paused'))
    expect(select.value).toBe('paused')
  })

  it('forwards native attributes, form semantics, and refs', () => {
    const ref = { current: null as HTMLSelectElement | null }
    const select = renderSelect({ disabled: true, form: 'project-form', name: 'status', ref, required: true })
    expect(select.disabled).toBe(true)
    expect(select.getAttribute('form')).toBe('project-form')
    expect(select.name).toBe('status')
    expect(select.required).toBe(true)
    expect(ref.current).toBe(select)
  })

  it('participates in native form data', () => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => root?.render(
      <form>
        <Select defaultValue="active" label="Status" name="status">{options}</Select>
      </form>,
    ))
    const form = container.querySelector('form') as HTMLFormElement
    expect(new FormData(form).get('status')).toBe('active')
  })

  it('replaces helper text with an associated error', () => {
    const select = renderSelect({ error: 'Select a status.', helperText: 'Choose one status.' })
    const error = container?.querySelector('.signal-field-message[data-error]')
    expect(container?.textContent).not.toContain('Choose one status.')
    expect(error?.textContent).toContain('Select a status.')
    expect(select.getAttribute('aria-invalid')).toBe('true')
    expect(select.getAttribute('aria-describedby')).toBe(error?.id)
  })

  it('combines a consumer description with its active helper', () => {
    const select = renderSelect({ 'aria-describedby': 'external-description', helperText: 'Choose one status.' })
    const helper = container?.querySelector('.signal-field-message')
    expect(select.getAttribute('aria-describedby')).toBe(`external-description ${helper?.id}`)
  })

  it('keeps a hidden label accessible', async () => {
    renderSelect({ hideLabel: true })
    expect(container?.querySelector('.signal-field-label--hidden')).not.toBeNull()
    const results = await axe.run(container as HTMLDivElement)
    expect(results.violations).toEqual([])
  })

  it('marks the chevron and error icon as decorative and non-interactive', () => {
    renderSelect({ error: 'Select a status.' })
    const chevron = container?.querySelector('.signal-select__chevron') as SVGElement
    const errorIcon = container?.querySelector('.signal-field-message__error-icon')
    expect(chevron.getAttribute('aria-hidden')).toBe('true')
    expect(getComputedStyle(chevron).pointerEvents).toBe('none')
    expect(errorIcon?.getAttribute('aria-hidden')).toBe('true')
  })

  it('warns in development when optional and required are combined', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    renderSelect({ optional: true, required: true })
    expect(warn).toHaveBeenCalledWith('Signal Select: `optional` and native `required` should not be used together.')
  })

  it('uses the corrected radius/10 focus geometry', () => {
    const select = renderSelect()
    act(() => select.focus())
    const control = container?.querySelector('.signal-select__control') as HTMLElement
    const ring = getComputedStyle(control, '::after')
    expect(ring.borderRadius).toBe('10px')
    expect(ring.borderWidth).toBe('2px')
    expect(ring.inset).toBe('-4px')
  })

  it.each([
    ['default', {}],
    ['selected', { defaultValue: 'active' }],
    ['error', { error: 'Select a status.' }],
    ['disabled', { disabled: true }],
  ] as const)('passes axe checks for %s state', async (_name, props) => {
    renderSelect(props)
    const results = await axe.run(container as HTMLDivElement)
    expect(results.violations).toEqual([])
  })

  it.each(['light', 'dark'] as const)('passes representative contrast checks in %s theme', (theme) => {
    const select = renderSelect({ defaultValue: 'active', error: 'Select a status.' })
    container?.setAttribute('data-theme', theme)
    if (container) container.style.backgroundColor = 'var(--color-background-default)'
    const styles = getComputedStyle(select)
    const error = container?.querySelector('.signal-field-message[data-error]') as HTMLElement
    expect(contrast(styles.color, styles.backgroundColor)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(styles.borderColor, styles.backgroundColor)).toBeGreaterThanOrEqual(3)
    expect(contrast(getComputedStyle(error).color, getComputedStyle(container as HTMLDivElement).backgroundColor)).toBeGreaterThanOrEqual(4.5)
  })
})
