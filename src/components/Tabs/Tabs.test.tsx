import '../../tokens/index.css'

import axe from 'axe-core'
import { act, createRef, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Tab, TabList, TabPanel, Tabs } from './Tabs'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let container: HTMLDivElement | undefined

function Composition({
  defaultValue,
  disabledTasks = false,
  onValueChange,
  value,
}: {
  defaultValue?: string
  disabledTasks?: boolean
  onValueChange?: (value: string) => void
  value?: string
}) {
  return (
    <Tabs defaultValue={defaultValue} onValueChange={onValueChange} value={value}>
      <TabList aria-label="Project sections" data-list="project">
        <Tab data-native="overview" value="overview">Overview</Tab>
        <Tab disabled={disabledTasks} value="tasks">Tasks</Tab>
        <Tab value="activity">Activity</Tab>
      </TabList>
      <TabPanel value="overview">Overview panel</TabPanel>
      <TabPanel value="tasks">Tasks panel</TabPanel>
      <TabPanel value="activity">Activity panel</TabPanel>
    </Tabs>
  )
}

function render(ui = <Composition defaultValue="overview" />) {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root?.render(ui))
  return container
}

function tabs() {
  return Array.from(container?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [])
}

function key(element: HTMLElement, value: string) {
  act(() => element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: value })))
}

afterEach(() => {
  act(() => root?.unmount())
  container?.remove()
  root = undefined
  container = undefined
  vi.restoreAllMocks()
})

