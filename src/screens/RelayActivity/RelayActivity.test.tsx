import '../../tokens/index.css'
import axe from 'axe-core'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import { RelayActivity } from './RelayActivity'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT:boolean }).IS_REACT_ACT_ENVIRONMENT=true

describe('RelayActivity', () => {
  it('composes the Activity campaign view as a named feed and passes axe', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() => root.render(<RelayActivity />))
    expect(host.querySelector('[aria-current="page"]')?.textContent).toContain('Campaigns')
    expect(host.querySelector('[role="tab"][aria-selected="true"]')?.textContent).toContain('Activity')
    expect(host.querySelectorAll('.signal-activity-feed > li')).toHaveLength(7)
    expect(host.textContent).not.toContain('ofHero banner copy')
    expect(host.textContent).not.toContain('onEmail drip sequence')
    expect((await axe.run(host)).violations).toEqual([])
    act(() => root.unmount())
    host.remove()
  })
})
