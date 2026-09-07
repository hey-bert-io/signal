import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import { ActivityFeed } from './ActivityItem'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT:boolean }).IS_REACT_ACT_ENVIRONMENT=true
const activities = [{ id: 'status', actor: { initials: 'SR', name: 'Sofia Reyes' }, action: 'updated status of', object: 'Hero banner copy', status: { label: 'In progress', tone: 'info' as const }, time: '2h ago' }]

describe('ActivityFeed', () => {
  it('keeps record content separated in a semantic ordered feed', () => {
    const host = document.createElement('div')
    act(() => createRoot(host).render(<ActivityFeed aria-label="Campaign activity" activities={activities} />))
    expect(host.querySelector('ol')?.getAttribute('aria-label')).toBe('Campaign activity')
    expect(host.querySelectorAll('li')).toHaveLength(1)
    expect(host.querySelector('.signal-activity-item__headline')?.children).toHaveLength(3)
    expect(host.textContent).not.toContain('ofHero')
  })
})