describe('Tabs', () => {
  it('renders named tablist, tab, and panel semantics with one selected tab', () => {
    render()
    const list = container?.querySelector('[role="tablist"]')
    expect(list?.getAttribute('aria-label')).toBe('Project sections')
    expect(tabs()).toHaveLength(3)
    expect(tabs().filter((tab) => tab.getAttribute('aria-selected') === 'true')).toHaveLength(1)
    expect(tabs().map((tab) => tab.tabIndex)).toEqual([0, -1, -1])
    expect(container?.querySelectorAll('[role="tabpanel"]')).toHaveLength(3)
  })

  it('pairs tabs and panels without deriving IDs from labels or values', () => {
    render()
    for (const tab of tabs()) {
      const panelId = tab.getAttribute('aria-controls')
      const panel = container?.querySelector<HTMLElement>(`#${CSS.escape(panelId ?? '')}`)
      expect(tab.id).toMatch(/^signal-tabs-/)
      expect(tab.id).not.toContain(tab.dataset.value ?? 'overview')
      expect(panel?.getAttribute('aria-labelledby')).toBe(tab.id)
    }
  })

  it('uses defaultValue and exposes only its selected panel', () => {
    render(<Composition defaultValue="tasks" />)
    expect(tabs()[1].getAttribute('aria-selected')).toBe('true')
    const panels = Array.from(container?.querySelectorAll<HTMLElement>('[role="tabpanel"]') ?? [])
    expect(panels.map((panel) => panel.hidden)).toEqual([true, false, true])
  })

  it('falls back to the first enabled tab when no initial value is provided', () => {
    render(<Composition disabledTasks />)
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true')
    expect(tabs()[0].tabIndex).toBe(0)
  })

  it('selects enabled tabs by click and changes the exposed panel', () => {
    render()
    act(() => tabs()[2].click())
    expect(tabs()[2].getAttribute('aria-selected')).toBe('true')
    expect(container?.querySelector<HTMLElement>('[role="tabpanel"]:not([hidden])')?.textContent).toBe('Activity panel')
  })

  it('does not select a disabled tab', () => {
    const onValueChange = vi.fn()
    render(<Composition defaultValue="overview" disabledTasks onValueChange={onValueChange} />)
    act(() => tabs()[1].click())
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true')
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('keeps controlled selection governed by value while requesting changes', () => {
    const onValueChange = vi.fn()
    render(<Composition onValueChange={onValueChange} value="overview" />)
    act(() => tabs()[2].click())
    expect(onValueChange).toHaveBeenCalledWith('activity')
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true')
    expect(tabs()[2].getAttribute('aria-selected')).toBe('false')
  })

  it('supports a controlled consumer update', () => {
    function Controlled() {
      const [value, setValue] = useState('overview')
      return <Composition onValueChange={setValue} value={value} />
    }
    render(<Controlled />)
    act(() => tabs()[1].click())
    expect(tabs()[1].getAttribute('aria-selected')).toBe('true')
  })

  it('moves and automatically selects with horizontal arrow keys, including wrapping', () => {
    render()
    tabs()[0].focus()
    key(tabs()[0], 'ArrowRight')
    expect(document.activeElement).toBe(tabs()[1])
    expect(tabs()[1].getAttribute('aria-selected')).toBe('true')
    key(tabs()[1], 'ArrowLeft')
    expect(document.activeElement).toBe(tabs()[0])
    key(tabs()[0], 'ArrowLeft')
    expect(document.activeElement).toBe(tabs()[2])
    key(tabs()[2], 'ArrowRight')
    expect(document.activeElement).toBe(tabs()[0])
  })

  it('uses Home and End and skips disabled tabs', () => {
    render(<Composition defaultValue="overview" disabledTasks />)
    tabs()[0].focus()
    key(tabs()[0], 'ArrowRight')
    expect(document.activeElement).toBe(tabs()[2])
    key(tabs()[2], 'Home')
    expect(document.activeElement).toBe(tabs()[0])
    key(tabs()[0], 'End')
    expect(document.activeElement).toBe(tabs()[2])
    expect(tabs().map((tab) => tab.tabIndex)).toEqual([-1, -1, 0])
  })

  it('falls back when the selected tab is removed or becomes disabled', () => {
    const renderDynamic = (showTasks: boolean, disabledOverview = false) => (
      <Tabs defaultValue="tasks">
        <TabList aria-label="Sections">
          <Tab disabled={disabledOverview} value="overview">Overview</Tab>
          {showTasks ? <Tab value="tasks">Tasks</Tab> : null}
          <Tab value="activity">Activity</Tab>
        </TabList>
        <TabPanel value="overview">Overview</TabPanel>
        {showTasks ? <TabPanel value="tasks">Tasks</TabPanel> : null}
        <TabPanel value="activity">Activity</TabPanel>
      </Tabs>
    )
    render(renderDynamic(true))
    expect(tabs()[1].getAttribute('aria-selected')).toBe('true')
    act(() => root?.render(renderDynamic(false)))
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true')
    act(() => root?.render(renderDynamic(false, true)))
    expect(tabs()[1].getAttribute('aria-selected')).toBe('true')
  })

  it('forwards native attributes, class names, handlers, and refs', () => {
    const tabsRef = createRef<HTMLDivElement>()
    const listRef = createRef<HTMLDivElement>()
    const tabRef = createRef<HTMLButtonElement>()
    const panelRef = createRef<HTMLDivElement>()
    const onClick = vi.fn()
    render(
      <Tabs className="root-class" data-root="yes" defaultValue="one" ref={tabsRef}>
        <TabList aria-labelledby="heading" className="list-class" ref={listRef}>
          <Tab className="tab-class" data-tab="yes" onClick={onClick} ref={tabRef} value="one">One</Tab>
        </TabList>
        <TabPanel className="panel-class" data-panel="yes" ref={panelRef} value="one">Panel</TabPanel>
      </Tabs>,
    )
    act(() => tabRef.current?.click())
    expect(tabsRef.current?.className).toContain('root-class')
    expect(listRef.current?.className).toContain('list-class')
    expect(tabRef.current?.className).toContain('tab-class')
    expect(panelRef.current?.className).toContain('panel-class')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('exposes the selected, disabled, and zero-shift focus visual hooks', () => {
    render(<Composition disabledTasks />)
    expect(tabs()[0].hasAttribute('data-selected')).toBe(true)
    expect(tabs()[1].disabled).toBe(true)
    const width = tabs()[0].getBoundingClientRect().width
    tabs()[0].focus()
    const focus = getComputedStyle(tabs()[0], '::after')
    expect(focus.borderTopWidth).toBe('2px')
    expect(focus.borderRadius).toBe('6px')
    expect(focus.inset).toBe('-4px')
    expect(tabs()[0].getBoundingClientRect().width).toBe(width)
    expect(getComputedStyle(container?.querySelector('.signal-tab__indicator') as HTMLElement).height).toBe('2px')
  })

  it.each(['light', 'dark'] as const)('passes axe in %s theme', async (theme) => {
    render(<Composition defaultValue="overview" disabledTasks />)
    container?.setAttribute('data-theme', theme)
    if (container) {
      container.style.background = 'var(--color-background-default)'
      container.style.color = 'var(--color-text-primary)'
    }
    const results = await axe.run(container as HTMLDivElement)
    expect(results.violations).toEqual([])
  })
})
