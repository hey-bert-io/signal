import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import { TaskTable } from './TaskTable'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT:boolean }).IS_REACT_ACT_ENVIRONMENT=true
const tasks = [{ id: 'hero', title: 'Hero banner copy', status: { label: 'In progress', tone: 'info' as const }, assignee: { initials: 'SR', name: 'Sofia Reyes' }, priority: 'High' as const, due: 'Oct 3', selected: true }]

describe('TaskTable', () => {
  it('uses native table semantics and named task selection', () => {
    const host = document.createElement('div')
    act(() => createRoot(host).render(<TaskTable aria-label="Campaign tasks" tasks={tasks} />))
    expect(host.querySelector('table')?.getAttribute('aria-label')).toBe('Campaign tasks')
    expect(host.querySelectorAll('th')).toHaveLength(6)
    expect(host.querySelector('input')?.getAttribute('aria-label')).toBe('Select Hero banner copy')
    expect(host.querySelector('input')?.checked).toBe(true)
    expect(host.querySelector('tbody tr')?.hasAttribute('data-selected')).toBe(true)
  })
})
