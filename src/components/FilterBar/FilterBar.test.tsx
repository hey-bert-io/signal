import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { FilterBar } from './FilterBar'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT:boolean }).IS_REACT_ACT_ENVIRONMENT=true

describe('FilterBar', () => {
  it('renders three named native filters and reports product values', () => {
    const host = document.createElement('div')
    const onChange = vi.fn()
    act(() => createRoot(host).render(<FilterBar filters={{ status: 'All', assignee: 'Anyone', priority: 'All' }} onChange={onChange} />))
    expect(host.querySelectorAll('select')).toHaveLength(3)
    expect(host.querySelector('label')?.textContent).toBe('Status')
    const status = host.querySelector('select')!
    act(() => { status.value = 'Done'; status.dispatchEvent(new Event('change', { bubbles: true })) })
    expect(onChange).toHaveBeenCalledWith({ status: 'Done', assignee: 'Anyone', priority: 'All' })
  })
})
