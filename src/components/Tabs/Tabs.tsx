import './Tabs.css'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type Ref,
} from 'react'

import type { TabListProps, TabPanelProps, TabProps, TabsProps } from './Tabs.types'

interface RegisteredTab {
  disabled: boolean
  element: HTMLButtonElement
  value: string
}

interface TabsContextValue {
  getIds: (value: string) => { panelId: string; tabId: string }
  moveFocus: (value: string, destination: 'first' | 'last' | 'next' | 'previous') => void
  registerTab: (value: string, tab: RegisteredTab) => () => void
  select: (value: string) => void
  selectedValue: string | undefined
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext(component: string) {
  const context = useContext(TabsContext)
  if (!context) throw new Error(`${component} must be used within Tabs`)
  return context
}

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value)
  else if (ref) ref.current = value
}

export function Tabs({
  children,
  className,
  defaultValue,
  onValueChange,
  ref,
  value,
  ...rootProps
}: TabsProps) {
  const generatedId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const idsRef = useRef(new Map<string, { panelId: string; tabId: string }>())
  const idCounterRef = useRef(0)
  const lastFallbackNotificationRef = useRef<string | undefined>(undefined)
  const [registeredTabs, setRegisteredTabs] = useState<RegisteredTab[]>([])
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const controlled = value !== undefined
  const enabledTabs = registeredTabs.filter((tab) => !tab.disabled)
  const uncontrolledSelectionIsEnabled = enabledTabs.some((tab) => tab.value === uncontrolledValue)
  const selectedValue = controlled
    ? value
    : uncontrolledSelectionIsEnabled
      ? uncontrolledValue
      : enabledTabs[0]?.value ?? uncontrolledValue

  const select = useCallback((nextValue: string) => {
    if (!controlled) {
      setUncontrolledValue(nextValue)
    }
    onValueChange?.(nextValue)
  }, [controlled, onValueChange])

  const registerTab = useCallback((tabValue: string, tab: RegisteredTab) => {
    setRegisteredTabs((tabs) => [...tabs.filter((entry) => entry.value !== tabValue), { ...tab, value: tabValue }])
    return () => {
      setRegisteredTabs((tabs) => tabs.filter((entry) => entry.element !== tab.element))
      setUncontrolledValue((currentValue) => currentValue === tabValue ? undefined : currentValue)
    }
  }, [])

  const getEnabledTabs = useCallback(() => {
    const elements = rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []
    return Array.from(elements).filter((element) => !element.disabled)
  }, [])

  const moveFocus = useCallback((currentValue: string, destination: 'first' | 'last' | 'next' | 'previous') => {
    const enabledTabs = getEnabledTabs()
    if (!enabledTabs.length) return
    const currentIndex = enabledTabs.findIndex((tab) => tab.dataset.value === currentValue)
    let nextIndex = currentIndex

    if (destination === 'first') nextIndex = 0
    if (destination === 'last') nextIndex = enabledTabs.length - 1
    if (destination === 'next') nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % enabledTabs.length
    if (destination === 'previous') nextIndex = currentIndex <= 0 ? enabledTabs.length - 1 : currentIndex - 1

    const nextTab = enabledTabs[nextIndex]
    const nextValue = nextTab.dataset.value
    if (!nextValue) return
    nextTab.focus()
    select(nextValue)
  }, [getEnabledTabs, select])

  const getIds = useCallback((tabValue: string) => {
    const existing = idsRef.current.get(tabValue)
    if (existing) return existing
    const index = idCounterRef.current++
    const ids = {
      tabId: `signal-tabs-${generatedId}-tab-${index}`,
      panelId: `signal-tabs-${generatedId}-panel-${index}`,
    }
    idsRef.current.set(tabValue, ids)
    return ids
  }, [generatedId])

  const fallbackValue = enabledTabs[0]?.value
  useEffect(() => {
    if (!controlled) {
      if (uncontrolledValue !== undefined) {
        lastFallbackNotificationRef.current = undefined
      } else if (selectedValue && lastFallbackNotificationRef.current !== selectedValue) {
        lastFallbackNotificationRef.current = selectedValue
        onValueChange?.(selectedValue)
      }
      return
    }
    if (fallbackValue && !registeredTabs.some((tab) => tab.value === value && !tab.disabled)) {
      onValueChange?.(fallbackValue)
    }
  }, [controlled, fallbackValue, onValueChange, registeredTabs, selectedValue, uncontrolledValue, value])

  const context = useMemo<TabsContextValue>(() => ({
    getIds,
    moveFocus,
    registerTab,
    select,
    selectedValue,
  }), [getIds, moveFocus, registerTab, select, selectedValue])
  const classes = ['signal-tabs', className].filter(Boolean).join(' ')

  return (
    <TabsContext.Provider value={context}>
      <div
        {...rootProps}
        ref={(node) => {
          rootRef.current = node
          setRef(ref, node)
        }}
        className={classes}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabList({ className, ref, ...listProps }: TabListProps) {
  useTabsContext('TabList')
  const classes = ['signal-tab-list', className].filter(Boolean).join(' ')
  return <div {...listProps} ref={ref} className={classes} role="tablist" />
}

export function Tab({
  children,
  className,
  disabled = false,
  onClick,
  onKeyDown,
  ref,
  value,
  ...buttonProps
}: TabProps) {
  const context = useTabsContext('Tab')
  const { registerTab } = context
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { panelId, tabId } = context.getIds(value)
  const selected = context.selectedValue === value
  const classes = ['signal-tab', className].filter(Boolean).join(' ')

  useLayoutEffect(() => {
    const element = buttonRef.current
    if (!element) return
    return registerTab(value, { disabled, element, value })
  }, [disabled, registerTab, value])

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented && !disabled) context.select(value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || disabled) return
    const destinations = {
      ArrowLeft: 'previous',
      ArrowRight: 'next',
      End: 'last',
      Home: 'first',
    } as const
    const destination = destinations[event.key as keyof typeof destinations]
    if (!destination) return
    event.preventDefault()
    context.moveFocus(value, destination)
  }

  return (
    <button
      {...buttonProps}
      ref={(node) => {
        buttonRef.current = node
        setRef(ref, node)
      }}
      aria-controls={panelId}
      aria-selected={selected}
      className={classes}
      data-selected={selected ? '' : undefined}
      data-value={value}
      disabled={disabled}
      id={tabId}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="tab"
      tabIndex={selected && !disabled ? 0 : -1}
      type="button"
    >
      <span className="signal-tab__label">{children}</span>
      <span aria-hidden="true" className="signal-tab__indicator" />
    </button>
  )
}

export function TabPanel({ children, className, ref, value, ...panelProps }: TabPanelProps) {
  const context = useTabsContext('TabPanel')
  const { panelId, tabId } = context.getIds(value)
  const selected = context.selectedValue === value
  const classes = ['signal-tab-panel', className].filter(Boolean).join(' ')

  return (
    <div
      {...panelProps}
      ref={ref}
      aria-labelledby={tabId}
      className={classes}
      hidden={!selected}
      id={panelId}
      role="tabpanel"
    >
      {children}
    </div>
  )
}
