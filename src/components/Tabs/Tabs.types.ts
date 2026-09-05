import type { ComponentPropsWithRef } from 'react'

export interface TabsProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue'> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export type TabListProps = ComponentPropsWithRef<'div'>

export interface TabProps extends Omit<ComponentPropsWithRef<'button'>, 'aria-controls' | 'aria-selected' | 'id' | 'role' | 'tabIndex' | 'type' | 'value'> {
  value: string
}

export interface TabPanelProps extends Omit<ComponentPropsWithRef<'div'>, 'aria-labelledby' | 'hidden' | 'id' | 'role' | 'value'> {
  value: string
}
