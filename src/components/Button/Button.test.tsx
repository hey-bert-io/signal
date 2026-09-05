import axe from 'axe-core'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Button } from './Button'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let container: HTMLDivElement | undefined

function renderButton(props: React.ComponentProps<typeof Button> = {}) {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root?.render(<Button {...props}>{props.children ?? 'Save changes'}</Button>))

  const button = container.querySelector('button')
  if (!button) throw new Error('Button did not render')
  return button
}

afterEach(() => {
  act(() => root?.unmount())
  container?.remove()
  root = undefined
  container = undefined
})

describe('Button', () => {
  it('renders children with native button semantics', () => {
    const button = renderButton()
    expect(button.textContent).toBe('Save changes')
    expect(button.tagName).toBe('BUTTON')
  })

  it('exposes the selected variant and size configuration', () => {
    const button = renderButton({ variant: 'danger', size: 'large' })
    expect(button.dataset.variant).toBe('danger')
    expect(button.dataset.size).toBe('large')
  })

  it('forwards native button props and refs', () => {
    const ref = { current: null as HTMLButtonElement | null }
    const button = renderButton({ 'aria-label': 'Save the project', name: 'save', ref })
    expect(button.getAttribute('aria-label')).toBe('Save the project')
    expect(button.getAttribute('name')).toBe('save')
    expect(ref.current).toBe(button)
  })

  it('handles clicks', () => {
    const onClick = vi.fn()
    renderButton({ onClick }).click()
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('prevents clicks when disabled', () => {
    const onClick = vi.fn()
    renderButton({ disabled: true, onClick }).click()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('defaults type to button', () => {
    expect(renderButton().getAttribute('type')).toBe('button')
  })

  it('preserves an explicitly supplied type', () => {
    expect(renderButton({ type: 'submit' }).getAttribute('type')).toBe('submit')
  })

  it('has no obvious axe accessibility violations', async () => {
    renderButton({ leadingIcon: <span>+</span> })
    const results = await axe.run(container as HTMLDivElement)
    expect(results.violations).toEqual([])
  })
})
