import '../../tokens/index.css'
import axe from 'axe-core'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import { RelayTasks } from './RelayTasks'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT:boolean }).IS_REACT_ACT_ENVIRONMENT=true

describe('RelayTasks', () => {
  it('composes the Tasks campaign view with responsive table semantics and passes axe', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() => root.render(<RelayTasks />))
    expect(host.querySelector('[aria-current="page"]')?.textContent).toContain('Campaigns')
    expect(host.querySelector('[role="tab"][aria-selected="true"]')?.textContent).toContain('Tasks')
    expect(host.querySelectorAll('tbody tr')).toHaveLength(10)
    expect(host.querySelectorAll('select')).toHaveLength(3)
    expect((await axe.run(host)).violations).toEqual([])
    act(() => root.unmount())
    host.remove()
  })
})
