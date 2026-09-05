import '../../tokens/index.css'

import axe from 'axe-core'
import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { TextField } from './TextField'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let container: HTMLDivElement | undefined

function renderTextField(props: Partial<React.ComponentProps<typeof TextField>> = {}) {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root?.render(<TextField label="Project name" {...props} />))

  const input = container.querySelector('input')
  if (!input) throw new Error('TextField input did not render')
  return input
}

function setNativeValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
  setter?.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
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

describe('TextField', () => {
  it('renders a native input associated with its label', () => {
    const input = renderTextField()
    const label = container?.querySelector('label')
    expect(input.tagName).toBe('INPUT')
    expect(label?.textContent).toBe('Project name')
    expect(label?.htmlFor).toBe(input.id)
  })

  it('renders placeholder, helper text, and the optional indicator', () => {
    const input = renderTextField({ helperText: 'Use a concise name.', optional: true, placeholder: 'Enter a name' })
    expect(input.placeholder).toBe('Enter a name')
    expect(container?.textContent).toContain('Use a concise name.')
    expect(container?.textContent).toContain('Optional')
  })

  it('exposes the selected visual size without forwarding native size', () => {
    const input = renderTextField({ size: 'large' })
    expect(container?.firstElementChild?.getAttribute('data-size')).toBe('large')
    expect(input.hasAttribute('size')).toBe(false)
  })

  it('uses the radius/10 token for the outer focus indicator', () => {
    const input = renderTextField()
    act(() => input.focus())
    const control = container?.querySelector('.signal-text-field__control') as HTMLElement
    expect(getComputedStyle(control, '::after').borderRadius).toBe('10px')
  })

  it('forwards native input attributes and refs', () => {
    const ref = { current: null as HTMLInputElement | null }
    const input = renderTextField({ autoComplete: 'organization', name: 'project', ref, type: 'url' })
    expect(input.autocomplete).toBe('organization')
    expect(input.name).toBe('project')
    expect(input.type).toBe('url')
    expect(ref.current).toBe(input)
  })

  it('preserves a supplied id', () => {
    const input = renderTextField({ id: 'project-name' })
    expect(input.id).toBe('project-name')
    expect(container?.querySelector('label')?.htmlFor).toBe('project-name')
  })

  it('keeps its generated id stable across rerenders', () => {
    const input = renderTextField({ helperText: 'First helper' })
    const originalId = input.id
    act(() => root?.render(<TextField helperText="Updated helper" label="Project name" />))
    expect(container?.querySelector('input')?.id).toBe(originalId)
    expect(container?.querySelector('label')?.htmlFor).toBe(originalId)
  })

  it('supports controlled value and onChange', () => {
    function ControlledField() {
      const [value, setValue] = useState('Initial')
      return <TextField label="Project name" onChange={(event) => setValue(event.target.value)} value={value} />
    }

    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => root?.render(<ControlledField />))
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('Initial')
    act(() => setNativeValue(input, 'Updated'))
    expect(input.value).toBe('Updated')
  })

  it('supports an uncontrolled defaultValue', () => {
    expect(renderTextField({ defaultValue: 'Mobile checkout' }).value).toBe('Mobile checkout')
  })

  it('replaces helper text with an associated error', () => {
    const input = renderTextField({ error: 'Enter a valid project name.', helperText: 'Use a concise name.' })
    const error = container?.querySelector('.signal-field-message[data-error]')
    expect(container?.textContent).not.toContain('Use a concise name.')
    expect(error?.textContent).toContain('Enter a valid project name.')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toBe(error?.id)
  })

  it('marks the decorative error icon as hidden from assistive technology', () => {
    renderTextField({ error: 'Invalid value' })
    expect(container?.querySelector('.signal-field-message__error-icon')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('associates helper text and combines a consumer description', () => {
    const input = renderTextField({ 'aria-describedby': 'external-description', helperText: 'Use a concise name.' })
    const helper = container?.querySelector('.signal-field-message')
    expect(input.getAttribute('aria-describedby')).toBe(`external-description ${helper?.id}`)
  })

  it('keeps its label accessible when visually hidden', async () => {
    const input = renderTextField({ hideLabel: true, placeholder: 'Search' })
    expect(container?.querySelector('label')).not.toBeNull()
    expect(container?.querySelector('.signal-field-label--hidden')).not.toBeNull()
    expect(input.getAttribute('aria-label')).toBeNull()
    const results = await axe.run(container as HTMLDivElement)
    expect(results.violations).toEqual([])
  })

  it('preserves native disabled, readOnly, and required behavior', () => {
    let input = renderTextField({ disabled: true })
    expect(input.disabled).toBe(true)
    act(() => root?.unmount())
    container?.remove()
    root = undefined
    container = undefined

    input = renderTextField({ readOnly: true, required: true })
    expect(input.readOnly).toBe(true)
    expect(input.required).toBe(true)
  })

  it('warns in development when optional and required are combined', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    renderTextField({ optional: true, required: true })
    expect(warn).toHaveBeenCalledWith('Signal TextField: `optional` and native `required` should not be used together.')
  })

  it.each([
    ['normal', {}],
    ['error', { error: 'Enter a valid project name.' }],
    ['hidden label', { hideLabel: true, placeholder: 'Search' }],
  ] as const)('passes axe checks for a %s field', async (_name, props) => {
    renderTextField(props)
    const results = await axe.run(container as HTMLDivElement)
    expect(results.violations).toEqual([])
  })

  it.each(['light', 'dark'] as const)('passes axe and contrast checks in %s theme', async (theme) => {
    const input = renderTextField({ defaultValue: 'Invalid project', error: 'Enter a valid project name.' })
    container?.setAttribute('data-theme', theme)
    if (container) container.style.backgroundColor = 'var(--color-background-default)'
    const inputStyles = getComputedStyle(input)
    const error = container?.querySelector('.signal-field-message[data-error]') as HTMLElement
    const errorStyles = getComputedStyle(error)
    expect(contrast(inputStyles.color, inputStyles.backgroundColor)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(inputStyles.borderColor, inputStyles.backgroundColor)).toBeGreaterThanOrEqual(3)
    expect(contrast(errorStyles.color, getComputedStyle(container as HTMLDivElement).backgroundColor)).toBeGreaterThanOrEqual(4.5)
    const results = await axe.run(container as HTMLDivElement)
    expect(results.violations).toEqual([])
  })
})
