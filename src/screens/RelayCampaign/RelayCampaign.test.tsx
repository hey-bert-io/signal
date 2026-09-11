import '../../tokens/index.css'

import axe from 'axe-core'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'

import type { CampaignView } from '../../components/CampaignHeader'
import { RelayCampaign } from './RelayCampaign'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let host: HTMLDivElement | undefined
let root: Root | undefined

function render(view: CampaignView = 'overview', theme: 'light' | 'dark' = 'light') {
  host = document.createElement('div')
  host.dataset.theme = theme
  document.body.append(host)
  root = createRoot(host)
  act(() => root?.render(<RelayCampaign initialView={view} />))
  return host
}

function tabs() {
  return Array.from(host?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [])
}

function selectedPanel() {
  const selectedTab = tabs().find((tab) => tab.getAttribute('aria-selected') === 'true')
  return {
    panel: host?.querySelector<HTMLElement>(`#${CSS.escape(selectedTab?.getAttribute('aria-controls') ?? '')}`),
    tab: selectedTab,
  }
}

function cleanup() {
  act(() => root?.unmount())
  host?.remove()
  root = undefined
  host = undefined
}

afterEach(async () => {
  cleanup()
  await page.viewport(1280, 720)
})

describe('RelayCampaign', () => {
  it('connects each campaign tab to the product content it reveals', async () => {
    render()
    expect(host?.querySelectorAll('main')).toHaveLength(1)
    expect(selectedPanel().panel?.textContent).toContain('Campaign brief')

    for (const [label, accessibleContent] of [['Tasks', 'Relay campaign tasks'], ['Activity', 'Relay campaign activity']] as const) {
      const tab = tabs().find((item) => item.textContent?.includes(label)) as HTMLButtonElement
      await act(async () => userEvent.click(tab))
      const selected = selectedPanel()
      expect(selected.tab).toBe(tab)
      expect(selected.panel?.getAttribute('role')).toBe('tabpanel')
      expect(selected.panel?.getAttribute('aria-labelledby')).toBe(tab.id)
      expect(host?.querySelector(`[aria-label="${accessibleContent}"]`)).not.toBeNull()
    }
  })

  it('supports a real-browser keyboard workflow through tabs, filters, and task selection', async () => {
    render()
    const overview = tabs()[0]
    overview.focus()

    await act(async () => userEvent.keyboard('{ArrowRight}'))
    const tasksTab = tabs()[1]
    expect(document.activeElement).toBe(tasksTab)
    expect(selectedPanel().panel?.querySelector('table')).not.toBeNull()

    await act(async () => userEvent.tab())
    const status = host?.querySelector<HTMLSelectElement>('select')
    expect(document.activeElement).toBe(status)
    await act(async () => userEvent.tab({ shift: true }))
    expect(document.activeElement).toBe(tasksTab)

    act(() => status?.focus())
    await act(async () => userEvent.selectOptions(status as HTMLSelectElement, 'Blocked'))
    expect(status?.value).toBe('Blocked')
    expect(host?.querySelectorAll('tbody tr')).toHaveLength(1)
    expect(host?.querySelector('[aria-label="1 visible tasks"]')).not.toBeNull()

    const checkbox = host?.querySelector<HTMLInputElement>('tbody input[type="checkbox"]')
    act(() => checkbox?.focus())
    await act(async () => userEvent.keyboard('[Space]'))
    expect(checkbox?.checked).toBe(true)
    expect(checkbox?.closest('tr')?.hasAttribute('data-selected')).toBe(true)
  })

  it('keeps unimplemented sidebar destinations visible, disabled, and target-free', () => {
    render()
    expect(host?.querySelector('a[aria-current="page"]')?.textContent).toBe('Campaigns')
    const disabled = [...(host?.querySelectorAll<HTMLButtonElement>('.signal-app-shell__navigation-list button[disabled]') ?? [])]
    expect(disabled.map((item) => item.textContent)).toEqual(['My tasks', 'Analytics', 'Team', 'Settings'])
    expect(disabled.every((item) => item.getAttribute('aria-disabled') === 'true')).toBe(true)
    expect(host?.querySelector('a[href="#tasks"], a[href="#analytics"], a[href="#team"], a[href="#settings"]')).toBeNull()
  })

  it.each(['light', 'dark'] as const)('opens an accessible, theme-aware new task dialog and restores focus in %s mode', async (theme) => {
    render('tasks', theme)
    const trigger = host?.querySelector<HTMLButtonElement>('.signal-relay-tasks__actions .signal-button') as HTMLButtonElement
    await act(async () => userEvent.click(trigger))
    const dialog = host?.querySelector<HTMLDialogElement>('dialog') as HTMLDialogElement
    expect(dialog.open).toBe(true)
    expect(dialog.getAttribute('role')).toBe('dialog')
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.getAttribute('aria-labelledby')).toBe('relay-new-task-title')
    expect((document.activeElement as HTMLInputElement)?.placeholder).toBe('e.g. Write launch email')
    expect((await axe.run(host as HTMLDivElement)).violations).toEqual([])
    await act(async () => userEvent.tab({ shift: true }))
    expect(dialog.contains(document.activeElement)).toBe(true)
    await act(async () => userEvent.keyboard('{Escape}'))
    expect(host?.querySelector('dialog')).toBeNull()
    expect(document.activeElement).toBe(trigger)

    await act(async () => userEvent.click(trigger))
    await act(async () => userEvent.click(host?.querySelector<HTMLButtonElement>('button[aria-label="Close new task dialog"]') as HTMLButtonElement))
    expect(host?.querySelector('dialog')).toBeNull()
    expect(document.activeElement).toBe(trigger)

    await act(async () => userEvent.click(trigger))
    await act(async () => userEvent.click(host?.querySelector<HTMLButtonElement>('.signal-new-task-dialog__footer .signal-button[data-variant="ghost"]') as HTMLButtonElement))
    expect(host?.querySelector('dialog')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it('passes axe for every Relay view in light and dark themes', async () => {
    for (const theme of ['light', 'dark'] as const) {
      for (const view of ['overview', 'tasks', 'activity'] as const) {
        render(view, theme)
        expect((await axe.run(host as HTMLDivElement)).violations).toEqual([])
        cleanup()
      }
    }
  })

  it.each([1440, 1280, 1232, 1100, 1024, 900, 768, 767, 600, 393, 320])('keeps every Relay view usable at a %dpx viewport', async (width) => {
    await page.viewport(width, 900)

    for (const view of ['overview', 'tasks', 'activity'] as const) {
      render(view)
      expect((host as HTMLDivElement).scrollWidth).toBeLessThanOrEqual((host as HTMLDivElement).clientWidth)

      const { panel, tab } = selectedPanel()
      expect(panel?.hidden).toBe(false)
      tab?.focus()
      const tabRect = tab?.getBoundingClientRect() as DOMRect
      const tabListRect = tab?.parentElement?.getBoundingClientRect() as DOMRect
      expect(tabRect.top - 4).toBeGreaterThanOrEqual(tabListRect.top)
      expect(tabRect.bottom + 4).toBeLessThanOrEqual(tabListRect.bottom)

      if (view === 'tasks') {
        const filters = host?.querySelector('.signal-filter-bar') as HTMLElement
        expect(filters.scrollWidth).toBeLessThanOrEqual(filters.clientWidth)
        expect(host?.querySelector('table')?.getBoundingClientRect().right).toBeLessThanOrEqual(width)
        const table = host?.querySelector('table') as HTMLTableElement
        const section = host?.querySelector('.signal-relay-tasks__section') as HTMLElement
        expect(table.getBoundingClientRect().width).toBe(section.getBoundingClientRect().width)
        const visibleHeaders = [...table.querySelectorAll<HTMLTableCellElement>('th')].filter((cell) => getComputedStyle(cell).visibility !== 'hidden')
        expect(visibleHeaders.at(-1)?.textContent).toBe('Due')
        expect(visibleHeaders.at(-1)?.getBoundingClientRect().right).toBe(table.getBoundingClientRect().right)
        expect(new Set(visibleHeaders.map((cell) => getComputedStyle(cell).backgroundColor)).size).toBe(1)
        const visibleBodyCells = [...table.querySelectorAll<HTMLTableCellElement>('tbody tr:not([data-selected]) td')].filter((cell) => getComputedStyle(cell).visibility !== 'hidden')
        expect(new Set(visibleBodyCells.map((cell) => getComputedStyle(cell).backgroundColor)).size).toBe(1)
        const selectedCells = [...table.querySelectorAll<HTMLTableCellElement>('tbody tr[data-selected] td')].filter((cell) => getComputedStyle(cell).visibility !== 'hidden')
        expect(new Set(selectedCells.map((cell) => getComputedStyle(cell).backgroundColor)).size).toBe(1)
      }

      cleanup()
    }
  })
})
